/*
	This Kind represent the activity list page
*/
enyo.kind({ 
	name:"ActivityList",
	result: null,
	start:false,
	fit: true,
	activityName:"",
	listSize:null,	
	listenerList: [],	
	events: {
		onBack: "",
		onClose: "",
		onLost:"",
		onSelectedActivity: "",	
	},

	//create components of interface	
	components:[

		//top toolbar that contains Title and back button ***************************************************************
		{kind: "onyx.Toolbar", classes:"toolbar-style", name: "toolTop",components: [	
			{content: "Activity History"}, {fit: true} 
		]},
		
		 {name: "spinner",kind:"onyx.Spinner",classes: "onyx-light",style:" margin-top:100px;margin-left:45%"},
		 
		//the list of Activities ***************************************************************************************************
		{name: "list", kind: "List", fit: true, touch: true, onSetupItem: "setupItem", style:"height:93%", components:[
				{name: "item", style: "box-shadow: -4px 0px 9px #768BA7",  classes: "panels-sample-flickr-item enyo-border-box",  ontap: "itemTap", components:[
					{kind: "Image", name:"status", classes: "panels-sample-flickr-thumbnail" },
					{name: "activity", classes: "panels-sample-flickr-title"},
					{name: "icon2", kind: "onyx.IconButton",classes: "panels-sample-flickr-icon", src: "assets/next.png", ontap: "itemTap"}
				]},//end item

				//More activities button **************************************************************************************************
				{name: "more", style: "padding: 10px 0 10px 10px; margin:auto; border:1px solid rgb(200,200,200)",components: [
					{name:"buttonMore",kind: "onyx.Button", content: "More activities", classes: "button-style", ontap: "moreAct"},
					{name: "Spin",kind:"onyx.Spinner",classes: "onyx-light",style:"margin-left:45%"},
				]}//item item
			]}
		], //end components	

	/*
		this function create the back button if the screen is small and use the getRecentActivities
	*/
	constructor: function(args) {
		this.inherited(arguments);
		//Dependency Injection
		if(args.n3pheleClient){
				this.n3pheleClient = args.n3pheleClient;
		}
	},
	
	/*
		this function create the back button if the screen is small and use the getRecentActivities
	*/
	create: function(){	
		this.inherited(arguments);			
		this.$.spinner.show();
		
		listSize = 15;
		
		if (this.closePanel.isScreenNarrow()) {
			this.createComponent({kind: "onyx.Button", content: "Menu", classes:"button-style-left", ontap: "backMenu", container: this.$.toolTop}).render();		
		}
		
		this.getRecentActivities(this.uid);

		var self = this;
		var updateList = function(){
			self.getRecentActivities(self.uid);
		}
		
		//the authentication header
		this.n3pheleClient.uid = this.uid;
		
		this.n3pheleClient.addListener(this, updateList, serverAddress+"process" );			
	},

	/*
		this function get the 15 recent activities from the server using ajax.
	*/	
	getRecentActivities: function(uid){
		this.$.Spin.show();
		this.$.buttonMore.hide();

		var ajaxParams = {
			url: serverAddress+"process",
			headers:{ 'authorization' : "Basic "+ uid},
			method: "GET",
			contentType: "application/x-www-form-urlencoded",
			sync: false, 
		};
			
		var ajaxComponent = n3phele.ajaxFactory.create(ajaxParams); //connection parameters
		
		ajaxComponent
		.go({'summary' : true, 'start' : 0, 'end' : listSize})
		.response( this, "processRecentActivities" )
		.error( this, function(){ 
			alert("Connection Lost");
			this.doLost();
		})
		
		this.$.spinner.hide();
	},

	/*
		This function represent the response from the ajax call
	*/
	processRecentActivities: function(request, response){	
		if(response.total == 0){
			this.$.divider.setContent("Without recent activities!");
			this.$.list.applyStyle("display", "none !important");
			this.reflow();
			return;
		}
		
		response.elements = fixArrayInformation(response.elements);
		this.results = response.elements;
		this.$.list.setCount(this.results.length);
		this.$.Spin.hide();
		
		if(listSize == this.results.length)
		  	this.$.buttonMore.show();
		else if(listSize != this.results.length) 
			this.$.more.hide();
            
		this.$.list.reset();
		
		if(this.start)
			this.$.list.scrollToBottom();
        
        this.start = true;	
	},

	/*
		this function setup the content of the list and populate it.
	*/
	setupItem: function(inSender, inEvent){
	
		if(this.results == null ) 
			return;	
		
		var i = inEvent.index;			
		var item = this.results[i];

		//set the icon for each activity ****************************************
		if(item.state == "COMPLETE"){
			this.$.status.setSrc("assets/activities.png");			
		}
		else if(item.state == "CANCELLED"){
			this.$.status.setSrc("assets/cancelled.png");	
		}
		else if(item.state == "FAILED"){
			this.$.status.setSrc("assets/failed.png");			
		}else if(item.state =="BLOCKED"){  
			this.$.status.setSrc("assets/blocked.png");	
		}else{
			this.$.status.setSrc("assets/spinner2.gif");
		}				
		
		// if the scrren is small concat the name and description with "..." ************	  
		if ($(window).width() < 350){
			if(item.name.length < 23){
				this.activityName = item.name;
			}else {
				this.activityName = item.name.substr(0,20).concat("...");						
			}						
		} 
		else{  
			if(item.name.length < 70){
				this.activityName = item.name;
			}else{
				this.activityName = item.name.substr(0,65).concat("...");
			}
		}  
			
		this.$.activity.setContent(this.activityName);
		
		//set each line with a color ("Zebra style") ****************************************	  
		if( i % 2 == 1){
			this.$.item.applyStyle("background-color", "#F7F7F7")
		 };
		if( i % 2 == 0){
			this.$.item.applyStyle("background-color", "white")
		};
		
		this.$.more.canGenerate = !this.results[i+1];		
				
		
		var self_2 = this;
		var updateList2 = function() { 
			self_2.getRecentActivities(self_2.uid);				
		}		
			
		 for(var i = 0; i < this.results.length; i++){
				var check = true;
				if(this.listenerList.length == 0){
					for(var a = 0; a< this.results.length;a++){
						if(this.results[a].state == "RUNABLE"){		
							this.n3pheleClient.addListener(this, updateList2, this.results[a].uri);
							this.listenerList.push(this.results[a]);
						}	
					}
				}
				for(var j = 0; j < this.listenerList.length; j++){
					if(this.listenerList[j].uri == this.results[i].uri){					
						check = false;
					}								
				}
				if(check == true){
					if(this.results[i].state == "RUNABLE"){	
						this.n3pheleClient.addListener(this, updateList2, this.results[i].uri);
						this.listenerList.push(this.results[i]);
					}	
				}
		} 			
		
		var v = new Array();
		var differenteItem = null;		
		var difference = function(vet1, vet2){			
			var count = 0;
			var find = false;
			for(var i = 0; i < vet1.length; i++){
				find = true;
				for(var j = 0; j < vet2.length; j++){
					if(vet1[i].uri == vet2[j].uri){
						find = false;
						break;						
					}					
				}
				if(find == true){
					v[count] = vet1[i].uri;
					count++;							 
				}
			}				
			return v;
		} 	
		differenteItem = difference(this.listenerList, this.results);
		
		for(var i = 0; i < differenteItem.length ; i++){
			this.n3pheleClient.removeListenerForItem(this, differenteItem[i]);				
		}  
	},
	
	
	destroy: function() {                
		// do inherited teardown
		this.inherited(arguments);
		this.n3pheleClient.removeListener(this);
	},

	/*
		this function back to the menu page
	*/			
	backMenu: function (sender, event){
		this.doBack();
	},

	/*
		this function occurs when a item on the list of activities is clicked and then go to the Activity screen.
	*/
	itemTap: function( sender, event){
		this.doSelectedActivity(this.results[event.index]);
	},

	/*
		this function occurs when the more activities button is pressed 
	*/
	moreAct:function() {
       	listSize = listSize+5;
       	this.getRecentActivities(this.uid);
	}

});