/*
	The main class that mount the Service List page 
 */
enyo.kind({ 
	name:"ServiceList",
	kind: "FittableRows",
	fit: true,
	results:null,
	style: "padding: 0px",
	events: {
		onCreateService: "",
		onClickService:"",
		onBack:"",
		onLost:"",
	},
	//create components of interface
	components:[

		//top toolbar that contains Title and add service button(+) ***************************************************************
		{name:"toolBar",  classes: "toolbar-style", kind: "onyx.Toolbar", components: [ { name: "title", content:"Services" }, 
			{kind: "onyx.Button",  content: "+", ontap: "newService", style: "font-size: 20px !important;font-weight: bold;", classes:"button-style-right"},
			{fit: true}
		]},
		
		{name: "Spin",kind:"onyx.Spinner",classes: "onyx-light",style:" margin-top:100px;margin-left:45%"},
		
		// create the list of services	*****************************************************	
		{name: "list", classes:"keyframe", kind: "List", touch: true,  multiSelect: false, style:"height:80%;", fit: true, onSetupItem: "setupItem" , components: [
	    	{name: "item", style: "padding: 10px 0 10px 10px; margin:auto; border:1px solid rgb(200,200,200)", ontap: "selectedService", components: [
	        	{name: "name", style:"width: 75%; display: inline-block"},
		    	{name: "icon2", kind: "onyx.IconButton",style:"float:right",src: "assets/next.png"} 
	    	]}
	    ]},	  

	    {tag: "br"},
	     // this message appears if there is any service in list of services **************************
		{name: "Msg", style: "color:#FF4500; text-align:center"},
		{tag: "br"}	
	],	

	/*
		this function create the content of the list, and do a request to the server to populate this list.
	*/
	create: function(){
		this.inherited(arguments);
		this.$.Spin.show();

        var listSize;
		var thisPanel = this;
		
		if (this.closePanel.isScreenNarrow()) {
		     this.createComponent({kind: "onyx.Button", classes:"button-style-left", content: "Menu", ontap: "backMenu", container: this.$.toolBar}).render();
		} 
		
		results = new Array();

		this.updateServiceList(this);
		
		var self = this;
		var updateList = function(){
			self.updateServiceList(self);
		}
		n3phele.addListener(this, updateList, serverAddress+"process/activeServiceActions" );
		
		this.render();
	},

	/*
		this function update the service list and do the request call to the server 
	*/
	updateServiceList: function(panel){
		var ajaxParams = {
			url: serverAddress+"process/activeServiceActions",
			headers:{ 'authorization' : "Basic "+ panel.uid},
			method: "GET",
			contentType: "application/x-www-form-urlencoded",
			sync: false, 
		};	
		
		var ajaxComponent = n3phele.ajaxFactory.create(ajaxParams); //connection parameters		
		ajaxComponent.go()
		.response( panel, "processActions" )
		.error(panel, function(inSender, inResponse){
		 	if(inSender.xhrResponse.status == 0){
		 		alert("Connection Lost");
				panel.doLost();
		 	}
			panel.$.Msg.setContent("Error to load recent activities!!!");
            panel.$.Spin.hide();
        });

	},

	/*
		this function is triggered when the ajax on create function receive a response 
	*/
	processActions: function( request, response){			
		if(response.total == 0){				
			this.$.list.applyStyle("display", "none !important");
			this.reflow();
			this.$.Spin.hide();
			this.$.Msg.setContent("No current Services in the list!");
			return; 
		}
			response.elements = fixArrayInformation(response.elements);
			listSize = response.elements;
			this.$.list.setCount(listSize.length);
		    this.$.list.reset();
			this.$.Spin.hide();
	},

	/*
		this function occurs when a item on the list of servicves is clicked and then go to the Service Detail screen.
	*/
	selectedService: function(sender, event){
		this.doClickService(results[event.index]);
	},

	/*
		this function occurs when the add service button(+) is clicked and goes to the Add Service screen
	*/
	newService: function(sender, event){
		this.doCreateService();
	},

	/*
		this function setup the content of the list and populate it.
	*/
	setupItem: function(sender, event){
		this.$.name.setContent(listSize[event.index].name);
	   	results.push(listSize[event.index]);
	   
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
	backMenu: function (sender, event){
		this.doBack();
	}
});
