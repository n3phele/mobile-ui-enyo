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
	
		{name:"panel", kind: "Scroller", fit: true, components: [
		{components: [
		{content: "*Name: "},
			{kind: "onyx.InputDecorator",style:"border:1px solid #9A9A9A", components: [
				{kind: "onyx.Input", name: "name", placeholder: "Enter name here"}
			]}]},
			{components: [
			{content: "Description: "},
			{kind: "onyx.InputDecorator",style:"border:1px solid #9A9A9A", components: [
				{kind: "onyx.Input", name: "description", placeholder: "Enter description here"}
			]}]},
			{components: [
			{content: "*On Cloud: "},
			{kind: "onyx.MenuDecorator", onSelect: "itemSelected", components: [
			{kind: "onyx.InputDecorator",style:"border:1px solid", components: [
				{kind: "onyx.Input", name: "cloud", disabled: true, placeholder: "",style:"-webkit-text-fill-color: #000000"}
			]},
			{content: "v", allowHtml:true,classes:"button-combobox-style"},
			{kind: "onyx.Menu", name: "cloudsList", style:"width:192px;background:#B9B9BD;color:#000", components: [   
				//{content: "EC2"},  
				//{content: "HPZone1"}   
			]}
		]}]},
			{components: [
			{content: "*Cloud Id: "},
			{kind: "onyx.InputDecorator",style:"border:1px solid #9A9A9A", components: [
				{kind: "onyx.Input", name: "id", placeholder: "Enter Id here"}
			]}]},
			{components: [
			{content: "*Cloud Secret: "},
			{kind: "onyx.InputDecorator",style:"border:1px solid #9A9A9A", components: [
				{kind: "onyx.Input", name: "secret", type: "password", placeholder: "Enter secret here"}
			]}]}
			
	
	]} ]} 
	],
	
	create: function() {
		this.inherited(arguments);
		
		var n3pheleClient = new N3pheleClient();
		n3pheleClient.uid = this.uid;
		
		var cloudsErrors = function() { console.log("getting clouds error"); }
		var thisPanel = this;
		var cloudsSuccess = function(clouds) { for (var i=0;i<clouds.length;i++) { thisPanel.$.cloudsList.createComponent( { content: clouds[i].name, object: clouds[i] } ); thisPanel.$.cloudsList.render(); thisPanel.$.cloudsList.reflow(); } }
		
		n3pheleClient.listClouds(cloudsSuccess, cloudsErrors);
		this.$.name.setPlaceholder(this.account.name);
		this.$.description.setPlaceholder(this.account.description);
		this.$.cloud.setPlaceholder(this.account.cloudName);
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

