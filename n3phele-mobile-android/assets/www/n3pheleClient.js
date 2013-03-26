function N3pheleClient()
{
	this.serverAddress = "http://n3phele-dev.appspot.com/resources/"
	this.userName = "";
	this.userPassword = "";
		
	this.prepareAuthentication = function()
	{
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
}