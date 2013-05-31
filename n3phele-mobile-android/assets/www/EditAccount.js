enyo.kind({
	name: "EditAccount",
	kind: "FittableRows",
	
	fit: true,
	style: "padding: 0px",
	events: {
		onBack: "",
		onEdit:""
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
					{kind: "onyx.Input",style:"float:left;padding:7px 0 0 10px", name: "name", placeholder: "Account name"}
				]},
			
				//{content: "Description: "},
				{kind: "onyx.InputDecorator",classes: "inputs", components: [
					{kind: "onyx.Input",style:"float:left;padding:7px 0 0 10px", name: "description", placeholder: "Account description"}
				]},
			
				//{content: "*On Cloud: "},
				{kind:"Select", classes:"styled-select", name:"cloudsList", style:"-webkit-appearance:none !important;outline:none",components:[             /* <<<<--------------------- */
					//{tag:"option", content:"aaaaaaaa"}						                                                             /* <<<<--------------------- */
				]},
				
				//{content: "*Cloud Id: "},
				{kind: "onyx.InputDecorator",classes: "inputs", components: [
					{kind: "onyx.Input",style:"float:left;padding:7px 0 0 10px", name: "id", placeholder: "Cloud Id"}
				]},
				
				//{content: "*Cloud Secret: "},
				{kind: "onyx.InputDecorator",classes: "inputs", components: [
					{kind: "onyx.Input",style:"float:left;padding:7px 0 0 10px", name: "secret", type: "password", placeholder: "Cloud secret"}
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
		var cloudsSuccess = function(clouds) { for (var i=0;i<clouds.length;i++) { thisPanel.$.cloudsList.createComponent( {tag: "option", content: clouds[i].name, value: clouds[i].uri, object: clouds[i] } ); thisPanel.$.cloudsList.render(); thisPanel.$.cloudsList.reflow(); } }
		
		n3pheleClient.listClouds(cloudsSuccess, cloudsErrors);
		this.$.name.setPlaceholder(this.account.name);
	
		this.$.description.setPlaceholder(this.account.description);
		//this.$.cloudList.setContent(this.account.cloudName);
	},
	
	itemSelected: function(inSender, inEvent) {
		//Menu selected item
		if (inEvent.originator.content){
			this.$.cloud.setPlaceholder(inEvent.originator.content);
		}
	},
	save: function(sender, event){
		
		//obtain form data
		var accountId = this.account.uri;
		accountId = accountId.substr(accountId.lastIndexOf('/') + 1,accountId.lenght);
	  var  name = this.$.name.getValue();
		if(name  =="") { name = this.$.name.getPlaceholder();}
		console.log(name);
	 
		var  description = this.$.description.getValue();
	    var  cloud = this.$.cloudsList.getValue();
		var  id = this.$.id.getValue();
		var  secret = this.$.secret.getValue();
		
		//validate form
		if( name.length == 0 || cloud.length == 0 || id.length == 0 || secret.length == 0){
			this.$.Msg.setContent("Please, fill the form!");
			return;
		}		
		//request
		var ajaxParams = {
				url: serverAddress + "account/" + accountId,
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
			this.$.Msg.setContent("Success");
            this.doEdit();			
		}).error( this, function(inSender, inResponse){
			this.$.Msg.setContent("Error");
			popup.delete();
		});
		
	},
	cancelAction: function(sender , event){
		this.doBack();
	}
});

