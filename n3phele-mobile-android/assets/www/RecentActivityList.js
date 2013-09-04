var size=2;
enyo.kind({ 
	name:"RecentActivityList",
	result: null,
	events: {
		onClick:"",
	},
	
	components:[
		{name:"topToolbar",kind: "onyx.Toolbar",classes: "toolbar-style",style:"padding:0;margin-top:-15px",components:[ {content: "Recent Activities", name:"divider"},{fit: true}]}, 
		{name:"line",classes:"list-divider"},
		{name: "list", kind: "List", classes:"enyo-unselectable",  draggable:false, fit:true,touch:true,touchOverscroll:false, onSetupItem: "setupItem", count: 1, style: "background-color:#fff;height:"+(60*size)+"px", components:[
			{name: "item", style: "box-shadow: -4px 0px 9px #768BA7",  classes: "panels-sample-flickr-item enyo-border-box",  ontap: "itemTap", components:[
			{kind: "Image", name:"status", classes: "panels-sample-flickr-thumbnail" },
					{name: "activity", classes: "panels-sample-flickr-title"},
					{name: "icon2", kind: "onyx.IconButton",classes: "panels-sample-flickr-icon", src: "assets/next.png", ontap: "itemTap"}
				]}//end item
			]},
	], //end components	

	/*
		this function hide the toolbar if the screen is small or hide the line if screen is "big"
	*/
	create: function(){
		this.inherited(arguments);

		if (enyo.Panels.isScreenNarrow() && (document.width < 400)){
			this.$.topToolbar.hide();
		}
		else {
			this.$.line.hide();
		}
		size = 2;

		this.getRecentActivities(this.uid);

	},

	/*
		this function get the 2 recent activities from the server using ajax.
	*/
	getRecentActivities: function( uid ){
		
		var ajaxParams = {
			url: serverAddress+"process",
			headers:{ 'authorization' : "Basic "+ uid},
			method: "GET",
			contentType: "application/x-www-form-urlencoded",
			sync: false, 
		};
			
		var ajaxComponent = n3phele.ajaxFactory.create(ajaxParams); //connection parameters

		ajaxComponent.go({'summary' : true, 'start' : 0, 'end' : size})
		.response( this, "processRecentActivities" )
		.error( this, function(){ console.log("Error to load recent activities!!"); });
		
	},

	/*
		This function represent the response from the ajax call
	*/
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
		
		this.render();
		this.reflow();
	
	},
	
	/*
		this function setup the content of the list and populate it.
	*/
	setupItem: function(inSender, inEvent){
		
		if(this.results == null )
			return;
		
		this.$.item.addRemoveClass("onyx-selected", inSender.isSelected(inEvent.index));
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
		}
		else if(item.state =="BLOCKED"){  
			this.$.status.setSrc("assets/blocked.png");					
		}
		else{
			this.$.status.setSrc("assets/spinner2.gif");
		}	
		
		this.$.activity.setContent(item.name);
	},

	/*
		this function occurs when a item on the list of activities is clicked and then go to the Activity screen.
	*/
	itemTap: function( sender, event){
		if(this.results == null ) 
			return;
		
		var main = sender.owner.parent.owner;
		var activityInfo = new Object();
		activityInfo.panels = main.$.panels;
		activityInfo.menulist = true;
		activityInfo.url = this.results[event.index].uri;
		activityInfo.uid = this.uid;
		
		this.doClick(activityInfo);	
	},
});