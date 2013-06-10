var size = 3;

enyo.kind({ 
		name:"RecentActivityList",
		result: null,
		components:[
			{kind: "onyx.Toolbar",classes: "toolbar-style",style:"padding:0;margin-top:-15px",components:[ {content: "Recent Activities", name:"divider"},{fit: true}]}, 
			{name: "list", kind: "List", fit: true, touch: true, onSetupItem: "setupItem", count: 1, style: "height:"+(60*size)+"px", components:[
				{name: "item", style: "box-shadow: -4px 0px 9px #768BA7",  classes: "panels-sample-flickr-item enyo-border-box",  ontap: "itemTap", components:[
					{kind: "Image", name:"status", classes: "panels-sample-flickr-thumbnail" },
					{name: "activity", classes: "panels-sample-flickr-title"},
					{name: "icon2", kind: "onyx.IconButton",classes: "panels-sample-flickr-icon", src: "assets/next.png", ontap: "itemTap"}
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
			.go({'summary' : true, 'start' : 0, 'end' : size})
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
			this.getRecentActivities(this.uid);
		},
		itemTap: function( sender, event){
			if(this.results == null ) return;
			var main = sender.owner.parent.owner;
			var panels = main.$.panels;
            var menulist = true;
			//main.closeSecondaryPanels(2);

			if (enyo.Panels.isScreenNarrow()){
				panels.setIndex(1);
			}
			
			panels.owner.$.imageIconPanel.destroyClientControls();
			main.createComponent({name:"Activity",kind: "RecentActivityPanel", 'url': this.results[event.index].uri, 'uid': this.uid,"panels":panels, "menulist":menulist ,container: main.$.imageIconPanel, 
			n3pheleClient: n3phele}); //n3phele variable is currently a global one defined on index.html.
		
			panels.owner.$.imageIconPanel.render();
		},
});
