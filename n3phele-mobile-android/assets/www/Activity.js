enyo.kind({ 
		name:"RecentActivityPanel",		
		layoutKind: "FittableRowsLayout",
		fit: true,
		style:"background-color:#fff",
		a:"", 		
		events: {
		onBack: "",
		},
		components:[
			{name: "topToolbar", classes:"toolbar-style", kind: "onyx.Toolbar", components: [	
				{content: "Activity", style:"padding-right:15px"}, 
				//fit: true}, 
				{name:"backbtn",kind: "onyx.Button", content: "Activity History", classes:"button-style-left", ontap: "backMenu"} 
			]},		
				{name:"base",style:"background:#fff;padding:10px 10px 0 10px", components:[
					{tag: "span", content: "Name: ", style:"font-variant:small-caps;"}, 
					{name: "acName", style:"font-weight: bold; display: inline-block"},
					{tag: "br"},
					{tag: "span", content: "Command: ", style:"font-variant:small-caps;"}, 
					{name: "acComDesc", style:"display: inline-block"},
					{kind:"Image", src:this.a, name: "acStatus", style:"float:right;padding:10px 50px 0 0"},
					{tag : "br"},
					{tag: "span", content: "Started: ", style:"font-variant:small-caps;"}, 					
					{name: "acStart", style:"display: inline-block"},					
					{tag : "br"},
					{tag: "span", content: "Completed: ", style:"font-variant:small-caps;"}, 
					{name: "acComplete", style:"display: inline-block"},
					{tag: "br"},
					{tag: "span", content: "Duration: ", style:"font-variant:small-caps;"}, //seconds
					{name: "acDuration", style:"display: inline-block"},
					{tag: "br"},
					{name: "divider", classes: "list-divider"}					
				]},
		{kind: "enyo.Scroller",style:"background:#fff", classes:"keyframe", fit: true, components: [	
			{name: "panel_three", fit:true, style:"background:#FFF", components:[	
				{name: "narratives"}				
			]},			
		]},	
		],
		constructor: function(args) {
			this.inherited(arguments);
		
			//Dependency Injection
			if(args.n3pheleClient)
			{
				this.n3pheleClient = args.n3pheleClient;
			}
		},
		create: function() {
			this.inherited(arguments);
			console.log(this);
				   if (this.menulist == true) 
			{      if (!enyo.Panels.isScreenNarrow())
			         {
				      this.$.backbtn.hide();
			              }
		     		
					this.$.backbtn.setContent("Menu");
					

			}
			else if (this.num == 0)
			{
			this.$.backbtn.setContent("Commands");
			}
			
			//If not injected, create a default implementation
			if(!this.n3pheleClient)
			{
				this.n3pheleClient = new N3pheleClient();
			}
			//the authentication header
			this.n3pheleClient.uid = this.uid;
				
			var thisPanel = this;
			this.lastUpdate = 0;
			var success = function (response) {		
				
				if(response.state == "CANCELLED" ){
					thisPanel.$.acStatus.setSrc("assets/cancelled.png");	
				}else if(response.state == "FAILED"){
					thisPanel.$.acStatus.setSrc("assets/failed.png");
				}else if(response.state == "COMPLETE"){
					thisPanel.$.acStatus.setSrc("assets/activities.png");
				}else if(response.state =="BLOCKED"){  
					thisPanel.$.acStatus.setSrc("assets/blocked.png");					
				}else{
					thisPanel.$.acStatus.setSrc("assets/spinner2.gif");
				}	
					
				if (enyo.Panels.isScreenNarrow()) {
					thisPanel.$.acStatus.setStyle("float:right;padding-top:10px");
				}					
				thisPanel.$.acName.setContent(" "+response.name);				
				thisPanel.$.acComDesc.setContent(" "+response.description);
				var minstart = 0;
				var mincomplete = 0;
				var d1 = new Date(response.start);
				var d2 = new Date(response.complete);
				
				
					if(d1.getMinutes()<10)  minstart = "0" + d1.getMinutes();
					else minstart = d1.getMinutes();
				
				
				thisPanel.$.acStart.setContent(" "+d1.getFullYear()+"-"+(d1.getMonth()+1)+"-"+d1.getDate()+" "+d1.getHours()+":"+minstart);
				
				var duration = "still running";
				if(response.complete)
				{   
				  	if(d2.getMinutes()<10)  mincomplete = "0" + d2.getMinutes();
					else mincomplete = d2.getMinutes();
				
					thisPanel.$.acComplete.setContent(" "+d2.getFullYear()+"-"+(d2.getMonth()+1)+"-"+d2.getDate()+" "+d2.getHours()+":"+mincomplete);
					duration = (Math.round(((d2-d1)/60000)*100)/100);
					
					if(duration < 1){
						duration = (Math.round(((d2-d1)/1000)*100)/100)+" seconds";
					}else{
						duration = duration + " minutes";
					}
				}
				
				thisPanel.$.acDuration.setContent(" " + duration); 
								
				var narrative = fixArrayInformation(response.narrative);
				
				thisPanel.updateNarrative(narrative, thisPanel.$.narratives);
				
				thisPanel.reflow();
			}
			
			var error = function(){ console.log("Error to load recent activities!!"); };
			
			this.n3pheleClient.listActivityDetail(this.url, 0, 10, success, error);
			
			//When called update screen
			var changesSuccess = function() { thisPanel.n3pheleClient.listActivityDetail(thisPanel.url, 0, 10, success, error); }
			
			this.n3pheleClient.addListener(this, changesSuccess, this.url);
		},
		destroy: function() {
			// do inherited teardown
			this.inherited(arguments);
			
			this.n3pheleClient.removeListener(this);
		},
		//Update the narrative content to the specified panel (reset content)
		updateNarrative: function(narrative, panel){
			//clear panel_three
			panel.destroyClientControls();	
			
			//fill it up with received data				
			if( narrative !== undefined && narrative.length > 0)
			{
				for( var i in narrative ){					  
						if(narrative[i].state=="info"){
							this.a = ("assets/info.png");
						}else if(narrative[i].state=="error"){
							this.a = "assets/narrative-error.png";
						}else if(narrative[i].state=="warning"){
							this.a = "assets/narrative-warning.png";
						}
					var minutes = 0;	
					var stamp = new Date(narrative[i].stamp);
					if(stamp.getMinutes()<10)  minutes = "0" + stamp.getMinutes();
					else minutes = stamp.getMinutes();
				
					if(i% 2 == 1){							
							panel.createComponent({style:"background-color:#F7F7F7;border:1px solid rgb(200,200,200)", components:[{ classes:"image", kind:"Image" , style:"background-color:#F7F7F7", src:this.a} , { classes:"dateTime", content:"   "+stamp.getFullYear()+"-"+(stamp.getMonth()+1)+"-"+stamp.getDate()+" "+stamp.getHours()+":"+minutes+"   ",style:"background-color:#F7F7F7"},{ classes:"content", content : " "+narrative[i].text,style:"background-color:#F7F7F7"}]})
					}
					else if(i% 2 == 0){					
							panel.createComponent({style:"background-color:white;border:1px solid rgb(200,200,200)", components:[{ classes:"image", kind:"Image" ,style:"background-color:white", src:this.a} , { classes:"dateTime", content:"   "+stamp.getFullYear()+"-"+(stamp.getMonth()+1)+"-"+stamp.getDate()+" "+stamp.getHours()+":"+minutes+"   ",style:"background-color:white"},{ classes:"content", content : " "+narrative[i].text,style:"background-color:white"}]})
					}					
				}
			}				
			panel.render();
		},
		backMenu: function( sender , event){
			
		  if (this.menulist == true) 
			{     
					this.panels.setIndex(0);

			}
		  else  
              {		  this.doBack(); }
		}
});