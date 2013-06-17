//Exposes a list of items with icons (Card objects)
/*
	An example of instantiate this is like that:
			{
				name: "IconGallery",
				kind: "IconList",
				onSelectedItem: "itemTap", 
				retrieveContentData: function() {
					this.data = prepareData;
				} 
			}
			
	The object 'data' variable expect a list of objects that represent a card.
	This is the structure:
		var data = [{
			name: "",
			displayName: "", //Name to be displayed on screen below icon
			image: "", //image path to be displayed on grid		
		}];
	The 'retrieveContenData' function is expected to fill this variable using some custom function.
	This function is called only once on object rendering.			
*/
enyo.kind({
	name: "IconList",
	kind: "Scroller",
	style:"background:#fff",
	data: [],
	events: {
		onSelectedItem: "",
		onDeselectedItems: ""
	},
	fit: true, touch: true, classes: "main",
	components: [
		{name: "cards", classes: "cards"},
	],
	constructor: function() {
		this.inherited(arguments);
	},
	create: function() {
		this.inherited(arguments);
	},
	rendered: function() {
		this.inherited(arguments);
		this.retrieveContentData();
		this.fillContent();
	},
	resizeHandler: function() {
		this.inherited(arguments);
	},
	//Get data content from this.data and pass to this.widgets. Call render function.
	fillContent: function() {
		this.widgets = {};
		
		for(var n in this.data)
		{
			this.widgets[this.data[n].name] = this.data[n];
			this.widgets[this.data[n].name].index = n;//Anelise: I need this information to search the commend information
		}
		
		this.renderItems();
	},
	retrieveContentData: function() {
		this.data = [];
	},
	//Create Cards based on the content of this.widgets variable
	renderItems: function() {
		this.$.cards.destroyClientControls();
		
		var items = this.widgets;
		
		items = this.toArray(items);
		
		for (var i=0, w; (w=items[i]); i++) {
			var more = {data: w, ontap: "itemTap"};
			this.createComponent({name:"commandItem"+i, kind: "Card", container: this.$.cards}, more);
		}
		
		this.$.cards.render();
	},
	toArray: function(inItems) {
		var ls = [];		
		for (var n in inItems) {
			ls.push(inItems[n]);
		}
		return ls;
	},
	lastSelected: false,
	selectItem: function(item) {	
		if( item != this.lastSelected ) 
		{	
			this.setAsSelected(item);
			this.lastSelected = item;
			this.doSelectedItem(item.data);
		}
		else
		{	
			this.deselectLastItem();
			this.lastSelected = null;
			this.doDeselectedItems();
		}
	},
	setAsSelected: function(item) { 
		if (this.lastSelected){
				this.lastSelected.addRemoveClass("onyx-selected", false );
		}
		item.addRemoveClass("onyx-selected", true );
	},
	deselectLastItem: function() {
		if(this.lastSelected) this.lastSelected.addRemoveClass("onyx-selected", false );
		lastSelected = null;
	}
	,
	itemTap: function(inSender, inEvent) {
		this.selectItem(inSender, inEvent);
	},
	preventTap: function(inSender, inEvent) {
		inEvent.preventTap();
	}
});

/*
	Object that holds an icon and a name to be displayed
	Data structure needed on 'data' variable to fill internal component:
	
		var data = [{
			name: "",
			displayName: "", //Name to be displayed on screen below icon
			image: "", //image path to be displayed on grid		
		}];
	
	Create it like:
	
		var more = {data: data, ontap: "itemTap"};
		this.createComponent({name:"commandItem"+i, kind: "Card", container: this.$.cards}, more);
*/
enyo.kind({
	name: "Card",
	kindClasses: "card",
	published: {
		data: ""
	},
	components: [
		{name: "icon", kind: "Image", classes: "icon"}
		,
		{name: "name", classes: "name"}
	],
	dataChanged: function() {
		this.inherited(arguments);
		
		var i = this.data;
		if (!i) {
			return;
		}
		this.$.name.setContent(i.displayName);
		
		if (this.data) {
			this.$.icon.setSrc(this.data.image);
		}
	},
	create: function() {
		this.inherited(arguments);
		this.dataChanged();
	}
});

