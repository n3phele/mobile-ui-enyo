function N3pheleClient()
{
	this.serverAddress = "http://n3phele-dev.appspot.com/resources/"
	this.userName = "";
	this.userPassword = "";
		
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
		var ajaxComponent = new enyo.Ajax({
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
	
}