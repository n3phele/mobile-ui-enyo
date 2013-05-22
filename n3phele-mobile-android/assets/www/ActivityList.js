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
			{name: "list", kind: "List", fit: true, touch: true, onSetupItem: "setupItem", count: 1, style:"height:95%; border-top: 2px solid #88B0F2", components:[
				{name: "item", style: "padding: 10px; box-shadow: -4px 0px 4px rgba(0,0,0,0.3);",  classes: "panels-sample-flickr-item enyo-border-box",  ontap: "itemTap", components:[
					{ style:"margin: 2px; display:inline-block", components: [ {tag:"img", name:"status", style:"width: 70%;", src: "assets/activities.png" } ]},
					{ name: "activity", style: "display:inline-block"},
					{name: "icon2", kind: "onyx.IconButton",style:"float:right",src: "assets/next.png", ontap: "nextItem"}
				]}//end item
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
			this.$.item.addRemoveClass("onyx-selected", inSender.isSelected(inEvent.index));
			var i = inEvent.index;
			var item = this.results[i];
			if(item.state == "COMPLETE"){
				this.$.status.setSrc("assets/activities.png");
			}else{
				this.$.status.setSrc("assets/failed.png");
			}
			this.$.activity.setContent(item.name);
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
		}

});