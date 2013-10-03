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
	    var userAgent = navigator.userAgent;	 
        if (userAgent.indexOf('iPhone') != -1 ||
            userAgent.indexOf('iPod') != -1 ||
            userAgent.indexOf('iPad') != -1) {
           	window.location.href = uri;
        }else{
			window.open(uri, '_system');
		}
	}
	
	this.openFileInNewWindow = function(selectedFile, folders, n3pheleClient)
	{
		var uri = this.createDirectFileRequestUri(selectedFile, folders);
		var self = this;
		
		var onSuccess = function(directFileUri)	{
			self.openWindow(directFileUri);
		}
		
		n3pheleClient.getDirectFileUri(uri, onSuccess);
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