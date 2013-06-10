var porco;
enyo.kind({ 
		name:"RecentActivityPanel",
		kind: "FittableRows",
		fit: true,
		events: {
		onBack: "",
		},
		components:[
			{name: "topToolbar", classes:"toolbar-style", kind: "onyx.Toolbar", components: [	{content: "Activity", style:"padding-right:15px"}, {fit: true}, {name:"backbtn",kind: "onyx.Button", content: "Activity History", classes:"button-style-left", ontap: "backMenu"} ]},
			{kind: "enyo.Scroller", fit: true, style:"background:#FFF",components: [
				{name: "panel_three", classes: "panels-sample-sliding-content", allowHtml: true, fit:true, components:[
					{tag: "span", content: "Name: ", style:"font-variant:small-caps;"}, {name: "acName", style:"font-weight: bold; display: inline-block"},
					{tag: "br"},
					{tag: "span", content: "Status: ", style:"font-variant:small-caps;"}, {name: "acStatus", style:"display: inline-block"},
					{tag: "br"},
					{tag: "span", content: "Command: ", style:"font-variant:small-caps;"}, 
					{name: "acComDesc", style:"display: inline-block"},
					{tag: "br"},
					{tag: "span", content: "Started: ", style:"font-variant:small-caps;"}, 
					{name: "acStart", style:"display: inline-block"},
					{tag : "br"},
					{tag: "span", content: "Completed: ", style:"font-variant:small-caps;"}, 
					{name: "acComplete", style:"display: inline-block"},
					{tag: "br"},
					{tag: "span", content: "Duration: ", style:"font-variant:small-caps;"}, //seconds
					{name: "acDuration", style:"display: inline-block"},
					{tag: "br"},
					{name: "divider", classes: "list-divider"},
					{tag: "br"},
					{name: "narratives"}
				]}
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
			
				thisPanel.$.acName.setContent(" "+response.name);
				thisPanel.$.acStatus.setContent(" "+response.state );
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
					panel.createComponent({tag: "br"});
					var stamp = new Date(narrative[i].stamp);
					if(narrative[i].state=="info"){
					panel.createComponent({kind:"Image", src:"assets/info.png", fit: true, style:"display: inline-block;"});
					}else if(narrative[i].state=="error"){
					panel.createComponent({kind:"Image", src:"assets/narrative-error.png", fit: true, style:"display: inline-block;"});
					}else if(narrative[i].state=="warning"){
					panel.createComponent({kind:"Image", src:"assets/narrative-warning.png", fit: true, style:"display: inline-block;"});
					}
					panel.createComponent({style:"display: inline-block;", content: "  [ "+stamp.getFullYear()+"-"+(stamp.getMonth()+1)+"-"+stamp.getDate()+" "+stamp.getHours()+":"+stamp.getMinutes()+" ]  "});
					panel.createComponent({style:"display: inline-block;", content : " "+narrative[i].tag+" : "});
					panel.createComponent({style:"display: inline-block;font-weight: bold;", content : " "+narrative[i].text});
					panel.createComponent({tag: "br"});
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