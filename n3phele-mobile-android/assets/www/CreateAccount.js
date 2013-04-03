enyo.kind({
	name: "CreateAccount",
	classes: "onyx onyx-sample",
	fit: true,
	style: "padding: 0px",
	events: {
		onBack: ""
	},
	components: [
	{kind: "onyx.Toolbar", components: [ { name: "title", content:"New Account" }, {fit: true}]},
		{tag: "br"},
		{name: "Msg", style: "color:#FF4500;"},
		{tag: "br"},
		{style: "margin: auto;", components: [
		{classes: "onyx-toolbar-inline", components: [
		{content: "*Name ", classes:"enyo-inline"},
			{kind: "onyx.InputDecorator", components: [
				{kind: "onyx.Input", name: "name", placeholder: "Enter name here"}
			]}]},
			{classes: "onyx-toolbar-inline", components: [
			{content: "Description ", classes:"enyo-inline"},
			{kind: "onyx.InputDecorator", components: [
				{kind: "onyx.Input", name: "description", placeholder: "Enter description here"}
			]}]},
			{classes: "onyx-toolbar-inline", components: [
			{content: "*On Cloud ", classes:"enyo-inline"},
			{kind: "onyx.MenuDecorator", onSelect: "itemSelected", components: [
			{kind: "onyx.InputDecorator", components: [
				{kind: "onyx.Input", name: "cloud", disabled: true, placeholder: ""}
			]},
			{content: "v", allowHtml:true, style: "border-radius: 0 2px 2px 0;"},
			{kind: "onyx.Menu", components: [
				{content: "EC2"},
				{content: "HPZone1"}
			]}
		]}]},
			{classes: "onyx-toolbar-inline", components: [
			{content: "*Cloud Id ", classes:"enyo-inline"},
			{kind: "onyx.InputDecorator", components: [
				{kind: "onyx.Input", name: "id", placeholder: "Enter Id here"}
			]}]},
			{classes: "onyx-toolbar-inline", components: [
			{content: "*Cloud Secret ", classes:"enyo-inline"},
			{kind: "onyx.InputDecorator", components: [
				{kind: "onyx.Input", name: "secret", type: "password", placeholder: "Enter secret here"}
			]}]},
			{classes: "onyx-toolbar-inline", components: [
			{kind:"onyx.Button", content: "Cancel", ontap:"cancel"},
			{style: "margin: 20px;", components: [
			{kind:"onyx.Button", content: "Save", ontap:"save"}
		]}]}
	]}],
	
	create: function() {
		this.inherited(arguments);
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
	cancel: function(sender , event){
		this.doBack(event);
	}
});