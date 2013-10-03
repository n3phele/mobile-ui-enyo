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
	    onSelectedRepository:"",
		onBackCommand:"",
		onOpenContent: "",
	},

	//
	components:[
		{kind: "onyx.Toolbar", name: "toolTop", classes: "toolbar-style", components: [ { name: "title", content:"Files" }, {name:"delete",kind: "onyx.Button", content: "Delete", classes: "button-style-right",style:"background-image:-webkit-linear-gradient(top,#B5404A 50%,#9E0919 77%) !important" , ontap: "removeRepository"},{name: "backTop",kind: "onyx.Button", classes: "button-style-left", content: "Repositories", ontap: "backMenu", container:this.$.toolTop}]},
		{kind: "Scroller", name: "scroll",style:"background:#fff", fit: true, components: [
		    {name: "panel", components:[{name: "Spin",kind:"onyx.Spinner",classes: "onyx-light",style:" margin-top:100px;margin-left:45%"}]},
			{tag: "br"},
			{name: "Msg", style: "color:#FF4500; text-align:center"},
			{tag: "br"}
		]}
	],

	/*
		this function calls the updateFilesFromUri and hide the delete button if this screen 
	*/
	create: function(){
		this.inherited(arguments);
		this.helper = new RepositoryHelper();
		
		if(this.callBy=="selectFile"){
			this.$.delete.hide();
		}
		
		if(this.callBy=="outputFile"){
			this.$.delete.hide();
		}

		this.updateFilesFromURI(this.uri + "/list");		
	},
	/*
		this function do a request to the server to populate this list.
	*/
	updateFilesFromURI: function(uri, success){
		this.$.Spin.show();
		this.$.backTop.hide();  

		//Set toolbar title as root name here if we are not visiting any folders or came back from folders
		if (this.root < 1) {
			this.$.backTop.show();
	  	
	  		if(this.repositoryName.length <=7){
				var name = this.repositoryName;
			}
			else {
				var name = this.repositoryName.substr(0,5).concat("...");
			}
		
			this.$.title.setContent(name);
		}

		//Change the name in toolbar to the folder we are current visiting		
		else{

	    	if(this.foldername.length <=7){
				var name = this.foldername;
			}
			else{
				var name = this.foldername.substr(0,5).concat("...");
			}
		
			this.$.title.setContent(name);
		}

		var ajaxComponent = n3phele.ajaxFactory.create({
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
		
			//set comand list information *************************************************
			for( var i in this.data ){
				this.commands.push( this.data[i].name ); 
				var name = this.data[i].name;
			
				//set icon for each file *************************************************	
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
			
			//create the list with icons
			thisPanel.createComponent({name: "ListIcon",kind: "IconList", onDeselectedItems: "commandDeselect", onSelectedItem: "itemTap", commands: this.commands,
				commandsImages: this.commandsImages,container: thisPanel.$.panel,
				retrieveContentData: function(){
					this.data = createCommandItems(this.commands, this.commandsImages); } 
				}).render();
			
			thisPanel.reflow();	
			this.$.Spin.hide();
				
			// if there is no files on repository ********************************************************************************
			if(this.data ==undefined){
				this.$.Msg.setContent("No files found!");
			}
				
		})
		.error(this, function(){
			console.log("Error to load the list of files");
			this.$.Spin.hide();
			this.$.Msg.setContent("No files found!");
			
		});
        		
	},

	/*
		this function back to the menu page
	*/
	backMenu: function( sender , event){
		this.doBack(event);
	},

	/*
		this function occurs when the delete account button is clicked and goes to the Remove Repository screen
	*/
	removeRepository: function( sender , event){
	    var obj =  new Object();
		obj.name = this.repositoryName;
		this.doRemoveRepository(obj);
		this.root = 0;
	},

	/*
		this function occurs when the add repository button(+) is clicked and goes to the New Repository List screen
	*/
	newFolder: function( sender , event){	
		if(this.callBy=="outputFile"){
		var str="";
		  for(var i in this.folders)
		  {
		      str = "/"+this.folders[i];
			  this.folders.pop();
		  }
		    this.folders = new Array();		  
			pathFile={name: this.outputfile, path: this.repositoryName+"://"+ str + "/" +this.outputfile,type:"output"};			
			this.doSelectedRepository(pathFile);
		}
		this.root = 0;
	},

	/*
		this function setup the content of the list and populate it.
	*/
	setupItem: function(inSender, inEvent) {
	    var data = this.data[inEvent.index];
	    this.$.name.setContent(data.name);
	},

	folderMime: "application/vnd.com.n3phele.PublicFolder",

	/*
		this function occurs when a item on the list of repositories is clicked
	*/
	itemTap: function(inSender, inEvent) {
		
		this.selected = this.data[inEvent.index];

		//If is a folder, open it ********************************************************************************************************
		if(this.selected.mime == this.folderMime){   
		    var newButton = this.createComponent({name:"btn", kind: "onyx.Button", content: this.$.title.getContent(), ontap: "folderClicked", classes: "button-style-left", container: this.$.toolTop }).render();				
			this.path.push( newButton );
			this.reflow();
			this.root = this.root +1;
			
			this.$.ListIcon.destroy();
			this.$.Spin.show();

			this.foldername = this.selected.name;
			this.folders.push(this.foldername);	
	        this.updateFilesFromURI(this.uri + '/list?prefix=' + this.selected.name + '%2F');
			
		}
		
		if(this.selected.mime != this.folderMime && this.callBy=="selectFile"){
		 	var str = "";
		  	
		  	for(var i in this.folders){
		     str += "/"+this.folders[i];
		  	}
		  		
			pathFile={name: this.selected.name, path: this.repositoryName+"://"+ str + "/" +this.selected.name, type:"input"};
			
			this.doSelectedItem(pathFile);
		}
		else if(this.selected.mime != this.folderMime && this.callBy=="repositoryList"){
			this.helper.openFileInNewWindow(this.selected, this.folders, n3phele);
		}
	},
	/*
		this function update the content of the back button.
	*/
	folderClicked: function(inSender,inEvent){
		this.navigateBack(inSender.content);
		this.$.btn.destroy();	
	},

	/*
		this function update the content of the back button, triggered by folderClicked
	*/
	navigateBack: function(folder){
		//navigate back to repository/folder specified that is already on path
		
		this.root = this.root - 1;
		var aux = this.folders.pop();	
			
		while(this.path[this.path.length-1].getContent() != folder){
			var button = this.path.pop();
			button.destroy();	
		}

		var newUri = this.uri + '/list';
		
		if( this.path.length > 1 ){
			var prefix = "";
			newUri = newUri + '?prefix='

			for (var i=1;i<this.path.length;i++){ 
				prefix = prefix + this.path[i].getContent() + '%2F';
			}
		}

		this.$.ListIcon.destroy();
		this.updateFilesFromURI(newUri);
	}
})
