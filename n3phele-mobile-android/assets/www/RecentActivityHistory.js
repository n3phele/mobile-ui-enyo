enyo.kind({
	name: "RecentActivityHistory",
	kind: "FittableRows",
	style: "padding : 0px;width:100%;height:100%;",
	end : 9,
	lines: new Array(),
	components:[
	            {kind: "onyx.Toolbar", components: [	{content: "Activity History"}, {fit: true} ]},
	            {fit: true, touch: true, kind: "Scroller",components:[
	                  {classes: "onyx-sample-divider", content: "Tasks executed by user", style: "color: #375d8c;text-align:center", name:"divider"},
	                  {name: "commandList", kind: "List", fit: true, touch:true, count: 0 , classes:  "enyo-fit list-sample-list",style: "width: 50%;margin: auto;background-color: #eee; max-height:90%", ondown:"listUpdate", onSetupItem: "fillItems", components: [
	                        {name: "item", classes: "list-sample-item enyo-border-box", style:"border: 1px solid silver;padding: 18px;",ontap: "itemTap",components: [
                                 {name: "name"}
	                         ]}                                                                                              			                                                         			
	                  ]}
	             ]}
	],
	constructor: function(args) {
        // low-level or esoteric initialization, usually not needed at all
        this.inherited(arguments);
		
		//Dependency Injection
		if(args.n3pheleClient)
		{
			this.n3pheleClient = args.n3pheleClient;
		}
    },
	create: function(){
		this.inherited(arguments);
		
		//Footer toolbar
		if (enyo.Panels.isScreenNarrow())
			this.createComponent({kind: "onyx.Toolbar", components: [ {kind: "onyx.Button", content: "Close", ontap: "backMenu"} ]});
		else
			this.createComponent({kind: "onyx.Toolbar"});
			
		//If not injected, create a default implementation
		if(!this.n3pheleClient)
		{
			this.n3pheleClient = new N3pheleClient();
		}
		//the authentication header
		this.n3pheleClient.uid = this.uid;

		//get data
		this.mountingList( 0 , this.end );		
	},
	backMenu: function( sender , event){
		sender.parent.parent.parent.parent.setIndex(0);
	},
	fillItems: function( inSender, inEvent ){
		
		var index = inEvent.index;
		this.$.item.addRemoveClass("onyx-selected", inSender.isSelected(index));
		this.$.name.setContent( this.lines[index].name );
	},
	itemTap:function( inSender, inEvent ){
		var bounds = inSender.parent.owner.getScrollBounds();
		var index = inEvent.index;
		var main = inSender.owner.parent.owner;
		var panels = main.$.panels;

		main.closeSecondaryPanels(2);
		main.createComponent({kind: "RecentActivityPanel", 'url': inSender.owner.lines[index].uri, 'uid': this.uid, container: panels}).render();
		
		panels.reflow();
		panels.setIndex(2);
		inSender.parent.owner.scrollTo( bounds["left"] ,  bounds["top"] );
	},

	listUpdate: function( sender, event){
		var limitIndex = this.lines.length - 5;
		if( event.index > limitIndex ){
			this.mountingList( this.end , this.end + 3  );
			this.end += 3;
		}		
	},
	mountingList: function( start , end ){
			
		var thisPanel = this;
		var success = function (activities) {		
			//increment data
			if( thisPanel.lines.length == 0){
				if( activities.length == 0 ){
					thisPanel.$.divider.setContent("User doesn't have history activities!");
					thisPanel.$.commandList.applyStyle("display", "none !important");
					thisPanel.reflow();
					return;
				}
				thisPanel.lines = activities;
			}else{
				thisPanel.lines = thisPanel.lines.concat( activities );
			}
			thisPanel.$.commandList.setCount(thisPanel.lines.length);
			thisPanel.$.commandList.applyStyle("height", ""+(thisPanel.lines.length * 62)+"px" );
			thisPanel.$.commandList.reset();	
		}
		
		this.n3pheleClient.listActivityHistory(start, end, success);		
	}
	
});