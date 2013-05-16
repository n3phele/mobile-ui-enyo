/*** The main classes that mount the account list page  ****/
enyo.kind({ 
	name:"RepositoryFileList",
	kind: "FittableRows",
	fit: true,
	repositoryName: "",
	path: [],
	style: "padding: 0px",
	data: [],
	commands: null,
	commandsImages : null,
	callBy: "",
	events: {
		onSelectedItem: "",
		onBack: ""
	},
	components:[
		{kind: "onyx.Toolbar",classes: "toolbar-style", components: [ { name: "title", content:"Files" }, {kind: "onyx.Button", content: "Remove", classes: "button-style-right", ontap: "deleteRepository"},{kind: "onyx.Button", content: "New folder",classes: "button-style-right", ontap: "newFolder"},{kind: "onyx.Button", classes: "button-style-left", content: "<", ontap: "backMenu"}]},
		{kind: "Scroller", name: "scroll",style:"background:#fff", fit: true, components: [
		          {name: "panel", components:[{name: "Spin",kind:"onyx.Spinner",classes: "onyx-light",style:" margin-top:100px;margin-left:45%"}]}
		]}
		//{kind: "onyx.Toolbar", name: "btnTool", components: [ {kind: "onyx.Button", content: "Delete Repository", ontap: "deleteRepository"},{kind: "onyx.Button", content: "Create new folder", ontap: "newFolder"},{kind: "onyx.Button", style: "float: right;", content: "Close", ontap: "backMenu"}]}
	],
	create: function(){
		this.inherited(arguments)
		this.$.title.setContent(this.repositoryName);
		this.updateFilesFromURI(this.uri + "/list");
	},
	updateFilesFromURI: function(uri, success){
	this.$.Spin.show();
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
		var ajaxComponent = new enyo.Ajax({
			url: this.uri,
			headers:{ 'authorization' : "Basic "+ this.uid},
			method: "DELETE",
			contentType: "application/x-www-form-urlencoded",
			sync: false, 
		}); 		
		ajaxComponent.go()
		.response()
		.error(this, function(){
			console.log("Error to delete the detail of the command!");
		});	
		this.backMenu();
	},
	newFolder: function( sender , event){
		
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
			//put on path
			var newButton = this.createComponent({name:"btn", kind: "onyx.Button", content: this.repositoryName, ontap: "folderClicked", container: this.$.btnTool }).render();				
			this.path.push( newButton );
			this.reflow();
			
			this.$.ListIcon.destroy();
			//download the new folder to data
			this.$.Spin.show();
			this.updateFilesFromURI(this.uri + '/list?prefix=' + this.selected.name + '%2F');
		}
		if(this.callBy=="selectFile"){
			this.doSelectedItem(this.selected);
		}else if(this.callBy=="repositoryList"){
			console.log("Do Download!");
		}
	},
	folderClicked: function(inSender,inEvent){
		this.navigateBack(inSender.content);
		this.$.btn.destroy();
	},
	navigateBack: function(folder){
		//navigate back to repository/folder specified that is already on path
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
