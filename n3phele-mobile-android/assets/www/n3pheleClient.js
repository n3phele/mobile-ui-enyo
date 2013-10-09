function N3pheleClient(ajaxFactory)
{
	//this.serverAddress = "http://n3phele-dev.appspot.com/resources/";	
	if(typeof(serverAddress)!=='undefined')
	{
		this.serverAddress = serverAddress;
	}

	this.userName = "";
	this.userPassword = "";
	this.recentRequests = 0;

	//This class uses a factory to create an ajax object for http access. By default uses enyo.Ajax.
	if(ajaxFactory)
	{
		this.ajaxFactory = ajaxFactory;
	}
	else
	{
		this.ajaxFactory = new Object();
		this.ajaxFactory.create = function(o, skipIncrement) { if( !skipIncrement ) n3phele.incrementRequests(); return new enyo.Ajax(o); };
	}

	this.incrementRequests = function()
	{
		this.recentRequests++;
	}

	this.getRecentRequests = function()
	{
		var count = this.recentRequests;
		this.recentRequests = 0;

		return count;
	}

	this.prepareAuthentication = function()
	{
		if (this.uid) return;
		var hdr = this.userName.replace("@", ".at-.") + ":" + this.userPassword;
		var encodeHdr = Base64.encode( hdr );
		this.uid = encodeHdr;
	};

	this.listRepositories = function(success, error)
	{
		this.prepareAuthentication();

		var ajaxComponent = this.ajaxFactory.create({
			url: this.serverAddress+"repository",
			headers:{ 'authorization' : "Basic "+ this.uid},
			method: "GET",
			contentType: "application/x-www-form-urlencoded",
			sync: false, 
		}); 

		ajaxComponent.go()
		.response(this, function(sender, response){	
			response.elements = fixArrayInformation(response.elements);
			if(success) success(response.elements);
		})
		.error(this, function(){
			console.log("N3pheleClient: Error to load the list of repositories");
			if(error) error();
		});		
	}

	this.listRepositoryFiles = function(repository,success, error)
	{
		this.prepareAuthentication();
		var ajaxComponent = this.ajaxFactory.create({
			url: repository.uri + '/list',
			headers:{ 'authorization' : "Basic "+ this.uid},
			method: "GET",
			contentType: "application/x-www-form-urlencoded",
			sync: false
		});

		ajaxComponent.go()
		.response(this, function(sender, response){
			response.crumbs.files = fixArrayInformation(response.files);
			if(success) success(response.crumbs.files);
		})
		.error(this, function(){
			console.log("Error to load the list of files");
			if(error) error();
		});		
	}

	this.listFolderFiles = function(folder, success, error)
	{
		this.prepareAuthentication();
		var ajaxComponent = this.ajaxFactory.create({
			url: folder.repository + '/list?prefix=' + folder.name + '%2F',
			headers:{ 'authorization' : "Basic "+ this.uid},
			method: "GET",
			contentType: "application/x-www-form-urlencoded",
			sync: false
		});

		ajaxComponent.go()
		.response(this, function(sender, response){
			response.crumbs.files = fixArrayInformation(response.files);
			if(success) success(response.crumbs.files);
		})
		.error(this, function(){
			console.log("Error to load the list of files");
			if(error) error();
		});		
	}

	/*
		this function get the runnable activities from the server using ajax.
	*/	
	
	this.getProcessSummary = function(component, uid, process){
		var ajaxParams = {
			url: process.uri,
			headers:{ 'authorization' : "Basic "+ uid},
			method: "GET",
			contentType: "application/x-www-form-urlencoded",
			sync: false, 
		};
			
		var ajaxComponent = n3phele.ajaxFactory.create(ajaxParams); //connection parameters
		
		ajaxComponent
		.go({'summary' : true})
		.response( this, function(sender, response){
			if (component) component(sender, response)
		})
		.error( this, function(){ 
			alert("Connection Lost");
			this.doLost();
		})
	}
	
	this.listActivityHistory = function(start, end, success, error)
	{	
		var ajaxComponent = this.ajaxFactory.create({
			url: serverAddress+"process",
			headers:{ 'authorization' : "Basic "+ this.uid},
			method: "GET",
			contentType: "application/x-www-form-urlencoded",
			sync: false, 
		}); //connection parameters

		ajaxComponent
		.go({'summary' : true, 'start' : start, 'end' : end})
		.response( this, function(sender, response){
			response.elements = fixArrayInformation(response.elements);
			if(success) success(response.elements);
		} )
		.error( this, function(){ 
				console.log("Error to load recent activities!!");
				if(error) error();
			}
		);
	}

	this.listActivityDetail = function(processUri, success, error)
	{
		var ajaxComponent = this.ajaxFactory.create({
				url: processUri,
				headers:{ 'authorization' : "Basic "+ this.uid},
				method: "GET",
				contentType: "application/x-www-form-urlencoded",
				sync: false,
			}); //connection parameters

			ajaxComponent
			.go()
			.response( this, function(sender, response){			
				if( success ) success(response);
			})
			.error( this, function()
				{ 
					console.log("Error to load recent activities!!");
					if (error) error();
				}
			);	
	}
	
	this.stamp = 0;
	this.eventListeners = [];
	this.backoff = 0;
	this.counter = 0;

	this.getChangesSince = function()
	{
		this.counter++;
		var expired = (this.counter >= this.backoff) ? true : false;
		var recentRequests = this.getRecentRequests();
		
		if(recentRequests > 0)
		{
			this.backoff = 0;
			this.counter = 0;
		}
		else if(expired)
		{
			this.counter = 0;
			if(this.backoff <= 0)
				this.backoff = 1;
			else if(this.backoff >= 32)
				this.backoff = 32;
			else
				this.backoff++;
		}

		if(this.backoff <= 2 || expired)
			this.doRefresh();
	}

	this.doRefresh = function()
	{
		if(this.eventListeners.length == 0)
			return;

		//console.log("doRefresh");

		var thisComponent = this;

		var ajaxComponent = this.ajaxFactory.create({
			url: this.serverAddress,
			headers:{ 'authorization' : "Basic "+ this.uid},
			method: "GET",
			contentType: "application/x-www-form-urlencoded",
			sync: false, 
		}, true); 

		//connection parameters

		ajaxComponent.go({'summary' : false, 'changeOnly' : true, 'since' : this.stamp}).response(this, function(sender, response)
		{
			this.stamp = response.stamp;
			if( response.changeCount == 0 )
				return;

			thisComponent.backoff = 0;
			
			var changes = response.changeGroup.change;	
			for (var i=0;i<changes.length;i++)
			{
				for(var j in thisComponent.eventListeners)
				{
					if(changes[i].uri == thisComponent.eventListeners[j].uri)
					{
						thisComponent.eventListeners[j].callback(changes[i]);
					}
				}
			}
		})
		.error(this, function()
			{
				console.log("Error to load new changes");
				if (error) error();
			}
		);
	}

	var self = this;

	this.startEventsDispatch = function() { self.eventInterval = window.setInterval( function() { self.getChangesSince(); }, 5000); };

	this.stopInterval = function() {  window.clearInterval(this.eventInterval); }

	this.addListener = function(component, callback, uriToListen)
	{
		var newListener = new Object();
		newListener.component = component;
		newListener.callback = callback;
		newListener.uri = uriToListen;
		this.eventListeners.push(newListener);		
	}

	this.removeListener = function(component)
	{
		var newArray = [];
		for(var i in this.eventListeners)
		{
			//Put valid listeners in a new array
			if(this.eventListeners[i].component != component)
			{
				newArray.push(this.eventListeners[i]);
			}
		}
		this.eventListeners = newArray;
	}
	
	this.removeListenerForItem = function(component, uri)
	{	
		for(var i in this.eventListeners)
		{
			if(this.eventListeners[i].component == component && this.eventListeners[i].uri == uri)
			{
				this.eventListeners.splice(i,1);
				//console.log("a listener was removed");				
			}			
		}			
	}

	//Verify if exists equals elements in the EventListeners list
	this.hasElement = function(component, uri)
	{
		for(var i = 0; i < this.eventListeners.length; i++){
			if(this.eventListeners[i].uri == uri && this.eventListeners[i].component == component){			
				return true;
			}		
		}
		return false;		
	}
	
	this.listClouds = function(success, error)
	{
		var ajaxComponent = this.ajaxFactory.create({
				url: this.serverAddress + 'cloud',
				headers:{ 'authorization' : "Basic "+ this.uid },
				method: "GET",
				contentType: "application/x-www-form-urlencoded",
				sync: false,
			}); //connection parameters

			ajaxComponent
			.go()
			.response( this, function(sender, response){
				response.elements = fixArrayInformation(response.elements);
				if (success) success(response.elements);
			})
			.error( this, function()
				{ 
					console.log("Error to load clouds");
					if (error) error();
				}
			);	
	}
	
	this.getDirectFileUri = function(fileUri, success, error)
	{
		var ajaxComponent = this.ajaxFactory.create({
			url: fileUri,
			headers:{ 'authorization' : "Basic "+ this.uid },
			method: "GET",
			handleAs: 'text',
			sync: false,
		}); //connection parameters

		ajaxComponent
		.go()
		.response( this, function(sender, response){
			if (success) success(response);
		})
		.error(this, function(inSender, inResponse){
			if(error) error(inSender, inResponse);		
		});	
	}

}