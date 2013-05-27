enyo.kind({
	name: "EditAccount",
	kind: "FittableRows",
	
	fit: true,
	style: "padding: 0px",
	events: {
		onBack: ""
	},
	components: [
		{kind:"Scroller",style: "background: #fff",classes: "scroller-sample-scroller enyo-fit",components: [
		{kind: "onyx.Toolbar",  classes: "toolbar-style",components: [ 
		{name: "title", content:"Edit Account" }, {kind: "onyx.Button",classes:"button-style-right",content: "Done", ontap: "save"} , 
	    {kind: "onyx.Button", content: "Account Detail", classes:"button-style-left", ontap: "cancelAction"}]},
	    {tag: "br"},
		{name: "Msg", style: "color:#FF4500;"},
		{tag: "br"},
		{style:"text-align:center", components:[	
			{name:"panel", kind: "Scroller", fit: true, components: [
				
				//{content: "*Name: "},
				{kind: "onyx.InputDecorator",classes: "inputs", components: [
					{kind: "onyx.Input",style:"float:left", name: "name", placeholder: "Account name"}
				]},
			
				//{content: "Description: "},
				{kind: "onyx.InputDecorator",classes: "inputs", components: [
					{kind: "onyx.Input",style:"float:left", name: "description", placeholder: "Account description"}
				]},
			
				//{content: "*On Cloud: "},
				{tag:"select", classes:"styled-select", name:"cloudsList", style:"-webkit-appearance:none !important;outline:none",components:[             /* <<<<--------------------- */
					//{tag:"option", content:"aaaaaaaa"}						                                                             /* <<<<--------------------- */
				]},
				
				//{content: "*Cloud Id: "},
				{kind: "onyx.InputDecorator",classes: "inputs", components: [
					{kind: "onyx.Input",style:"float:left", name: "id", placeholder: "Cloud Id"}
				]},
				
				//{content: "*Cloud Secret: "},
				{kind: "onyx.InputDecorator",classes: "inputs", components: [
					{kind: "onyx.Input",style:"float:left", name: "secret", type: "password", placeholder: "Cloud secret"}
				]},	
			]} 
		]} 
		]}	
	],
	
	create: function() {
		this.inherited(arguments);
		
		var n3pheleClient = new N3pheleClient();
		n3pheleClient.uid = this.uid;
		
		var cloudsErrors = function() { console.log("getting clouds error"); }
		var thisPanel = this;
		var cloudsSuccess = function(clouds) { for (var i=0;i<clouds.length;i++) { thisPanel.$.cloudsList.createComponent( {tag: "option", content: clouds[i].name, object: clouds[i] } ); thisPanel.$.cloudsList.render(); thisPanel.$.cloudsList.reflow(); } }
		
		n3pheleClient.listClouds(cloudsSuccess, cloudsErrors);
		this.$.name.setPlaceholder(this.account.name);
		this.$.description.setPlaceholder(this.account.description);
		this.$.cloudList.setContent(this.account.cloudName);
	},
	
	itemSelected: function(inSender, inEvent) {
		//Menu selected item
		if (inEvent.originator.content){
			this.$.cloud.setPlaceholder(inEvent.originator.content);
		}
	},
	save: function(sender, event){
		
		//obtain form data
		var  name = sender.parent.owner.$.name.getValue();
		var  description = sender.parent.owner.$.description.getValue();
	    var  cloud = sender.parent.owner.$.cloud.getPlaceholder();
		var  id = sender.parent.owner.$.id.getValue();
		var  secret = sender.parent.owner.$.secret.getValue();
		
		//validate form
		if( name.length == 0 || cloud.length == 0 || id.length == 0 || secret.length == 0){
			sender.parent.owner.$.Msg.setContent("Please, fill the form!");
			return;
		}		
		//request
		var ajaxParams = {
				url: serverAddress+"account",
				headers:{ 'authorization' : "Basic "+ this.uid},
				method: "POST",
				contentType: "application/x-www-form-urlencoded",
				sync: false, 
			};
		var ajaxComponent = new enyo.Ajax(ajaxParams); //connection parameters
		ajaxComponent
		.go()
		.response( this, function(inSender, inResponse){
			
		}).error( this, function(inSender, inResponse){
			sender.parent.owner.$.Msg.setContent("Error");
			popup.delete();
		});
	},
	cancelAction: function(sender , event){
		this.doBack();
	}
});

