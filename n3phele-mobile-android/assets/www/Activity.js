/*
	This Kind represent the screen of activity detail, that contains informations of a selected activity
*/
var actionURL;
enyo.kind({ 
	name:"RecentActivityPanel",		
	layoutKind: "FittableRowsLayout",
	fit: true,
	canceled:null,
	style:"background-color:#fff",
	icon:"",
	activityName:"",
	activityDesc:"",	
	events: {
		onBack: "",//this fuction occurs when the user clicked back button (goes to the activity list)
		onBackMenu:"",//this fuction occurs when the user clicked on back button (goes to the menu)
		onRerun: "",//this fuction occurs when the user clicked on account name link
		onCancel:"",//this fuction occurs when the user clicked on cancel activity button
	}, 

	//create components of interface
	components:[

		//Top toolbar that contains Title, cancel button and back button ***************************************************************
		{name: "topToolbar", classes:"toolbar-style", kind: "onyx.Toolbar", components: [	
			{content: "Activity", style:"padding-right:15px"}, 
			{name:"cancel",kind: "onyx.Button", content: "Cancel", classes: "button-style-right",style:"background-image:-webkit-linear-gradient(top,#B5404A 50%,#9E0919 77%) !important" , ontap: "cancelActivity"},
			{name:"backbtn",kind: "onyx.Button", content: "Activity History", classes:"button-style-left", ontap: "back"} 
		]},		
		
		//Show the Activity Name, cloud name, time and duration and status on the top***************************************************************
		{name:"base",style:"background:#fff;padding:10px 10px 0 10px", components:[
			{tag: "span", content: "Name: ", style:"font-weight: normal"}, 
			{name: "acName",classes: "activityName"},
			{tag: "br"},
			{tag: "span", content: "Running: ", style:"font-weight: normal"}, 
			{name: "acComDesc",classes: "running", style: " text-decoration: underline;", ontap: "getAction"},
			{kind:"Image", src:this.icon, name: "acStatus", classes:"status"},
			{tag : "br"},
			{tag: "span", content: "Started: ", style:"font-weight: normal"}, 					
			{name: "acStart",classes: "started"},					
			{tag : "br"},
			{tag: "span", content: "Completed: ", style:"font-weight: normal"}, 
			{name: "acComplete",classes: "completed"},
			{tag: "br"},
			{tag: "span", content: "Duration: ", style:"font-weight: normal"}, //seconds
			{name: "acDuration",classes: "duration"},
			{tag: "br"},
			{name: "divider", classes: "list-divider"}					
		]},
		
		{name: "Spin",kind:"onyx.Spinner",classes: "onyx-light",style:" margin-top:100px;margin-left:45%"},
		
		//Show the activity details of a coomand ***************************************************************
		{kind: "enyo.Scroller",style:"background:#fff", classes:"keyframe", fit: true, components: [	
			{name: "panel_three", fit:true, style:"background:#FFF", components:[	
				{name: "narratives"}				
			]},			
		]},	
	],

	constructor: function(args) {
		this.inherited(arguments);
		//Dependency Injection
		if(args.n3pheleClient){
				this.n3pheleClient = args.n3pheleClient;
		}
	},

	create: function() {
		
		this.inherited(arguments);
		this.$.cancel.hide();
		cancelled = false;
		
		this.$.Spin.show();
		
		if (this.menulist == true) {      
		    this.$.backbtn.setContent("Menu");
		}
		else if (this.num == 0){
			this.$.backbtn.setContent("Commands");
		}
		else if (this.num == 1){
			this.$.backbtn.setContent("Account Details");
		}
		
		//If not injected, create a default implementation
		if(!this.n3pheleClient){
				this.n3pheleClient = new N3pheleClient();
		}
		
		//the authentication header
		this.n3pheleClient.uid = this.uid;
				
		var thisPanel = this;		
		this.lastUpdate = 0;		
			
		var success = function (response) {			
			
			// set the icon according to the state				
			if(response.state == "CANCELLED" ){
				thisPanel.$.acStatus.setSrc("assets/cancelled.png");
				cancelled = true;				
			}
			else if(response.state == "FAILED"){
				thisPanel.$.acStatus.setSrc("assets/failed.png");
			}
			else if(response.state == "COMPLETE"){
				thisPanel.$.acStatus.setSrc("assets/activities.png");
				cancelled = true;	
			}
			else if(response.state =="BLOCKED"){  
				thisPanel.$.acStatus.setSrc("assets/blocked.png");			
			}else{
				thisPanel.$.acStatus.setSrc("assets/spinner2.gif");
			}	
			
			// if the scrren is small concat the name and description with "..."			
			if ($(window).width() < 350){
				
				if(response.name.length < 22){
					this.activityName = response.name;
				}
				else{
					this.activityName = response.name.substr(0,19).concat("...");						
				}						
							
				if (response.description.length < 23){							
					this.activityDesc = response.description;
				}else {							
					this.activityDesc = response.description.substr(0,22).concat("...");  
				}	
			} 
			else{  
				if(response.name.length < 70){
					this.activityName = response.name;
				}
				else{
					this.activityName = response.name.substr(0,65).concat("...");
				}	
						
				if(response.description.length < 70){
					this.activityDesc = response.description;
				}
				else{
					this.activityDesc = response.description.substr(0,66).concat("...");  
				}				
			} 
		
			//show the name and description on  the screen							
			thisPanel.$.acName.setContent(" "+this.activityName);				
			thisPanel.$.acComDesc.setContent(" "+this.activityDesc);
			actionURL = response.action;		
			
			// initialize the variables for manipulate dates
			var minstart = 0;
			var mincomplete = 0;
			var d1 = new Date(response.start);
			var d2 = new Date(response.complete);
							
			
			if(d1.getMinutes()<10)
				minstart = "0" + d1.getMinutes();
			else 
				minstart = d1.getMinutes();
					
			//show the start time on the screen		
			thisPanel.$.acStart.setContent(" "+d1.getFullYear()+"-"+(d1.getMonth()+1)+"-"+d1.getDate()+" "+d1.getHours()+":"+minstart);
					
			var duration = "still running";
			
			//if the activity is complete, the complete time is setted
			if(response.complete){   
				
				if(d2.getMinutes()<10)  mincomplete = "0" + d2.getMinutes();
				else mincomplete = d2.getMinutes();
					
				thisPanel.$.acComplete.setContent(" "+d2.getFullYear()+"-"+(d2.getMonth()+1)+"-"+d2.getDate()+" "+d2.getHours()+":"+mincomplete);
				duration = (Math.round(((d2-d1)/60000)*100)/100);
						
				if(duration < 1){
					duration = (Math.round(((d2-d1)/1000)*100)/100)+" seconds";
				}
				else{
					duration = duration + " minutes";
				}
			}
		
			//show the duration time on the screen	
			thisPanel.$.acDuration.setContent(" " + duration); 
								
			var narrative = fixArrayInformation(response.narrative);
						
			thisPanel.updateNarrative(narrative, thisPanel.$.narratives);
				
			thisPanel.reflow();			
		}		
		
		//if the response get a error
		var error = function(){ 
			console.log("Error to load recent activities!!"); 
		};
			
		this.n3pheleClient.listActivityDetail(this.url, success, error);
			
	    //When called update screen
		var changesSuccess = function() { 
			thisPanel.n3pheleClient.listActivityDetail(thisPanel.url, success, error);	
		}
	
		this.n3pheleClient.addListener(this, changesSuccess, this.url);	
		
		this.$.Spin.hide();		
	},

	destroy: function() {
		// do inherited teardown
		this.inherited(arguments);
		this.n3pheleClient.removeListener(this);	
	},
	
	/*
		Update the narrative content to the specified panel (reset content)
	*/
	updateNarrative: function(narrative, panel){
		//clear panel_three
		panel.destroyClientControls();	
			
		//fill it up with received data				
		if( narrative !== undefined && narrative.length > 0){
			for( var i in narrative ){					  
				if(narrative[i].state=="info"){
					this.icon = ("assets/info.png");
				}
				else if(narrative[i].state=="error"){
					this.icon = "assets/narrative-error.png";
				}
				else if(narrative[i].state=="warning"){
					this.icon = "assets/narrative-warning.png"; 
				}
				
				var minutes = 0;	
				var stamp = new Date(narrative[i].stamp);
				
				if(stamp.getMinutes()<10)  
					minutes = "0" + stamp.getMinutes();
				else 
					minutes = stamp.getMinutes();
				

				//set each line with a color ("Zebra style").
				if(i% 2 == 1){ 
					panel.createComponent({style:"background-color:#F7F7F7;border:1px solid rgb(200,200,200)", components:[
						{classes:"image", kind:"Image" , style:"background-color:#F7F7F7;float:left", src:this.icon},
						{classes:"dateTime", content:"   "+stamp.getFullYear()+"-"+(stamp.getMonth()+1)+"-"+stamp.getDate()+" "+stamp.getHours()+":"+minutes+"    " ,style:"background-color:#F7F7F7;float:left;padding-left:10px;display: inline-block"},
						{content:"   " + narrative[i].tag,style:"color:#0066cc;padding-left:10px;display: inline-block"},
						{classes:"content", content : " "+narrative[i].text,style:"background-color:#F7F7F7"}
					]})
				} 
				else if(i% 2 == 0){
					panel.createComponent({style:"background-color:white;border:1px solid rgb(200,200,200)", components:[
						{classes:"image", kind:"Image" ,style:"background-color:white;float:left", src:this.icon},
						{classes:"dateTime", content:"   "+stamp.getFullYear()+"-"+(stamp.getMonth()+1)+"-"+stamp.getDate()+" "+stamp.getHours()+":"+minutes+"   ",style:"background-color:white;float:left;;padding-left:10px;display: inline-block"},
						{content:"   " + narrative[i].tag,style:"color:#0066cc;padding-left:10px;display: inline-block"},
						{classes:"content", content : " "+narrative[i].text,style:"background-color:white"}
					]})
				}				
			}			
		}
           
        if(!cancelled){
		    this.$.cancel.show();
        }		   
		
		panel.render();
	},
	
	/*
		this function back to the activity list or to the menu, depending on which screen the user came
	*/
	back: function( sender , event){
		
		if (this.menulist == true && enyo.Panels.isScreenNarrow()){     
			this.panels.setIndex(0);
		}
		else if (this.menulist == true){
			this.doBackMenu();
        }
        else{
			this.doBack();
		}
	},

	/*
		Open the rerun screen when link on actives machine was pressed 
	*/
	getAction:function(sender,event){  
			var actionInfo = new Object();
			actionInfo.actionUrl = actionURL+"/history";
			actionInfo.backContent = "Activity";
			this.doRerun(actionInfo);			
	},

	/*
		Open the cancel screen to cancel a activity 
	*/   
	cancelActivity:function(sender,event){  	   
		  var acitivityInfo = new Object();
		  acitivityInfo.name = this.$.acName.getContent();
		  acitivityInfo.url = this.url
		  acitivityInfo.uid = this.uid;
		  this.doCancel(acitivityInfo); 
	}
});