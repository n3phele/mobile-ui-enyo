function RepositoryHelper()
{	
	this.openWindowWithCredentials = function(uri, uid)	{
		//We need to open the browser passing the n3phele url. This requires authentication, so we will contruct the url with username:password@url
		var url = this.createUrlWithCredentials(uid);
		this.openWindow(url);
	}
	
	this.createUrlWithCredentials = function(url, uid) {
		var user = Base64.decode(uid)+"@";
		var first = url.substr(0,8);
		var last = url.substr(8,url.length);
		var newUrl = first+user+last;
		return newUrl;
	}
	
	this.openWindow = function(uri)	{
		window.open(uri, '_system');
	}
	
	this.openFileInNewWindow = function(selectedFile, folders, ajaxFactory)
	{
		var uri = this.createDirectFileRequestUri(selectedFile, folders);
		var self = this;
		
		var ajaxComponent = ajaxFactory.create({
			url: uri,
			handleAs: 'text',
			method: "GET",
			sync: false, 
		});
		ajaxComponent.go()
		.response(this, function(sender, response){	
			var directFileUri = response;
			self.openWindow(directFileUri);
		})
		.error(this, function(){
			if(error) error();
		});		
	}
	
	var createBasicFileUrlWithPath = function(selected, folders, path) {
		var str = "";
			
	 	for(var i in folders){
	     	str += folders[i] + "/";
	  	}
		var contentUrl = selected.repository+"/" + path +"?name="+selected.name;
		
		var fileUri = new Object();			
		if(str != ""){
			fileUri.name=selected.name;
			fileUri.uri = contentUrl+"&path="+str;
		}
		else{
			fileUri.name=selected.name;
			fileUri.uri = contentUrl;
		}
		
		return fileUri.uri;		
	}
	
	this.createFileRedirectUri = function(selected, folders) {
		return createBasicFileUrlWithPath(selected, folders, "redirect");
	}
	
	this.createDirectFileRequestUri = function(selected, folders) {
		return createBasicFileUrlWithPath(selected, folders, "redirectUrl");	
	}
}