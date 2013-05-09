enyo.kind({  
	name: "CreateAccount",
	kind: "FittableRows",
	
	fit: true,
	style: "padding: 0px",
	events: {
		onBack: ""
	},
	components: [
			{kind:"Scroller",classes: "scroller-sample-scroller enyo-fit",components: [
    
	{kind: "onyx.Toolbar", style:"background:#b1c2d7;border:1px solid #375d8c;background-size:contain;color:#375d8c",components: [ { name: "title", content:"New Account" }, {fit: true}]},
	{tag: "br"},
		{name: "Msg", style: "color:#FF4500;"},
		{tag: "br"},
	
		{name:"panel", style:"height:60%;", kind: "Scroller", fit: true, components:[
		{components: [
		{content: "*Name: "},
			{kind: "onyx.InputDecorator", components: [
				{kind: "onyx.Input", name: "name", placeholder: "Enter name here"}
			]}]},
			{components: [
			{content: "Description: "},
			{kind: "onyx.InputDecorator", components: [
				{kind: "onyx.Input", name: "description", placeholder: "Enter description here"}
			]}]},
			{components: [
			{content: "*On Cloud: "},
			{kind: "onyx.MenuDecorator", onSelect: "itemSelected", components: [
			{kind: "onyx.InputDecorator", components: [
				{kind: "onyx.Input", name: "cloud", disabled: true, placeholder: ""}
			]},
			{content: "v", allowHtml:true, style: "border-radius: 0 2px 2px 0;background-color:#FFFFFF;color:#375d8c;border-color:#375d8c"},
			{kind: "onyx.Menu", name: "cloudsList", components: [
				//{content: "EC2"},
				//{content: "HPZone1"}
			]}
		]}]},
			{components: [
			{content: "*Cloud Id: "},
			{kind: "onyx.InputDecorator", components: [
				{kind: "onyx.Input", name: "id", placeholder: "Enter Id here"}
			]}]},
			{components: [
			{content: "*Cloud Secret: "},
			{kind: "onyx.InputDecorator", components: [
				{kind: "onyx.Input", name: "secret", type: "password", placeholder: "Enter secret here"}
			]}]}
			
	
	]} , {kind: "onyx.Toolbar",style:"background:#b1c2d7;border:1px solid #375d8c;position:absolute;bottom:0;width:100%;background-size:contain;color:#375d8c;", components: [ {kind: "onyx.Button",style:"background-color:#FFFFFF;color:#375d8c;border-color:#375d8c" ,content: "Create", ontap: "save"} , {kind: "onyx.Button", content: "Cancel", style:"float:right;background-color:#FFFFFF;color:#375d8c;border-color:#375d8c", ontap: "cancelAction"} ]} ]}  ],
	
   
	create: function() {
		this.inherited(arguments);
		
		var n3pheleClient = new N3pheleClient();
		n3pheleClient.uid = this.uid;
		
		var cloudsErrors = function() { console.log("getting clouds error"); }
		var thisPanel = this;
		var cloudsSuccess = function(clouds) { for (var i=0;i<clouds.length;i++) { thisPanel.$.cloudsList.createComponent( { content: clouds[i].name, object: clouds[i] } ); thisPanel.$.cloudsList.render(); thisPanel.$.cloudsList.reflow(); } }
		
		n3pheleClient.listClouds(cloudsSuccess, cloudsErrors);
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
		//console.log(cloud);
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
		.go({ //We need to test this!!
			name:name,
			description:description,
			cloud:cloud,
			accountId:id,
			secret:secret
		})
		.response( this, function(inSender, inResponse){
			sender.parent.owner.$.Msg.setContent("Sucess");
		}).error( this, function(inSender, inResponse){
			sender.parent.owner.$.Msg.setContent("Error");
			popup.delete();
		});
	},
	cancelAction: function(sender , event){
		this.doBack(event);
	}
});