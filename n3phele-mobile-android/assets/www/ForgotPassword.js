enyo.kind({ 
	name:"ForgotPassword",
	kind: "FittableRows",
	fit: true,	
	style: "padding: 0px;background:#fff",
	
	// create components of interface
	components: [
	{kind: "Panels", name:"panels", fit: true, classes: "panels-sample-sliding-panels panels", components:[
		{kind:"Scroller",classes: "scroller-sample-scroller enyo-fit", style: "background: white", components: [    
			
			//top toolbar that contains Title back button and Done button *************************************************************** 			
			 {kind: "onyx.Toolbar", classes: "toolbar-style", style:"font-size:17px;font-weight:bold", components: [   
				{name: "title", content:"User Password Reset" } 				
			]},	

			//this container contains the form of create repository***************************************************************
			{style:"text-align:center;margin-top: 25px", components:[	

				//Email input ***********************************************************************************************************************	
				{name:"mailMsg", classes:"msg"},				
				{name:"MsgSuccess", style: "color:#009900; text-align:center; margin:8px"},
				{kind: "onyx.InputDecorator", classes: "inputs", components: [					
					{kind: "onyx.Input", name: "email",style:"float:left;padding:2px 0 0 10px", placeholder: "Email"}
				]},
				
				//button that delete the account ****************************************************************************
				{name: "buttons",style:"text-align:center",  components:[  		
					{kind: "onyx.Button",  style:"width:95%;height:40px;margin:0.5em auto;border-radius:5px;font-family: helvetica, arial, sans-serif;font-size:17px" ,content: "reset", ontap: "reset"},			
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
	},	
	reset: function(sender, event){
		//obtain form data *********************************************
		var email = this.$.email.getValue();	
		
		var self = this;	
		
		if(this.form.emailVerification(email, this.$.mailMsg) == true){	
		
			var hdr = "signup:newuser";		
			var encodeHdr = Base64.encode( hdr );
			var ajaxParams = {
				url: serverAddress+"user/reset",
				headers:{ 'authorization' : "Basic "+ encodeHdr},
				method: "POST",
				contentType: "application/x-www-form-urlencoded",
				sync: false, 
			};		
			
			var ajaxComponent = n3phele.ajaxFactory.create(ajaxParams); //connection parameters
			ajaxComponent
			.go({
				email:email
			})
			//response received form server to open the main page of N3phele *************************
			.response( this, function(inSender, inResponse){
				this.$.MsgSuccess.setContent("Password reseted, verify your e-mail");
				setTimeout( function(){
					self.$.panels.destroy();
					self.loginPage.renderInto(document.body);
				}, 1000);			
			})
			//If the request get a error, there are two possibilities: Username or password are incorrect or the access denied *********************
			.error( this, function(inSender, inResponse){
				if(inResponse == 500){		
					this.$.mailMsg.show();
					sender.parent.owner.$.mailMsg.setContent("User password reset failure, user not found");			
				}	
			})
		}	
	},
	cancel: function(sender , event){
		this.$.panels.destroy();
		this.loginPage.renderInto(document.body);
	}
});