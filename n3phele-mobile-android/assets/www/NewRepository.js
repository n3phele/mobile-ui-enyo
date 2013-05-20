enyo.kind({
	name: "NewRepository",
	classes: "onyx onyx-sample",
	fit: true,
	style: "padding: 0px",
	events: {
		onBack: ""
	},
	components: [
	{kind:"Scroller",classes: "scroller-sample-scroller enyo-fit", style: "background: white", components: [
    
	{kind: "onyx.Toolbar", classes: "toolbar-style", components: [ { name: "title", content:"New Repository" }, {kind:"onyx.Button", content: "Done", classes: "button-style-right", ontap:"save"},
			{kind:"onyx.Button", content: "<", ontap:"cancel", classes: "button-style-left"}]},
		{tag: "br"},
		{name: "Msg", style: "color:#FF4500;"},
		{tag: "br"},
		{name:"panel", kind: "Scroller", fit: true, components:[
		{components: [
		{content: "*Name "},
			{kind: "onyx.InputDecorator",style:"border:1px solid #9A9A9A", components: [
				{kind: "onyx.Input", name: "name", placeholder: "Enter name here"}
			]}]},
			{components: [
			{content: "Description "},
			{kind: "onyx.InputDecorator",style:"border:1px solid #9A9A9A", components: [
				{kind: "onyx.Input", name: "description", placeholder: "Enter description here"}
			]}]},
			{components: [
			{content: "*Location URL "},
			{kind: "onyx.InputDecorator",style:"border:1px solid #9A9A9A", components: [
				{kind: "onyx.Input", name: "URL", placeholder: "Enter URL here"}
			]}]},
			{components: [
			{content: "*Kind "},
			{kind: "onyx.MenuDecorator", onSelect: "itemSelected", components: [
			{kind: "onyx.InputDecorator",style:"border:1px solid", components: [
				{kind: "onyx.Input", name: "kind", disabled: true, placeholder: "",style:"-webkit-text-fill-color: #000000"}
			]},
			{content: "v", allowHtml:true, classes:"button-combobox-style"},
			{kind: "onyx.Menu", style:"width:192px;background:#303030", components: [
				{content: "S3"},
				{content: "Swift"}
			]}
		]}]},
			{components: [
			{content: "*Base Path "},
			{kind: "onyx.InputDecorator",style:"border:1px solid #9A9A9A", components: [
				{kind: "onyx.Input", name: "path", placeholder: "Enter Base Path here"}
			]}]},
			{ components: [
			{content: "*Authentication Id "},
			{kind: "onyx.InputDecorator",style:"border:1px solid #9A9A9A", components: [
				{kind: "onyx.Input", name: "id", placeholder: "Enter Id here"}
			]}]},
			{components: [
			{content: "*New Password "},
			{kind: "onyx.InputDecorator",style:"border:1px solid #9A9A9A", components: [
				{kind: "onyx.Input", name: "password", type: "password", placeholder: "Enter Password here"}
			]}]},
			/* {components: [
			{content: "*Confirm Password "},
			{kind: "onyx.InputDecorator",style:"border:1px solid #9A9A9A", components: [
				{kind: "onyx.Input", name: "confirmPass", type: "password", placeholder: "Cofirm Password here"}
			]}]}, */
			{components: [
			{content: "Accessible to all n3phele user?"},
			{kind:"onyx.Checkbox", name: "access"},
			]},
			
		]}
	]}
/* 		{kind: "onyx.Toolbar",style:"background:#b1c2d7;border:1px solid #375d8c;position:absolute;bottom:0;width:100%;background-size:contain;color:#375d8c;", components: [
			{kind:"onyx.Button", content: "Done", ontap:"save"},
			{kind:"onyx.Button", content: "<", ontap:"cancel", classes: "button-style-left"}
		]} */
	],
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
 		var  path = sender.parent.owner.$.path.getValue();
		var url = sender.parent.owner.$.URL.getValue();
		var kind = sender.parent.owner.$.kind.getPlaceholder();
		var  id = sender.parent.owner.$.id.getValue();
		var  password = sender.parent.owner.$.password.getValue();
	
		var  access = sender.parent.owner.$.access.getValue();
		console.log(kind.length);
		//validate form
		if( name.length == 0 || url.length == 0 || kind.length == 0 || path.length == 0 || id.length == 0 || password.length == 0){
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
			sender.parent.owner.$.Msg.setContent("Sucess");
		}).error( this, function(inSender, inResponse){
			sender.parent.owner.$.Msg.setContent("Error");
			popup.delete();
		});
	},
	cancel: function(sender , event){
		this.doBack(event);
	}
});
