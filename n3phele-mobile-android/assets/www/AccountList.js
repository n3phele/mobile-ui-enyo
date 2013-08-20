/*
	The main classes that mount the account list page 
 */
enyo.kind({ 
	name:"AccountList",
	kind: "FittableRows",
	fit: true,
	accountName:"",
	results:null,
	datainfo:null,
	style: "padding: 0px",
	events: {
		onCreateAcc: "", //this fuction occurs when the user clicked on add account button(+)
		onClickItem:"", //this fuction occurs when the user clicked on a account in list
		onBack:"", //this fuction occurs when the user clicked on back button
		onLost:"", //this fuction occurs when the connection is lost
	}, 
	//create components of interface
	components:[

	//top toolbar that contains Title and add account button(+) ***************************************************************
		{kind: "onyx.Toolbar", classes:"toolbar-style", name: "toolTop", components: [{ name: "title", content:"Accounts" }, {kind: "onyx.Button", classes:"button-style-right", content: "+", style: "font-size: 20px !important;font-weight: bold;", ontap: "newAccount"}]},		 
		
		{name: "values", style:"font-weight: bold;padding-left:13px;margin: 0.3em auto", components:[  
			{content: "Name", style:"display: inline-block; width:26%;font-weight: bold"} 					       					
		]},

       	 {name: "divider", classes: "list-divider"},	
         {name: "Spin",kind:"onyx.Spinner",classes: "onyx-light",style:" margin-top:100px;margin-left:45%"},
        
        // create the list of accounts	*****************************************************	
	    {name: "list", classes:"keyframe", kind: "List", touch: true,  multiSelect: false, fit: true, style:"height:87%;", onSetupItem: "setupItem", components: [
	         {name: "item", style: "padding: 10px 0 10px 10px;margin:auto;border:1px solid rgb(217,217,217)", ontap: "selectedAccount", components: [
	         	{name: "name", style:"width: 26%; display: inline-block"}, 				
				{name: "icon2", kind: "onyx.IconButton",style:"float:right;margin-right:-11px",src: "assets/next.png", ontap: "nextItem"} 	    				
	         ]}
	     ]},
         {tag: "br"},

        // this message appears if there is any account in list of accounts **************************
		{name: "Msg", style: "color:#FF4500; text-align:center"},
		{tag: "br"},		 
	],

	/*
		this function create the content of the list, and do a request to the server to populate this list.
	*/
	create: function(){
		this.inherited(arguments)
		
		this.$.Spin.show();
		var thisPanel = this;

		// The Back Menu button appears only on smaller screen ***********************
		if (this.closePanel.isScreenNarrow()) {
			this.createComponent({kind: "onyx.Button",classes:"button-style-left", content: "Menu", ontap: "backMenu", container: this.$.toolTop}).render();
		}
		
		// These contents only are created if the screen is larger than 350 ***********************************
		if ($(window).width() > 350){			
			this.createComponent({content: "Last 24 hours", style:"display: inline-block; width:25%;font-weight: bold", container: this.$.values}).render();
			this.createComponent({content: "Active", style:"display: inline-block; width:20%;font-weight: bold", container: this.$.values}).render();
			this.createComponent({content: "Cloud", style:"display: inline-block; width:24%;font-weight: bold", container: this.$.values}).render();
				
			this.createComponent({name: "cost",  style:"width:25%; display: inline-block;", container: this.$.item }).render();
			this.createComponent({name: "active",  style:"width:20%; display: inline-block" , container: this.$.item}).render();
			this.createComponent({name: "cloud", style:"width:17%; display: inline-block", container: this.$.item }).render();
		} 
		
		this.updateAccountList(this);
		
		var self = this;
		var updateList = function(){
			self.updateAccountList(self);
		}
		n3phele.addListener(this, updateList, serverAddress+"account" );
		
		this.render();
	},

	updateAccountList: function(panel){
		//request list of accounts using Ajax ********************************************
		var ajaxComponent = n3phele.ajaxFactory.create({ 
			url: serverAddress+"account/accountData",
			headers:{ 'authorization' : "Basic "+ panel.uid},
			method: "GET",
			contentType: "application/x-www-form-urlencoded",
			sync: false, 
		}); 
				
		ajaxComponent.go()

		// Get the response elements of accounts ***************************************
		.response(panel, function(sender, response){
			response.elements = fixArrayInformation(response.elements);

			//results receives the response elements of the request ****************
			results = response.elements;
			panel.$.list.setCount(results.length);
			panel.$.list.reset();
			panel.$.Spin.hide();
		})
	
		.error(panel, function(inSender, inResponse){
		 if(inSender.xhrResponse.status == 0) 
		 	alert("Connection Lost");
		 	//this.doLost();
  			panel.$.Spin.hide();
		});	

		var ajaxComponent = n3phele.ajaxFactory.create({
			url: serverAddress+"account/",
			headers:{ 'authorization' : "Basic "+ panel.uid},
			method: "GET",
			contentType: "application/x-www-form-urlencoded",
			sync: false, 
		}); 
				
		ajaxComponent.go()
		.response(panel, function(sender, response){
			response.elements = fixArrayInformation(response.elements);
			panel.datainfo = response.elements;
			
		})
		.error(panel, function(){
			console.log("Error to load the description of the account!");
		});		

	},

	destroy: function() {
		// do inherited teardown
		this.inherited(arguments);
		n3phele.removeListener(this);
	},

	/*
			this function occurs when a item on the list of accounts is clicked and then go to the Account Detail screen.
	*/
	selectedAccount: function(sender, event){
	var description = "";
	
	// get the description of account ****************************************
	for (var i=0;i<this.datainfo.length;i++){ 
        if(this.datainfo[i].uri == results[event.index].uriAccount) description = this.datainfo[i].description;
	}	
		
	// Set the information of account that was clicked *************************************************************
        var accountInformation = new Object();
		accountInformation.accountName = results[event.index].accountName;
		accountInformation.actives = results[event.index].actives;
		accountInformation.cloud = results[event.index].cloud;
		accountInformation.cost = results[event.index].cost;
		accountInformation.uriAccount = results[event.index].uriAccount;
		accountInformation.description = description;
	
	// do the event onClickItem passing the account informations to the Account Detail screen. *********************  
 		this.doClickItem(accountInformation);
	},

	/*
		this function occurs when the add account button(+) is clicked and goes to the Create Account screen
	*/
	newAccount: function(sender, event){
		this.doCreateAcc();
	},

	/*
		this function setup the content of the list and populate it.
	*/
	setupItem: function(sender, event){
		if(results == null ) return;
		
		this.$.item.addRemoveClass("onyx-selected", sender.isSelected(event.index));
		
		var item = results[event.index];
		this.$.name.setContent(item.accountName);
		
		//if the screen is bigger than 350, others informations are setup
		if ($(window).width() > 350){
			this.$.cost.setContent(item.cost);
			this.$.active.setContent(item.actives);
			this.$.cloud.setContent(item.cloud);
		}

		// If the account name is bigger than the size of screen, we set it to put "..." on the string
		if($(window).width() > 350 && $(window).width() < 800){
			
			if(item.accountName.length < 15){
				this.accountName = item.accountName;
			}else {
				this.accountName = item.accountName.substr(0,12).concat("...");						
			}	
			this.$.name.setContent(this.accountName);
		}			 	
		
		if( event.index % 2 == 1){
	   		this.$.item.applyStyle("background-color", "#F7F7F7")
	    };
        
        if( event.index % 2 == 0){
	   		this.$.item.applyStyle("background-color", "white")
	    };
	},
	
	/*
		this function back to the menu page
	*/
	backMenu: function( sender , event){
		this.doBack(event);
	},
});