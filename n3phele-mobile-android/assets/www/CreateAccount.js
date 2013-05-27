enyo.kind({  
	name: "CreateAccount",
	kind: "FittableRows",
	
	fit: true,
	style: "padding: 0px",
	events: {
		onBack: ""
	},
	components: [
	{kind:"Scroller",classes: "scroller-sample-scroller enyo-fit", style:"background:#fff", components: [    
	{kind: "onyx.Toolbar",classes: "toolbar-style" ,components: [ { name: "title", content:"New Account" },{kind: "onyx.Button",classes:"button-style-right",content: "Done", ontap: "save"} , 
			{kind: "onyx.Button", content: "Account List", classes:"button-style-left", ontap: "cancelAction"}]},
	{tag: "br"},
		{name: "Msg", style: "color:#FF4500;"},
		{tag: "br"},
	{style:"text-align:center", components:[
		/* {name:"panel", kind: "Scroller", fit: true, components:[ */
		
		/* {content: "*Name: "}, */
			{kind: "onyx.InputDecorator",classes: "inputs", components: [
				{kind: "onyx.Input", name: "name", style:"float:left;padding:7px 0 0 10px",  placeholder: "Account name"}
			]},
			
			/* {content: "Description: "}, */
			{kind: "onyx.InputDecorator",classes: "inputs", components: [
				{kind: "onyx.Input", name: "description", style:"float:left;padding:7px 0 0 10px",  placeholder: "Account description"}
			]},
			/* {content: "*On Cloud: "}, */
			{tag:"select", classes:"styled-select", name:"cloudsList", style:"-webkit-appearance:none !important;outline:none",components:[             /* <<<<--------------------- */
					//{tag:"option", content:"aaaaaaaa"}						                                                             /* <<<<--------------------- */
			]},	
			/* {content: "*Cloud Id: "}, */
			{kind: "onyx.InputDecorator",classes: "inputs", components: [
				{kind: "onyx.Input", name: "id", style:"float:left;padding:7px 0 0 10px",  placeholder: "Cloud Id"}
			]},	
			/* {content: "*Cloud Secret: "}, */
			{kind: "onyx.InputDecorator",classes: "inputs", components: [
				{kind: "onyx.Input", name: "secret", type: "password",style:"float:left;padding:7px 0 0 10px",  placeholder: "Cloud secret"}
			]},
	]}   
	]}
	],
	
   
	create: function() {
		this.inherited(arguments);
		
		var n3pheleClient = new N3pheleClient();
		n3pheleClient.uid = this.uid;
		
		var cloudsErrors = function() { console.log("getting clouds error"); }
		var thisPanel = this;
		var cloudsSuccess = function(clouds) { for (var i=0;i<clouds.length;i++) { thisPanel.$.cloudsList.createComponent( { tag: "option", content: clouds[i].name, object: clouds[i] } ); thisPanel.$.cloudsList.render(); thisPanel.$.cloudsList.reflow(); } }
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