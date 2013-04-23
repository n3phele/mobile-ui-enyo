var listSize = 3;
enyo.kind({ 
		name:"RecentActivityList",
		result: null,
		components:[
			{classes: "onyx-sample-divider", content: "Recent Activities", style: "color: #375d8c", name:"divider"},
			{name: "list", kind: "List", fit: true, touch: true, onSetupItem: "setupItem", count: 1, style: "height:"+(55*listSize)+"px", components:[
				{name: "item", style: "padding: 10px; box-shadow: -4px 0px 4px rgba(0,0,0,0.3);",  classes: "panels-sample-flickr-item enyo-border-box",  ontap: "itemTap", components:[
					{ style:"margin: 2px; display:inline-block", components: [ {tag:"img", style:"width: 70%;", src: "assets/activities.png" }, ]},
					{ name: "activity", style: "display:inline-block"},
				]}//end item
			]},
		], //end components	
		getRecentActivities: function( uid ){
			var ajaxParams = {
				url: serverAddress+"process",
				headers:{ 'authorization' : "Basic "+ uid},
				method: "GET",
				contentType: "application/x-www-form-urlencoded",
				sync: false, 
			};
			
			var ajaxComponent = new enyo.Ajax(ajaxParams); //connection parameters
			
			ajaxComponent
			.go({'summary' : true, 'start' : 0, 'end' : listSize-1})
			.response( this, "processRecentActivities" )
			.error( this, function(){ console.log("Error to load recent activities!!"); });
		},
		processRecentActivities: function( request, response){
			if(response.total == 0){
				this.$.divider.setContent("Without recent activities!");
				this.$.list.applyStyle("display", "none !important");
				this.reflow();
				return;
			}
			response.elements = fixArrayInformation(response.elements);
			this.results = response.elements;
			this.$.list.setCount(this.results.length);
			this.$.list.reset();
		},
		setupItem: function(inSender, inEvent){
			if(this.results == null ) return;
			this.$.item.addRemoveClass("onyx-selected", inSender.isSelected(inEvent.index));
			var i = inEvent.index;
			var item = this.results[i];
			this.$.activity.setContent(item.name);
		},
/**		rendered: function() {
			this.inherited(arguments);
			this.getRecentActivities(this.uid);
		},**/
		create: function(){
			this.inherited(arguments);
			this.getRecentActivities(this.uid);
		},
		itemTap: function( sender, event){
			if(this.results == null ) return;
			var main = sender.owner.parent.owner;
			var panels = main.$.panels;

			main.closeSecondaryPanels(2);

			if (enyo.Panels.isScreenNarrow()){
				panels.setIndex(1);
			}
			
			panels.owner.$.imageIconPanel.destroyClientControls();
			main.createComponent({kind: "RecentActivityPanel", 'url': this.results[event.index].uri, 'uid': this.uid, container: main.$.imageIconPanel});
		
			panels.owner.$.imageIconPanel.render();
		},
});

enyo.kind({ 
		name:"RecentActivityPanel",
		kind: "FittableRows",
		fit: true,
		components:[
			{name: "topToolbar",kind: "onyx.Toolbar", components: [	{content: "Activity"}, {fit: true} ]},
			{kind: "enyo.Scroller", fit: true, components: [
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
					{tag: "span", content: "Duration(in minutes): ", style:"font-variant:small-caps;"}, //seconds
					{name: "acDuration", style:"display: inline-block"},
					{tag: "br"},
					{name: "divider", classes: "list-divider"},
					{tag: "br"},
					{tag: "span", content: "Log: ", style:"font-variant:small-caps;"},
					{name: "narratives"}
				]}
			]},
			{kind: "onyx.Toolbar", components: [ {kind: "onyx.Button", content: "Close", ontap: "backMenu"} ]}
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
			
			//If not injected, create a default implementation
			if(!this.n3pheleClient)
			{
				this.n3pheleClient = new N3pheleClient();
			}
			//the authentication header
			this.n3pheleClient.uid = this.uid;
				
			var thisPanel = this;
			var success = function (response) {		
				thisPanel.$.acName.setContent(" "+response.name);
				thisPanel.$.acStatus.setContent(" "+response.state );
				thisPanel.$.acComDesc.setContent(" "+response.description);
				
				var d1 = new Date(response.start);
				thisPanel.lastUpdate = d1.getTime();
				
				var d2 = new Date(response.complete);
				
				if(d2) thisPanel.lastUpdate = d2.getTime();
				
				thisPanel.$.acStart.setContent(" "+d1.getFullYear()+"-"+(d1.getMonth()+1)+"-"+d1.getDate()+" "+d1.getHours()+":"+d1.getMinutes());
				thisPanel.$.acComplete.setContent(" "+d2.getFullYear()+"-"+(d2.getMonth()+1)+"-"+d2.getDate()+" "+d2.getHours()+":"+d2.getMinutes());
				
				thisPanel.$.acDuration.setContent(" "+((d2-d1)/60000));
				
				
				var narrative = fixArrayInformation(response.narrative);
				
				if(narrative && narrative.length > 0)
				{
					
					var stampDate = new Date(narrative[narrative.length-1].stamp);
					thisPanel.lastUpdate = stampDate.getTime();					
				}
				
				thisPanel.updateNarrative(narrative, thisPanel.$.narratives);
				
				thisPanel.reflow();
			}
			
			var error = function(){ console.log("Error to load recent activities!!"); };
			
			this.n3pheleClient.listActivityDetail(this.url, 0, 10, success, error);
			
			//When called update screen
			var changesSuccess = function() { thisPanel.n3pheleClient.listActivityDetail(thisPanel.url, 0, 10, success, error); }
			
			var repeater = function() {
				//see if new changes occured
				thisPanel.n3pheleClient.getChangesSince(thisPanel.lastUpdate, thisPanel.url, changesSuccess);
			}
			
			//register update event here with setInterval
			this.interval = window.setInterval( repeater, 5000);
		},
		destroy: function() {
			// do inherited teardown
			this.inherited(arguments);
			
			window.clearInterval(this.interval);
		},
		//Update the narrative content to the specified panel (reset content)
		updateNarrative: function(narrative, panel){
			//clear panel_three
			panel.destroyClientControls();			
						
			//fill it up with received data
			for( var i in narrative ){
					panel.createComponent({tag: "br"});
					var stamp = new Date(narrative[i].stamp);
					if(narrative[i].state=="info"){
					panel.createComponent({kind:"Image", src:"assets/info.png", fit: true, style:"display: inline-block;"});
				}
					panel.createComponent({style:"display: inline-block;", content: "  [ "+stamp.getFullYear()+"-"+(stamp.getMonth()+1)+"-"+stamp.getDate()+" "+stamp.getHours()+":"+stamp.getMinutes()+" ]  "});
					panel.createComponent({style:"display: inline-block;", content : " "+narrative[i].tag+" : "});
					panel.createComponent({style:"display: inline-block;font-weight: bold;", content : " "+narrative[i].text});
					panel.createComponent({tag: "br"});
				}				
			panel.render();
		},
		backMenu: function( sender , event){
			var panel = sender.parent.parent.parent;
			
			panel.setIndex(2);				
			panel.getActive().destroy();					
			panel.panelCreated = false;
			
			if (enyo.Panels.isScreenNarrow()) {
				panel.setIndex(1);
			}
			else {
				panel.setIndex(0);
			}		
			
			panel.reflow();		
		}
});