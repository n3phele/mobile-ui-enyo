/*** The main classes that mount the account list page  ****/
enyo.kind({ 
	name:"RepositoryList",
	kind: "FittableRows",
	fit: true,
	style:"background:#fff",
	data: [],
	commands: null,
	commandsImages : null,
	callBy: "",
	events: {
		onSelectedItem: "",
		onNewRepository: "",
		onBack: "",
		onSelectedRepository:"",
		onBackCommand:"",
		onLost:"",
	},
	components:[
		{kind: "onyx.Toolbar", name:"tollbar_top",classes:"toolbar-style", components: [ 
			{name: "title", content:"Repositories"},
			{name:"add",kind: "onyx.Button", content: "+", ontap: "newrepo",classes:"button-style-right", style: "font-size: 20px !important;font-weight: bold;"},
						
			//{fit: true}
		]},  
	    	{name: "Spin",kind:"onyx.Spinner",classes: "onyx-light",style:" margin-top:100px;margin-left:45%"},
	    {name: "panel", components:[]}
	],
	create: function(){
		this.inherited(arguments)
		
		  if(this.callBy=="selectFile" || this.callBy=="outputFile"){
		this.$.add.hide();
		}
		 this.$.Spin.show();
		
		var ajaxComponent = n3phele.ajaxFactory.create({
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
		thisPanel.createComponent({name: "IconGallery", classes:"keyframe_2", kind: "IconList",style:"background:#FFF", onDeselectedItems: "commandDeselect", onSelectedItem: "itemTap", commands: this.commands,
			commandsImages: this.commandsImages,
			retrieveContentData: function(){
				this.data = createCommandItems(this.commands, this.commandsImages); } 
			}).render();
		
		if(this.callBy=="repositoryList"){
		if (this.closePanel.isScreenNarrow()) {
		this.createComponent({kind: "onyx.Button",classes:"button-style-left", content: "Menu", ontap: "backMenu", container: this.$.tollbar_top }).render(); 
		} 
		
		}
		
		else if(this.callBy=="selectFile" || this.callBy=="outputFile"){
			
		this.createComponent({kind: "onyx.Button",classes:"button-style-left", content: "Command", ontap: "backMenu", container: this.$.tollbar_top }).render(); 
			 		
		}
		
		
        this.$.Spin.hide();		
		thisPanel.render();
		
		thisPanel.reflow();	
		})
	.error(this, function(inSender, inResponse){
		 if(inSender.xhrResponse.status == 0) 
		  alert("Connection Lost");
		 this.doLost();
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
	if(this.callBy=="outputFile")
	{  
	  this.doBackCommand();
	}
	else if(this.callBy="selectFile")
	{
	this.doBackCommand();
	}

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
	
      if(this.callBy=="outputFile"){
			var obj = new Object();
			obj.info = this.selected;
			obj.name = this.outputfile;
			this.doSelectedRepository(obj);
		} 
	  
		else
		{
       
		this.doSelectedItem(this.selected);
		}
		return true;
	},
	newrepo: function(sender, event){
		this.doNewRepository();
	}
})