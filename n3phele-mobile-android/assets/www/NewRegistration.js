enyo.kind({ 
	name:"NewRegistration",
	kind: "FittableRows",
	termsChecked: null,
	fit: true,	
	form:null,
	style: "padding: 0px;background:#fff",
	
	// create components of interface
	components: [
	{kind: "Panels", name:"panels", fit: true, classes: "panels-sample-sliding-panels panels", components:[
		{kind:"Scroller",classes: "scroller-sample-scroller enyo-fit", style: "background: white", components: [    
			
			//top toolbar that contains Title back button and Done button *************************************************************** 			
			{kind: "onyx.Toolbar", classes: "toolbar-style", style:"font-size:17px;font-weight:bold;padding:0", components: [   
				{name: "title", content:"New User Registration" } 				
			]},				
			
			{name: "Msg", style: "color:#FF4500; text-align:center; margin:8px"},	
			{name: "MsgSuccess", style: "color:#009900; text-align:center; margin:8px"},		

			//this container contains the form of create repository***************************************************************
			{style:"text-align:center;margin-top: 15px", components:[	

				//Email input ***********************************************************************************************************************	
				{name:"mailMsg", classes:"msg"},
				{kind: "onyx.InputDecorator", classes: "inputs", components: [					
					{kind: "onyx.Input", name: "email",style:"float:left;padding:2px 0 0 10px", placeholder: "Email"}
				]},

				//First Name input ***********************************************************************************************************************
				{name:"firstNameMsg", classes:"msg"},
				{kind: "onyx.InputDecorator",classes: "inputs", components: [
					{kind: "onyx.Input", name: "firstName",style:"float:left;padding:2px 0 0 10px", placeholder: "First Name"}
				]},

				//Last Name input ***********************************************************************************************************************
				{name:"lastNameMsg", classes:"msg"},
				{kind: "onyx.InputDecorator",classes: "inputs", components: [
					{kind: "onyx.Input", name: "lastName",style:"float:left;padding:2px 0 0 10px", placeholder: "Last Name"}
				]},
				
				//New password input ***********************************************************************************************************************
				{name:"newPasswordMsg", classes:"msg"},
				{kind: "onyx.InputDecorator",classes: "inputs", components: [
					{kind: "onyx.Input", name: "newPassword",style:"float:left;padding:2px 0 0 10px", type:"password", placeholder: "New password"}
				]},					
				
				//Confirm password input ***********************************************************************************************************************
				{name:"confirmPasswordMsg", classes:"msg"},
				{kind: "onyx.InputDecorator",classes: "inputs", components: [
					{kind: "onyx.Input", name: "confirmPassword",style:"float:left;padding:2px 0 0 10px", type:"password", placeholder: "Confirm password"}
				]},	
				
				{kind: "onyx.Toolbar", classes: "toolbar-style", style:"font-size:17px;font-weight:bold;padding:0", components: [   
					{name: "title", content:"New Account Registration" } 				
				]},
				
				//Name input ***********************************************************************************************************************
				{name:"nameMsg", style:"margin-top:15px", classes:"msg"},
				{kind: "onyx.InputDecorator",classes: "inputs", components: [
					{kind: "onyx.Input", name: "name",style:"float:left;padding:2px 0 0 10px", placeholder: "Name"}
				]},	
				
				//Description input ***********************************************************************************************************************
				{name:"descriptionMsg", classes:"msg"},
				{kind: "onyx.InputDecorator",classes: "inputs", components: [
					{kind: "onyx.Input", name: "description",style:"float:left;padding:2px 0 0 10px", placeholder: "Description"}
				]},	
				
				//On Cloud select ***********************************************************************************************************************
				{name:"onCloudMsg", classes:"msg"},				
				{kind:"Select", classes:"styled-select", name:"onCloud", style:"-webkit-appearance:none !important;outline:none",components:[]},				
				
				// Cloud Id input *********************************************************************************************************
				{name:"cloudIdMsg", classes:"msg"},
				{kind: "onyx.InputDecorator",classes: "inputs", components: [
					{kind: "onyx.Input", name: "cloudId",style:"float:left;padding:2px 0 0 10px", placeholder: "Cloud id"}
				]},		
				
				//Cloud Secret input ***********************************************************************************************************************
				{name:"cloudSecretMsg", classes:"msg"},
				{kind: "onyx.InputDecorator",classes: "inputs", components: [
					{kind: "onyx.Input", name: "cloudSecret",style:"float:left;padding:2px 0 0 10px", placeholder: "Cloud secret"}
				]},			

				//Terms of Service  ****************************************************************************************************************
				{name:"termsMsg", classes:"msg"},
				{style:"width:97%;text-align:left;padding-left:2.4%", components:[
					{kind:"onyx.Checkbox", onchange:"checkboxChanged", style:"padding-right:5px"},  
					{content:"By registering, you agree to our", style:"display: initial;padding-right:4px"},
					{content:"Terms of Service", classes: "forgotPassword", style:"text-decoration: underline;display: inline;", ontap: "getAction"}
				]},
				//button that delete the account ****************************************************************************
				{name: "buttons",style:"text-align:center",  components:[  		
					{kind: "onyx.Button",  style:"width:95%;height:40px;margin:0.5em auto;border-radius:5px;font-family: helvetica, arial, sans-serif;font-size:17px" ,content: "register", ontap: "register"},			
					{kind: "onyx.Button",  style:"width:95%;height:40px;margin:0.5em auto;border-radius:5px;font-family: helvetica, arial, sans-serif;font-size:17px" ,content: "cancel", ontap: "cancel"}					
				]}			
			]}
		]}
	]}	
	],	
	constructor: function(args) {	
		this.inherited(arguments);
		//Dependency Injection
		if(args.loginPage){ 
			this.loginPage = args.loginPage;
		}		
		this.form = new formVerification();		
		this.getClouds();	
	}, 	
	
	
	
	getScript: function(){
		var script = this.$.getScript("formVerification.js", function(){
			form = formValidation();
		})
		return form;
	},

	checkboxChanged: function(inSender){		
		this.termsChecked = inSender.active;		
	},
	
	register: function(sender, event){  
		//obtain form data *********************************************		
		
		var email = this.$.email.getValue();
		var firstName = this.$.firstName.getValue();
		var lastName = this.$.lastName.getValue();
		var newPassword = this.$.newPassword.getValue();
		var confirmPassword = this.$.confirmPassword.getValue();
		var name = this.$.name.getValue();
		var description = this.$.description.getValue();
		var cloudId = this.$.cloudId.getValue();
		var cloudSecret = this.$.cloudSecret.getValue();
		var onCloud = this.$.onCloud.getValue();
		
		var check = true;
		var self = this;			
		
		//validate form ******************************************************************************		
		if(this.termsChecked == true){			
			this.$.termsMsg.hide();		
			
			if(this.form.emailVerification(email, this.$.mailMsg) == false) check = false;			
			if(this.form.fieldVerification(firstName, this.$.firstNameMsg) == false) check = false;
			if(this.form.fieldVerification(lastName, this.$.lastNameMsg) == false) check = false;
			if(this.form.fieldVerification(newPassword, this.$.newPasswordMsg) == false) check = false;
			if(this.form.passwordVerification(confirmPassword, newPassword, this.$.confirmPasswordMsg) == false) check = false;
			if(this.form.fieldVerification(name, this.$.nameMsg) == false) check = false;
			if(this.form.fieldVerification(description, this.$.descriptionMsg) == false) check = false;
			if(this.form.fieldVerification(cloudId, this.$.cloudIdMsg) == false) check = false;
			if(this.form.fieldVerification(cloudSecret, this.$.cloudSecretMsg) == false) check = false;
			if(this.form.fieldVerification(onCloud, this.$.onCloudMsg) == false) check = false;
			
			if(check == true){
				var hdr = "signup:newuser";		
				var encodeHdr = Base64.encode( hdr );
				var ajaxParams = {
					url: serverAddress+"user",
					headers:{ 'authorization' : "Basic "+ encodeHdr},
					method: "POST",
					contentType: "application/x-www-form-urlencoded",
					sync: false, 					
				};					
				var ajaxComponent = n3phele.ajaxFactory.create(ajaxParams); //connection parameters		
				ajaxComponent				
				.go({
					email:email,
					firstName:firstName,
					lastName:lastName,
					secret:newPassword,
					accountName:name,
					description:description,
					cloud:onCloud,
					accountId:cloudId,
					accountSecret:cloudSecret
				})		
				.response( this, function(inSender, inResponse){				
					sender.parent.owner.$.MsgSuccess.setContent("Registered User Successfully");					
					setTimeout( function(){						
						self.$.panels.destroy();
						self.loginPage.renderInto(document.body);						
					}, 1000);					
				})		
				.error( this, function(inSender, inResponse){				
				this.$.mailMsg.show();
				if(inResponse == 500){
					if(inSender.xhrResponse.headers.error == "User"){
						sender.parent.owner.$.mailMsg.setContent("A user with that email already exists");
					}else{
						sender.parent.owner.$.mailMsg.setContent("An internal error occurred");
					}					
				}				
				});	
			}	
		}else{			
			this.$.termsMsg.show();
			this.$.termsMsg.setContent("In order to use our services, you must agree to N3phele's Terms of Service.");
		} 
	},
	
	getAction:function(sender,event){  
		var actionURL ="https://region-a.geo-1.objects.hpcloudsvc.com:443/v1/12365734013392/images/Terms_of_Service.html";
		window.open(actionURL);		
	},
	
	cancel: function(sender , event){		
		this.$.panels.destroy();
		this.loginPage.renderInto(document.body);
	},
	
	getClouds: function(){
	var thisPanel = this;	
		var hdr = "signup:newuser";		
		var encodeHdr = Base64.encode( hdr );
		var ajaxParams = {
			url: serverAddress+"cloud",
			headers:{ 'authorization' : "Basic "+ encodeHdr},
			method: "GET",
			contentType: "application/x-www-form-urlencoded",
			sync: false, 
		};		
		
		var ajaxComponent = n3phele.ajaxFactory.create(ajaxParams); //connection parameters		
		ajaxComponent
		.go({})
		//response received form server to load On Cloud options *************************
		.response( this, function(sender, response){	
			
			response.elements = fixArrayInformation(response.elements);
			for (var i=0; i < response.elements.length; i++) { 
				thisPanel.$.onCloud.createComponent({tag: "option", content: response.elements[i].name, value: response.elements[i].uri, object: response.elements[i]});
				thisPanel.$.onCloud.render(); 
				thisPanel.$.onCloud.reflow(); 
			}	
		
		})
		.error( this, function(inSender, inResponse){			
		  if(inResponse == 500) 
			sender.parent.owner.$.onCloudMsg.setContent("An error occurred when trying get the clouds, please try again.");		   
		});
	}	
});