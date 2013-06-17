/*** The main classes that mount the account list page  ****/
enyo.kind({ 
	name:"RepositoryFileList",
	kind: "FittableRows",
	fit: true,
	repositoryName: "",
	path: [],
	folders:[],
	foldername:null,
	root:null,
	style: "padding: 0px",
	data: [],
	commands: null,
	commandsImages : null,
	callBy: "",
	events: {
		onSelectedItem: "",
		onBack: "",
		onRemoveRepository:"",
	    onSelectedRepository:""
	},
	components:[
		{kind: "onyx.Toolbar", name: "toolTop", classes: "toolbar-style", components: [ { name: "title", content:"Files" }, {name:"delete",kind: "onyx.Button", content: "Delete", classes: "button-style-right",style:"background-image:-webkit-linear-gradient(top,#B5404A 50%,#9E0919 77%) !important" , ontap: "deleteRepository"},{name:"add",kind: "onyx.Button", content: "+",classes: "button-style-right", style: "font-size: 20px !important;font-weight: bold;", ontap: "newFolder"},{name: "backTop",kind: "onyx.Button", classes: "button-style-left", content: "Repositories", ontap: "backMenu", container:this.$.toolTop}]},
		{kind: "Scroller", name: "scroll",style:"background:#fff", fit: true, components: [
		          {name: "panel", components:[{name: "Spin",kind:"onyx.Spinner",classes: "onyx-light",style:" margin-top:100px;margin-left:45%"}]},
				  {tag: "br"},
		{name: "Msg", style: "color:#FF4500; text-align:center"},
		{tag: "br"}
		]}
	],
	create: function(){
		this.inherited(arguments)
		
	     if(this.callBy=="selectFile"){
			this.$.delete.hide();
			this.$.add.hide();
		}
		 if(this.callBy=="outputFile"){
			this.$.delete.hide();
			this.$.add.setContent("Done");
		}
		this.updateFilesFromURI(this.uri + "/list");

		
	},
	updateFilesFromURI: function(uri, success){
	this.$.Spin.show();
	this.$.backTop.hide();
     
	 
	 console.log("Folders:");
	 console.log(this.folders);
	 
	 
	 
	 
	 //Set toolbar title as root name here if we are not visiting any folders or came back from folders
	 if (this.root < 1) {
	 this.$.backTop.show()
	  if(this.repositoryName.length <=7)
			{
			var name = this.repositoryName;
			}
			else 
			{
			var name = this.repositoryName.substr(0,5).concat("...");
			}
		this.$.title.setContent(name);
	        }
			
	//Change the name in toolbar to the folder we are current visiting		
	  else
	  {
	  
	     if(this.foldername.length <=7)
			{
			var name = this.foldername;
			}
			else 
			{
			var name = this.foldername.substr(0,5).concat("...");
			}
		this.$.title.setContent(name);
	   }
	  
       

	  
				
			
		var ajaxComponent = new enyo.Ajax({
			url: uri,
			headers:{ 'authorization' : "Basic "+ this.uid},
			method: "GET",
			contentType: "application/x-www-form-urlencoded",
			sync: false
		});
		
		ajaxComponent.go()
		.response(this, function(sender, response){
			//update files list
			response.crumbs.files = fixArrayInformation(response.files);			
			this.data = response.files;
			this.commands = new Array();
			this.commandsImages = new Array();
			for( var i in this.data ){//set comand list information
				this.commands.push( this.data[i].name ); //set name
				var name = this.data[i].name;
				
				if( name.indexOf(".tgz") != -1){
				this.commandsImages.push("assets/tgz.png");
				}
				else if( name.indexOf(".pdf") != -1){
					this.commandsImages.push("assets/pdf.png");
					}

				else if( name.indexOf(".jpg") != -1){
					this.commandsImages.push("assets/jpg.png");
					}
				else if( name.indexOf(".zip") != -1){
					this.commandsImages.push("assets/zip.png");
					}
				else if( name.indexOf(".png") != -1){
					this.commandsImages.push("assets/png.png");
					}
				else if( this.data[i].mime == this.folderMime){
					this.commandsImages.push("assets/folderG.png");
					}
				else{
					this.commandsImages.push("assets/_blank.png");
					}
		}		
			var thisPanel = this;
			
			thisPanel.createComponent({name: "ListIcon",kind: "IconList", onDeselectedItems: "commandDeselect", onSelectedItem: "itemTap", commands: this.commands,
				commandsImages: this.commandsImages,container: thisPanel.$.panel,
				retrieveContentData: function(){
					this.data = createCommandItems(this.commands, this.commandsImages); } 
			}).render();
			thisPanel.reflow();
			
			this.$.Spin.hide();
			
		})
		.error(this, function(){
			console.log("Error to load the list of files");
			 this.$.Spin.hide();
			this.$.Msg.setContent("No files found!");
			
		});
        		
	},
	closePanel: function(inSender, inEvent){
			var panel = inSender.parent.parent.parent;
			
			panel.setIndex(2);				
			panel.getActive().destroy();					
			panel.panelCreated = false;
			
			if (enyo.Panels.isScreenNarrow()) {
				panel.setIndex(1);
			}
			else {
				panel.setIndex(0);
			}		
			
			panel.reflow();		
			panel.owner.$.IconGallery.deselectLastItem();			
	},
	backMenu: function( sender , event){
		this.doBack(event);
	},
	deleteRepository: function( sender , event){
	    var obj =  new Object();
		obj.name = this.repositoryName;
		this.doRemoveRepository(obj);
		this.root = 0;
	},
	newFolder: function( sender , event){
	console.log("click");
		if(this.callBy=="outputFile"){
		var str="";
		  for(var i in this.folders)
		  {
		      str = "/"+i;
		  }
		  console.log(str);
		
			pathFile={name: this.selected.name, path: this.repositoryName+"://"+ str + "/" +this.selected.name,type:"output"};
			this.doSelectedRepository(pathFile);
		}
	
		
		this.root = 0;
	},
	setupItem: function(inSender, inEvent) {
	    // given some available data.
	    var data = this.data[inEvent.index];
		
	    this.$.name.setContent(data.name);
	},
	folderMime: "application/vnd.com.n3phele.PublicFolder",
	itemTap: function(inSender, inEvent) {
		this.selected = this.data[inEvent.index];
	    
		
		//If is a folder, open it
		if(this.selected.mime == this.folderMime)
		{   
		    var newButton = this.createComponent({name:"btn", kind: "onyx.Button", content: this.$.title.getContent(), ontap: "folderClicked", classes: "button-style-left", container: this.$.toolTop }).render();				
			this.path.push( newButton );
			this.reflow();
			this.root = this.root +1;
			
			this.$.ListIcon.destroy();
			//download the new folder to data
			this.$.Spin.show();
			this.foldername = this.selected.name;
			this.folders.push(this.foldername);
			
			console.log("Root é:" + this.repositoryName);
			console.log("Folders deu push em:" + this.foldername);
	        this.updateFilesFromURI(this.uri + '/list?prefix=' + this.selected.name + '%2F');
			
		}
		if(this.selected.mime != this.folderMime && this.callBy=="selectFile"){
		 	var str = "";
		  for(var i in this.folders)
		  {
		     str = "/"+this.folders[i];
		  }
		  console.log(str);
		
			pathFile={name: this.selected.name, path: this.repositoryName+"://"+ str + "/" +this.selected.name, type:"input"};
			console.log(pathFile);
			this.doSelectedItem(pathFile);
		}else if(this.selected.mime != this.folderMime && this.callBy=="repositoryList"){
			
		}
	},
	folderClicked: function(inSender,inEvent){
		this.navigateBack(inSender.content);
		this.$.btn.destroy();
		
	},
	navigateBack: function(folder){
		//navigate back to repository/folder specified that is already on path
		this.root = this.root - 1;
		var aux = this.folders.pop();
		
		console.log("voltando de:" + aux);
		
		while(this.path[this.path.length-1].getContent() != folder)
		{
			var button = this.path.pop();
			
			button.destroy();
			
		}
		var newUri = this.uri + '/list';
		if( this.path.length > 1 )
		{
			var prefix = "";
			newUri = newUri + '?prefix='
			for (var i=1;i<this.path.length;i++)
			{ 
				prefix = prefix + this.path[i].getContent() + '%2F';
			}
		}
		
		this.$.ListIcon.destroy();
		this.updateFilesFromURI(newUri);
	}
})
