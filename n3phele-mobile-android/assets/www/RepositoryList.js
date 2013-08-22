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
			{tag: "br"},
			{name: "Msg", style: "color:#FF4500; text-align:center"},
			{tag: "br"},
	    {name: "panel", components:[]}
	],
	create: function(){
		this.inherited(arguments)
		
		  if(this.callBy=="selectFile" || this.callBy=="outputFile"){
		this.$.add.hide();
		}
		 this.$.Spin.show();
		
		

	this.updateRepositoryList(this);
		
		var self = this;
		var updateList = function(){
			self.updateRepositoryList(self);
		}
		n3phele.addListener(this, updateList, serverAddress+"repository" );
		this.render();
	},

	updateRepositoryList: function(panel){

		var ajaxComponent = n3phele.ajaxFactory.create({
			url: serverAddress+"repository",
			headers:{ 'authorization' : "Basic "+ panel.uid},
			method: "GET",
			contentType: "application/x-www-form-urlencoded",
			sync: false, 
		}); 
				
		ajaxComponent.go()
		.response(this, function(sender, response){
	
			response.elements = fixArrayInformation(response.elements);
			
			panel.data = response.elements;
			panel.commands = new Array();
			panel.commandsImages = new Array();
			if(panel.data.length == 0) this.$.Msg.setContent("No repository found!");

			for( var i in panel.data ){//set comand list information
				panel.commands.push( this.data[i].name ); //set name
				panel.commandsImages.push("assets/folderG.png");
		}		
		var thisPanel = panel;
		thisPanel.createComponent({name: "IconGallery", classes:"keyframe_2", kind: "IconList",style:"background:#FFF", onDeselectedItems: "commandDeselect", onSelectedItem: "itemTap", commands: panel.commands,
			commandsImages: panel.commandsImages,
			retrieveContentData: function(){
				this.data = createCommandItems(panel.commands, panel.commandsImages); } 
			}).render();
		
		if(panel.callBy=="repositoryList"){
		if (panel.closePanel.isScreenNarrow()) {
		 panel.createComponent({kind: "onyx.Button",classes:"button-style-left", content: "Menu", ontap: "backMenu", container: panel.$.tollbar_top }).render(); 
		} 
		
		}
		
		else if(panel.callBy=="selectFile" || panel.callBy=="outputFile"){
			
		panel.createComponent({kind: "onyx.Button",classes:"button-style-left", content: "Command", ontap: "backMenu", container: panel.$.tollbar_top }).render(); 
			 		
		}
        panel.$.Spin.hide();		
		thisPanel.render();
		thisPanel.reflow();	
		})
	.error(this, function(inSender, inResponse){
		 if(inSender.xhrResponse.status == 0){
		 	alert("Connection Lost");
		 	this.doLost();
		 }
	});	

	},

	backMenu: function( sender , event){
		if(this.callBy=="outputFile"){  
	  		this.doBackCommand();
		}
		else if(this.callBy="selectFile"){
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