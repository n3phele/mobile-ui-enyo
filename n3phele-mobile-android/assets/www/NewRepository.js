enyo.kind({
	name: "NewRepository",
	classes: "onyx onyx-sample",
	fit: true,
	style: "padding: 0px",
	events: {
		onBack: ""
	},
	components: [
	{kind: "onyx.Toolbar", components: [ { name: "title", content:"New Repository" }, {fit: true}]},
		{tag: "br"},
		{name: "Msg", style: "color:#FF4500;"},
		{tag: "br"},
		{components: [
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
			{content: "*Location URL ", classes:"enyo-inline"},
			{kind: "onyx.InputDecorator", components: [
				{kind: "onyx.Input", name: "URL", placeholder: "Enter URL here"}
			]}]},
			{classes: "onyx-toolbar-inline", components: [
			{content: "*Kind ", classes:"enyo-inline"},
			{kind: "onyx.MenuDecorator", onSelect: "itemSelected", components: [
			{kind: "onyx.InputDecorator", components: [
				{kind: "onyx.Input", name: "kind", disabled: true, placeholder: ""}
			]},
			{content: "v", allowHtml:true, style: "border-radius: 0 2px 2px 0;"},
			{kind: "onyx.Menu", components: [
				{content: "S3"},
				{content: "Swift"}
			]}
		]}]},
			{classes: "onyx-toolbar-inline", components: [
			{content: "*Base Path ", classes:"enyo-inline"},
			{kind: "onyx.InputDecorator", components: [
				{kind: "onyx.Input", name: "path", placeholder: "Enter Base Path here"}
			]}]},
			{classes: "onyx-toolbar-inline", components: [
			{content: "*Authentication Id ", classes:"enyo-inline"},
			{kind: "onyx.InputDecorator", components: [
				{kind: "onyx.Input", name: "id", placeholder: "Enter Id here"}
			]}]},
			{classes: "onyx-toolbar-inline", components: [
			{content: "*New Password ", classes:"enyo-inline"},
			{kind: "onyx.InputDecorator", components: [
				{kind: "onyx.Input", name: "password", type: "password", placeholder: "Enter Password here"}
			]}]},
			{classes: "onyx-toolbar-inline", components: [
			{content: "*Confirm Password ", classes:"enyo-inline"},
			{kind: "onyx.InputDecorator", components: [
				{kind: "onyx.Input", name: "confirmPass", type: "password", placeholder: "Cofirm Password here"}
			]}]},
			{classes: "onyx-toolbar-inline", components: [
			{content: "Accessible to all n3phele user?", classes:"enyo-inline"},
			{kind:"onyx.Checkbox", name: "access"},
			]},
			{kind: "onyx.Toolbar",style:"background:#b1c2d7;border:1px solid #375d8c;position:absolute;bottom:0;width:100%;background-size:contain;color:#375d8c;clear: both", components: [
			{kind:"onyx.Button", content: "Cancel", ontap:"cancel",style:"float:right"},
			{kind:"onyx.Button", content: "Save", ontap:"save"}
		]}
	]}],
	
	create: function() {
		this.inherited(arguments);
	},
	
	itemSelected: function(inSender, inEvent) {
		//Menu selected item
		if (inEvent.originator.content){
			this.$.kind.setPlaceholder(inEvent.originator.content);
		}
	},
	save: function(sender, event){
		
		//obtain form data
		var  name = sender.parent.owner.$.name.getValue();
		var  description = sender.parent.owner.$.description.getValue();
		var  url = sender.parent.owner.$.URL.getValue();
		var  kind = sender.parent.owner.$.kind.getValue();
		var  path = sender.parent.owner.$.path.getValue();
		var  id = sender.parent.owner.$.id.getValue();
		var  password = sender.parent.owner.$.password.getValue();
		var  confirmPass = sender.parent.owner.$.confirmPass.getValue();
		var  access = sender.parent.owner.$.access.getValue();
		
		//validate form
		if( name.length == 0 || url.length == 0 || kind.length == 0 || path.length == 0 || id.length == 0 || password.length == 0 || confirmPass.length == 0){
			sender.parent.owner.$.Msg.setContent("Please, fill the form!");
			return;
		}
		
		// Processing Popup
		var popup = new spinnerPopup();
		popup.show();
		
		//request
		var ajaxParams = {
				url: serverAddress+"repository",
				headers:{ 'authorization' : "Basic "+ this.uid},
				method: "POST",
				contentType: "application/x-www-form-urlencoded",
				sync: false, 
			};
		var ajaxComponent = new enyo.Ajax(ajaxParams); //connection parameters
		ajaxComponent
		.go({
			name:name,
			target:url,
			kind:kind,
			root:path,
			isPublic:access,
			repositoryId:id,
			secret:password
		})
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
