/*
	This Kind represent the screen of login and the logic to encode the user and password to authentication.
*/
enyo.kind({ 
	name:"loginPage",
	kind: "FittableRows",
	fit: true,
	classes: "onyx onyx-sample",
	style: "padding: 0px",
	
	//create the components of interface
	components:[
			{name: "topToolbar", classes: "toolbar-style", kind: "onyx.Toolbar", components: [ {content: "N3phele"}, {fit: true}]},
				{classes: "panels-sample-sliding-content", allowHtml: true, style: "background: url('assets/bg_login.png') repeat; height: 100%; width:100%; display: table;", components:[
						{name: "login-container", style: "vertical-align: middle; display:table-cell; text-align:center;", components:[
								{name: "loginMsg"},
								//User input component ************************************
								{kind: "onyx.InputDecorator", style: "background-color: white;margin:2px;text-transform:lowercase;", components: [ {kind: "onyx.Input", autoCapitalize: "lowercase", autocorrect: false, name: "loginUser", placeholder: "Username"} ]},		
								{tag: "br"},
								//Password input component ************************************
								{kind: "onyx.InputDecorator", style: "background-color: white;margin:2px;", components: [ {kind: "onyx.Input", name: "loginPw", type:"password", placeholder: "Password"} ]},
								{tag: "br"},
								//Login button to authenticate user and open the main page of N3phele************************************
								{kind:"onyx.Button", content: "Login",classes:"button-style", style: "margin:2px 0", ontap:"validateUser"},								
								{name: "newRegister",classes: "forgotPassword", content: "register",style: " text-decoration: underline;padding:0 5px 15px 65px;font-size:12px;display:inline-block;font-size: 15px;", ontap:"registerUser"},
								{name: "forgotPassword",classes: "forgotPassword", content:"forgot password", style: " text-decoration: underline;padding-left:90px;font-size:12px;font-size: 15px;", ontap: "getAction"}
								
						]}//end div vertical cell
				]},//end panel table
	],//end components

	/*
		this function validate a user when the Login button is clicked 
	*/
	validateUser: function( sender, event){
	
		//obtain form data ********************************************
		var  user = sender.parent.owner.$.loginUser.getValue();
		var  pass = sender.parent.owner.$.loginPw.getValue();	
		//validate form ********************************************
		if( user.length == 0 || pass.length == 0 ){
			sender.parent.owner.$.loginMsg.setContent("Please, fill the form!");
			return;
		}
		// Processing Popup *****************************************
		var popup = new spinnerPopup();
		popup.show();
	
		//request user validation using Ajax ********************************************
		var hdr = user.replace("@", ".at-.") + ":" + pass;		
		var encodeHdr = Base64.encode( hdr );
		var ajaxParams = {
			url: serverAddress+"user/login",
			headers:{ 'authorization' : "Basic "+ encodeHdr},
			method: "POST",
			contentType: "application/x-www-form-urlencoded",
			sync: false, 
		};
		
		sender.parent.owner.$.loginMsg.setClasses("loginMsgEnable");
		var ajaxComponent = n3phele.ajaxFactory.create(ajaxParams); //connection parameters
		ajaxComponent
		.go()
		//response received form server to open the main page of N3phele *************************
		.response( this, function(inSender, inResponse){
			sender.parent.owner.$.loginMsg.setContent("User authenticated");
			
			var mainPage = new com.N3phele({ 'uid' : encodeHdr });

			n3phele.uid = encodeHdr;
			
			popup.delete();
			mainPage.renderInto(document.body);
		})
		//If the request get a error, there are two possibilities: Username or password are incorrect or the access denied *********************
		.error( this, function(inSender, inResponse){
		  if(inResponse == 403 ) sender.parent.owner.$.loginMsg.setContent("Incorrect username or password!");
		  else	sender.parent.owner.$.loginMsg.setContent("Access denied!");
			popup.delete();
		});
		
		//*******************************************************************
	},
	
	registerUser: function(sender, event){	
		var register = new NewRegistration({'loginPage' : this});		
		register.renderInto(document.body);
	},
	
	getAction: function(sender,event){ 
		var password = new ForgotPassword({'loginPage' : this});
		password.renderInto(document.body);
	},	
});//end kind
					
