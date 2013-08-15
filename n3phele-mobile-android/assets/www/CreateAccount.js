/*
	This Kind represent the Create Account page
*/
enyo.kind({  
	name: "CreateAccount",
	kind: "FittableRows",
	fit: true,
	style: "padding: 0px",
	events: {
		onBack: "",
		onSucess:"",
		onLost:"",
	},
	// create components of interface
	components: [
		{kind:"Scroller",classes: "scroller-sample-scroller enyo-fit", style:"background:#fff", components: [   

			//top toolbar that contains Title back button and Done button *************************************************************** 
			{kind: "onyx.Toolbar",classes: "toolbar-style" ,components: [
				{name: "title", content:"New Account" },
				{kind: "onyx.Button",classes:"button-style-right",content: "Done", ontap: "save"}, 
				{kind: "onyx.Button", content: "Accounts", classes:"button-style-left", ontap: "back"}
			]},

			{tag: "br"},
			{name: "Msg", style: "color:#FF4500; text-align:center"},
			{tag: "br"},

			//this container contains the form of create account***************************************************************
			{style:"text-align:center", components:[
			
				//Name input ***********************************************************************************************************************
				{kind: "onyx.InputDecorator",classes: "inputs", components: [
					{kind: "onyx.Input", name: "name", style:"float:left;padding-left:10px",  placeholder: "Account name"}
				]},
				// Description input ***************************************************************************************************
				{kind: "onyx.InputDecorator",classes: "inputs", components: [
					{kind: "onyx.Input", name: "description", style:"float:left;padding-left:10px",  placeholder: "Account description"}
				]},
				// On cloud select *********************************************************************************************************
				{kind:"Select", classes:"styled-select", name:"cloudsList", style:"-webkit-appearance:none !important;outline:none",components:[]},	
				//Cloud id input************************************************************************************************************************
				{kind: "onyx.InputDecorator",classes: "inputs", components: [
					{kind: "onyx.Input", name: "id", style:"float:left;padding-left:10px",  placeholder: "Cloud Id"}
				]},
				//Cloud Secret input ***********************************************************************************************************************
				{kind: "onyx.InputDecorator",classes: "inputs", components: [
					{kind: "onyx.Input", name: "secret", type: "password",style:"float:left;padding-left:10px",  placeholder: "Cloud secret"}
				]},
			]}   
		]}
	],
	
  	/*
		this function set the cloud combobox options
	*/
	create: function() {
		this.inherited(arguments);
		
		var n3pheleClient = new N3pheleClient();
		n3pheleClient.uid = this.uid;
		var cloudsErrors = function() { console.log("Problem to load clouds!"); }
		var thisPanel = this;
		
		var cloudsSuccess = function(clouds) { 
			for (var i=0;i<clouds.length;i++) { 
				thisPanel.$.cloudsList.createComponent({ tag: "option", content: clouds[i].name, value: clouds[i].uri, object: clouds[i]}); 
				thisPanel.$.cloudsList.render(); thisPanel.$.cloudsList.reflow(); 
			} 
		}

		n3pheleClient.listClouds(cloudsSuccess, cloudsErrors);
	},

	/*
		this function create a new Account
	*/
	save: function(sender, event){
		
		//obtain form data *********************************************
		var  name = this.$.name.getValue();
		var  description = this.$.description.getValue();
		var  cloud = this.$.cloudsList.getValue();
		var  id = this.$.id.getValue();
		var  secret = this.$.secret.getValue();

		//validate form ******************************************************************************
		if( name.length == 0 || cloud.length == 0 || id.length == 0 || secret.length == 0){
			this.$.Msg.setContent("Please, fill the form!");
			return;
		}

		//request ***********************************************************************************
		var ajaxParams = {
				url: serverAddress+"account",
				headers:{ 'authorization' : "Basic "+ this.uid},
				method: "POST",
				contentType: "application/x-www-form-urlencoded",
				sync: false, 
			};
		var ajaxComponent = n3phele.ajaxFactory.create(ajaxParams); //connection parameters
		ajaxComponent
		.go({ 
			name:name,
			description:description,
			cloud:cloud,
			accountId:id,
			secret:secret
		})
		.response( this, function(inSender, inResponse){
			this.$.Msg.setContent("Success");
			this.doSucess();
		}).error(this, function(){
			 if(inSender.xhrResponse.status == 0) 
		   		this.doLost();		
		});
	},

	/*
		this function back to the account page
	*/
	back: function(sender , event){
		this.doBack(event);
	}
});