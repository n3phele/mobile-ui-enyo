var listSize = 15;
enyo.kind({ 
		name:"ActivityList",
		result: null,
		fit: true,
		events: {
		onBack: "",
		onClose: "",
		onSelectedActivity: ""
		},
		components:[
			{kind: "onyx.Toolbar", classes:"toolbar-style", name: "toolTop",components: [	{content: "Activity History"}, {fit: true} ]},
			{name: "list", kind: "List", fit: true, touch: true, onSetupItem: "setupItem", style:"height:93%", components:[
				{name: "item", style: "padding: 10px 0 10px 10px; margin:auto; border:1px solid rgb(200,200,200)",  ontap: "itemTap", components:[
					{ style:"margin: 2px; display:inline-block", components: [ 
						{tag:"img", name:"status", style:"width: 65%;", src: "assets/activities.png" } 
					]},
					{ name: "activity", style: "display:inline-block"},
					{name: "icon2", kind: "onyx.IconButton",style:"float:right",src: "assets/next.png", ontap: "itemTap"}
				]},
				{name: "more", style: "padding: 10px 0 10px 10px; margin:auto; border:1px solid rgb(200,200,200)",components: [
					{kind: "onyx.Button", content: "More activities", classes: "button-style", ontap: "moreAct"},
				]}//item item
			]}
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
			.go({'summary' : true, 'start' : 0, 'end' : listSize})
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
			var i = inEvent.index;
			var item = this.results[i];

			if(item.state == "COMPLETE"){
				this.$.status.setSrc("assets/activities.png");
			}else if(item.state == "FAILED"){
				this.$.status.setSrc("assets/failed.png");
			}
			this.$.activity.setContent(item.name);
			  
			 if( i % 2 == 1)
	   {
	   this.$.item.applyStyle("background-color", "#F7F7F7")
	   };
         if( i % 2 == 0)
	   {
	   this.$.item.applyStyle("background-color", "white")
	   };
	   this.$.more.canGenerate = !this.results[i+1];
			
		},
		create: function(){
			this.inherited(arguments);
			var thisPanel = this;

			if (this.closePanel.isScreenNarrow()) {
				this.createComponent({kind: "onyx.Button", content: "Menu", classes:"button-style-left", ontap: "backMenu", container: this.$.toolTop}).render();		
			}
			this.getRecentActivities(this.uid);
		},
		backMenu: function (sender, event){
			this.doBack();
		},
		closePanel: function (sender, event){
			this.doClose();
		},
		itemTap: function( sender, event){
			this.doSelectedActivity(this.results[event.index]);
		},
		moreAct:function() {
       	 listSize = listSize+5;
       	 this.getRecentActivities(this.uid);
         this.$.list.reset();
         this.$.list.scrollToBottom();
		 scroolToBottom();
		 this.render();
         this.reflow();
    	}
});