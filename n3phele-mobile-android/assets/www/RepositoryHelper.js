function RepositoryHelper()
{	
	this.openWindowWithCredentials = function(uri, uid)	{
		//We need to open the browser passing the n3phele url. This requires authentication, so we will contruct the url with username:password@url
		var user = Base64.decode(uid)+"@";
		var first = uri.substr(0,8);
		var last = uri.substr(8,uri.length);
		var url = first+user+last;
		window.open(url, '_system');
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
	
	this.createFileRedirectUri = function(selected, folders) {
		var str = "";
			
	 	for(var i in folders){
	     	str += folders[i] + "/";
	  	}
		var contentUrl = selected.repository+"/redirect?name="+selected.name;
		
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
	
	this.createDirectFileRequestUri = function(selected, folders) {
		var str = "";
			
	 	for(var i in folders){
	     	str += folders[i] + "/";
	  	}
		var contentUrl = selected.repository+"/redirectUrl?name="+selected.name;
		
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
}