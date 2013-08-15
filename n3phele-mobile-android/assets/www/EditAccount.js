/*
	This Kind represent the Edit Account page
*/
enyo.kind({
	name: "EditAccount",
	kind: "FittableRows",
	fit: true,
	style: "padding: 0px",
	events: {
		onBack: "",
		onEdit:""
	},
	//create components of interface	
	components: [
		{kind:"Scroller",style: "background: #fff",classes: "scroller-sample-scroller enyo-fit",components: [

			//top toolbar that contains Title back button and Done button *************************************************************** 
			{kind: "onyx.Toolbar",  classes: "toolbar-style",components: [ 
				{name: "title", content:"Edit Account" }, {kind: "onyx.Button",classes:"button-style-right",content: "Done", ontap: "save"} , 
	    		{kind: "onyx.Button", content: "Account Detail", classes:"button-style-left", ontap: "back"}
	    	]},

	    {tag: "br"},
		{name: "Msg", style: "color:#FF4500; text-align:center"},
		{tag: "br"},

		//this container contains the form of create account***************************************************************
			{style:"text-align:center", components:[	
				{name:"panel", kind: "Scroller", fit: true, components: [
				
					//Name input ***********************************************************************************************************************
					{kind: "onyx.InputDecorator",classes: "inputs", components: [
						{kind: "onyx.Input",style:"float:left;padding-left:10px", name: "name", placeholder: "Account name"}
					]},
			
					// Description input ***************************************************************************************************
					{kind: "onyx.InputDecorator",classes: "inputs", components: [
						{kind: "onyx.Input",style:"float:left;padding-left:10px", name: "description", placeholder: "Account description"}
					]},
					// On cloud select *********************************************************************************************************
					{kind:"Select", classes:"styled-select", name:"cloudsList", style:"-webkit-appearance:none !important;outline:none",components:[]},
				
					//Cloud id input************************************************************************************************************************
					{kind: "onyx.InputDecorator",classes: "inputs", components: [
						{kind: "onyx.Input",style:"float:left;padding-left:10px", name: "id", placeholder: "Cloud Id"}
					]},
				
					//Cloud Secret input ***********************************************************************************************************************
					{kind: "onyx.InputDecorator",classes: "inputs", components: [
						{kind: "onyx.Input",style:"float:left;padding-left:10px", name: "secret", type: "password", placeholder: "Cloud secret"}
					]},	
				]} 
			]} 
		]}	
	],

	/*
		this function set the clouds combobox options and preview informations
	*/
	create: function() {
		this.inherited(arguments);
		
		var n3pheleClient = new N3pheleClient();
		n3pheleClient.uid = this.uid;
		
		var cloudsErrors = function() { console.log("getting clouds error"); }
		var thisPanel = this;
		var cloudsSuccess = function(clouds) { for (var i=0;i<clouds.length;i++) { thisPanel.$.cloudsList.createComponent( {tag: "option", content: clouds[i].name, value: clouds[i].uri, object: clouds[i] } ); thisPanel.$.cloudsList.render(); thisPanel.$.cloudsList.reflow(); } }
		
		n3pheleClient.listClouds(cloudsSuccess, cloudsErrors);
		this.$.name.setPlaceholder(this.account.accountName);
	
		this.$.description.setPlaceholder(this.account.description);
	},

	/*
		this function edit a Account
	*/
	save: function(sender, event){
		
		//obtain form data ******************************************************
		var accountId = this.account.uriAccount;
		accountId = accountId.substr(accountId.lastIndexOf('/') + 1,accountId.lenght);
	  	var  name = this.$.name.getValue();
		if(name  =="") { name = this.$.name.getPlaceholder();}
	 
		var  description = this.$.description.getValue();
	    var  cloud = this.$.cloudsList.getValue();
		var  id = this.$.id.getValue();
		var  secret = this.$.secret.getValue();
		
		//validate form *************************************************************************
		if( name.length == 0 || cloud.length == 0 || id.length == 0 || secret.length == 0){
			this.$.Msg.setContent("Please, fill the form!");
			return;
		}		
		//request **************************************************************************
		var ajaxParams = {
				url: serverAddress + "account/" + accountId,
				headers:{ 'authorization' : "Basic "+ this.uid},
				method: "POST",
				contentType: "application/x-www-form-urlencoded",
				sync: false, 
			};
		var ajaxComponent = n3phele.ajaxFactory.create(ajaxParams); //connection parameters
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

	/*
		this function back to the account page
	*/
	back: function(sender , event){
		this.doBack();
	}
});

