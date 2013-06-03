function N3pheleClient(ajaxFactory)
{
	//this.serverAddress = "http://n3phele-dev.appspot.com/resources/";	
	if(typeof(serverAddress)!=='undefined')
	{
		this.serverAddress = serverAddress;
	}
	
	this.userName = "";
	this.userPassword = "";
	
	//This class uses a factory to create an ajax object for http access. By default uses enyo.Ajax.
	if(ajaxFactory)
	{
		this.ajaxFactory = ajaxFactory;
	}
	else
	{
		this.ajaxFactory = new Object();
		this.ajaxFactory.create = function(o) { return new enyo.Ajax(o); };
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
	
		var ajaxComponent = new enyo.Ajax({
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
		var ajaxComponent = new enyo.Ajax({
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
		var ajaxComponent = new enyo.Ajax({
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
	
	this.listActivityDetail = function(processUri, start, end, success, error)
	{
		var ajaxComponent = new enyo.Ajax({
				url: processUri,
				headers:{ 'authorization' : "Basic "+ this.uid},
				method: "GET",
				contentType: "application/x-www-form-urlencoded",
				sync: false,
			}); //connection parameters
			
			ajaxComponent
			.go({'summary' : true, 'start' : start, 'end' : end})
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
	this.getChangesSince = function(uriToBeListen, success, error)
	{		
		var ajaxComponent = this.ajaxFactory.create({
				url: this.serverAddress,
				headers:{ 'authorization' : "Basic "+ this.uid },
				method: "GET",
				contentType: "application/x-www-form-urlencoded",
				sync: false
			}); //connection parameters
			
			ajaxComponent
			.go({'summary' : false, 'changeOnly' : true, 'since' : this.stamp})
			.response( this, function(sender, response){
				
				this.stamp = response.stamp;
				if( response.changeCount == 0 ) return;
				
				var changes = response.changeGroup.change;	
				
				for (var i=0;i<changes.length;i++)
				{
					if(changes[i].uri == uriToBeListen)
					{
						if( success ) success(changes[i]);
					}
				}								
			})
			.error( this, function()
				{ 
					console.log("Error to load new changes");
					if (error) error();
				}
			);
	}
	
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
		for(var i in this.eventListeners)
		{
			if(this.eventListeners[i].component == component)
			{
				this.eventListeners.splice(i,1);
			}
		}
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
	
}