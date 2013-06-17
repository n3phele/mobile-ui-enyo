enyo.kind({ 
		name:"RecentActivityPanel",
		kind: "FittableRows",
		fit: true,
		a:"", 		
		events: {
		onBack: "",
		},
		components:[
			{name: "topToolbar", classes:"toolbar-style", kind: "onyx.Toolbar", components: [	
				{content: "Activity", style:"padding-right:15px"}, 
				{fit: true}, 
				{name:"backbtn",kind: "onyx.Button", content: "Activity History", classes:"button-style-left", ontap: "backMenu"} 
			]},		
				{name:"b",style:"background:#fff;padding:10px", components:[
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
			{kind: "enyo.Scroller", fit: true, style:"background:#FFF",components: [  
				{name: "panel_three", classes: "panels-sample-sliding-content", style:"padding-top:0px !important", components:[					
					{name: "narratives"},
					{tag:"table border=0 cellspacing=0",name:"table",  components:[]}						
				]},
			]}			
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
			console.log(this.url);
				   if (this.menulist == true) 
			{      if (!enyo.Panels.isScreenNarrow())
			         {
				      this.$.backbtn.hide();
			              }
		     		
					this.$.backbtn.setContent("Menu");
					

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
				
				if(response.state === "FAILED" ){
					thisPanel.$.acStatus.setSrc("assets/failed.png");
				}else if(response.state === "COMPLETE"){
					thisPanel.$.acStatus.setSrc("assets/activities.png");
				}	
					
				if (enyo.Panels.isScreenNarrow()) {
					thisPanel.$.acStatus.setStyle("float:right;padding-top:10px");
				}	
				
				thisPanel.$.acName.setContent(" "+response.name);				
				thisPanel.$.acComDesc.setContent(" "+response.description);
				
				var d1 = new Date(response.start);
				var d2 = new Date(response.complete);
				
				thisPanel.$.acStart.setContent(" "+d1.getFullYear()+"-"+(d1.getMonth()+1)+"-"+d1.getDate()+" "+d1.getHours()+":"+d1.getMinutes());
				
				var duration = "still running";
				if(response.complete)
				{
					thisPanel.$.acComplete.setContent(" "+d2.getFullYear()+"-"+(d2.getMonth()+1)+"-"+d2.getDate()+" "+d2.getHours()+":"+d2.getMinutes());
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
					var stamp = new Date(narrative[i].stamp);	
					if(i% 2 == 1){	
						this.createComponent({tag:"tr", container:this.$.table, components:[	
							{tag:"td",  fit: true, style:"width:3%;border-bottom:2px solid rgb(200,200,200);white-space: normal;text-align:center;background-color:#F7F7F7", components:[{kind:"Image",src:this.a}]},						
							{tag:"td", style:"width:5%;border-bottom:2px solid rgb(200,200,200);border-left:outset #E0E0E3;white-space: normal;padding-left:5px;background-color:#F7F7F7", content: "   "+stamp.getHours()+":"+stamp.getMinutes()+"   "},						
							{tag:"td", style:"width:5%;border-bottom:2px solid rgb(200,200,200);border-left:outset #E0E0E3;white-space: normal;padding-left:5px;background-color:#F7F7F7", content : " "+narrative[i].tag+":"},						
							{tag:"td", style:"width:1500px;font-weight: bold;border-bottom:2px solid rgb(200,200,200);border-left:outset #E0E0E3;white-space: normal;padding:8px 0 8px 5px;background-color:#F7F7F7", content : " "+narrative[i].text}							
						]}),						
						this.render();
					}else if(i% 2 == 0){
						this.createComponent({tag:"tr", container:this.$.table, components:[	
							{tag:"td",  fit: true, style:"width:3%;border-bottom:2px solid rgb(200,200,200);white-space: normal;text-align:center", components:[{kind:"Image",src:this.a}]},						
							{tag:"td", style:"width:5%;border-bottom:2px solid rgb(200,200,200);border-left:outset #E0E0E3;white-space: normal;padding-left:5px", content: "   "+stamp.getHours()+":"+stamp.getMinutes()+"   "},						
							{tag:"td", style:"width:5%;border-bottom:2px solid rgb(200,200,200);border-left:outset #E0E0E3;white-space: normal;padding-left:5px", content : " "+narrative[i].tag+":"},						
							{tag:"td", style:"width:1500px;font-weight: bold;border-bottom:2px solid rgb(200,200,200);border-left:outset #E0E0E3;white-space: normal;padding:8px 0 8px 5px", content : " "+narrative[i].text}							
						]}),						
						this.render();
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