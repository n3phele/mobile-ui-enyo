/*** The main classes that mount the account list page  ****/
enyo.kind({ 
	name:"RepositoryList",
	kind: "FittableRows",
	fit: true,
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
		{kind: "onyx.Toolbar", name:"tollbar_top",classes:"toolbar-style", components: [ 
			{name: "title", content:"Repositories"},
			{kind: "onyx.Button", content: "+", ontap: "newrepo",classes:"button-style-right", style: "font-size: 20px !important;font-weight: bold;"}
			//{fit: true}
		]},  
			
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
		thisPanel.createComponent({name: "IconGallery", kind: "IconList",style:"background:#FFF", onDeselectedItems: "commandDeselect", onSelectedItem: "itemTap", commands: this.commands,
			commandsImages: this.commandsImages,
			retrieveContentData: function(){
				this.data = createCommandItems(this.commands, this.commandsImages); } 
			}).render();
		
		if(this.callBy=="repositoryList"){
		if (this.closePanel.isScreenNarrow()) {
		this.createComponent({kind: "onyx.Button",classes:"button-style-left", content: "Menu", ontap: "backMenu", container: this.$.tollbar_top }).render(); 
		} 
		
		}else if(this.callBy=="selectFile"){
			this.$.tollbar_top.createComponent({kind: "onyx.Button", name: "btnClose",classes:"button-style-left", content: "<", ontap: "backMenu"}).render();	
		}		
		thisPanel.render();
		
		thisPanel.reflow();	
		})
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