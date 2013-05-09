/*** The main classes that mount the account list page  ****/
enyo.kind({ 
	name:"RepositoryList",
	kind: "FittableRows",
	fit: true,
	style: "padding: 0px",
	data: [],
	commands: null,
	commandsImages : null,
	callBy: "",
	events: {
		onSelectedItem: "",
		onNewRepository: "",
		onBack: ""
	},
	components:[
		{kind: "onyx.Toolbar", components: [ { name: "title", content:"Repositories" }, {fit: true}]},
	      {name: "panel", components:[]}
	],
	create: function(){
		this.inherited(arguments)
		var popup = new spinnerPopup();
		popup.show();
		
		var ajaxComponent = new enyo.Ajax({
			url: serverAddress+"repository",
			headers:{ 'authorization' : "Basic "+ this.uid},
			method: "GET",
			contentType: "application/x-www-form-urlencoded",
			sync: false, 
		}); 
				
		ajaxComponent.go()
		.response(this, function(sender, response){
	
			response.elements = fixArrayInformation(response.elements);
			
			this.data = response.elements;
			this.commands = new Array();
			this.commandsImages = new Array();
			for( var i in this.data ){//set comand list information
				this.commands.push( this.data[i].name ); //set name
				this.commandsImages.push("assets/folderG.png");
		}		
		var thisPanel = this;
		thisPanel.createComponent({name: "IconGallery", kind: "IconList", onDeselectedItems: "commandDeselect", onSelectedItem: "itemTap", commands: this.commands,
			commandsImages: this.commandsImages,
			retrieveContentData: function(){
				this.data = createCommandItems(this.commands, this.commandsImages); } 
			}).render();
		//*************** Alterado código abaixo	
		if(this.callBy=="repositoryList"){
		if (this.r.isScreenNarrow()) {
		thisPanel.createComponent({kind: "onyx.Toolbar", components: [ {kind: "onyx.Button", content: "Create New Repository", ontap: "newrepo" },{kind: "onyx.Button", style: "float: right;", content: "Close", ontap: "backMenu"}]}).render();
		}else{ 
		thisPanel.createComponent({kind: "onyx.Toolbar", components: [ {kind: "onyx.Button", content: "Create New Repository", ontap: "newrepo" }]}).render();		
		}}else if(this.callBy=="selectFile"){
			thisPanel.createComponent({kind: "onyx.Toolbar", name: "btnClose", components: [ {kind: "onyx.Button", content: "Close", ontap: "backMenu"}]}).render();	
		}		
		thisPanel.render();
		thisPanel.reflow();	
		})
		//Backup código antigo abaixo
		/* if(this.callBy=="repositoryList"){
		thisPanel.createComponent({kind: "onyx.Toolbar", components: [ {kind: "onyx.Button", content: "Create New Repository", ontap: "newrepo" }]}).render();
		}else if(this.callBy=="selectFile"){
			thisPanel.createComponent({kind: "onyx.Toolbar", name: "btnClose", components: [ {kind: "onyx.Button", content: "Close", ontap: "backMenu"}]}).render();	
		}
		thisPanel.render();
		thisPanel.reflow();	
		}) */
		.error(this, function(){
			console.log("Error to load the list of repositories");
			popup.delete();
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
	setupItem: function(inSender, inEvent) {
	    // given some available data.
	    var data = this.data[inEvent.index];
	    this.$.name.setContent(data.name);
	    this.$.description.setContent(data.description);
	},
	itemTap: function(inSender, inEvent) {
		this.selected = this.data[inEvent.index];	
		this.doSelectedItem(this.selected);
		return true;
	},
	newrepo: function(sender, event){
		this.doNewRepository();
	}
})