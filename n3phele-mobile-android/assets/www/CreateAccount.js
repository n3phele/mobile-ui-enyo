enyo.kind({  
	name: "CreateAccount",
	kind: "FittableRows",
	//classes: "onyx onyx-sample",
	// !!!! ~ Apenas esqueleto gráfico: SEM NNHUMA CHAMADA DE FUNC ontap,onselect,etc
	fit: true,
	style: "padding: 0px",
	events: {
		onBack: ""
	},
	components: [

	{kind: "onyx.Toolbar", style:"background:#b1c2d7;border:1px solid #375d8c;background-size:contain;color:#375d8c",components: [ { name: "title", content:"New Account" }, {fit: true}]},
		{kind: "FittableRows", name:"panel", fit: true, components: [
		{classes: "onyx-toolbar-inline", components: [
		{content: "*Name: ", classes:"enyo-inline"},
			{kind: "onyx.InputDecorator", components: [
				{kind: "onyx.Input", name: "name", placeholder: "Enter name here"}
			]}]},
			{classes: "onyx-toolbar-inline", components: [
			{content: "Description: ", classes:"enyo-inline"},
			{kind: "onyx.InputDecorator", components: [
				{kind: "onyx.Input", name: "description", placeholder: "Enter description here"}
			]}]},
			{classes: "onyx-toolbar-inline", components: [
			{content: "*On Cloud: ", classes:"enyo-inline"},
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
			{classes: "onyx-toolbar-inline", components: [
			{content: "*Cloud Id: ", classes:"enyo-inline"},
			{kind: "onyx.InputDecorator", components: [
				{kind: "onyx.Input", name: "id", placeholder: "Enter Id here"}
			]}]},
			{classes: "onyx-toolbar-inline", components: [
			{content: "*Cloud Secret: ", classes:"enyo-inline"},
			{kind: "onyx.InputDecorator", components: [
				{kind: "onyx.Input", name: "secret", type: "password", placeholder: "Enter secret here"}
			]}]}
			
	
	]} , {kind: "onyx.Toolbar",style:"background:#b1c2d7;border:1px solid #375d8c;background-size:contain;color:#375d8c;bottom:0; width:100%", components: [ {kind: "onyx.Button",style:"background-color:#FFFFFF;color:#375d8c;border-color:#375d8c" ,content: "Create", ontap: "newAccount"} , {kind: "onyx.Button", content: "Cancel", style:"float:right;background-color:#FFFFFF;color:#375d8c;border-color:#375d8c", ontap: "cancelAction"} ]}],
	
   //Funcs aqui,
	
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
		var  cloud = sender.parent.owner.$.cloud.getValue();
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
		this.doBack(event);
	}
});