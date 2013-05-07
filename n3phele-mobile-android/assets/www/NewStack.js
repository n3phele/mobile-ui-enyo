enyo.kind({
	name: "NewStack",
	kind: "FittableRows",
	data: [],
	commands: null,
	commandsImages : null,
	events: {
		onSelectedStack: "",
		onBack: ""
	},
	components: [
			{kind: "onyx.Toolbar", content: "New Stack", name: "title_1", style:"background:#b1c2d7;border:1px solid #375d8c;background-size:contain;color:#375d8c"},
				{kind: "onyx.InputDecorator",style: "width: 85%; margin:25px 0 25px 0;width:50%;border-radius:6px 6px", layoutKind: "FittableColumnsLayout", components: [
					{name: "searchInput", fit: true, kind: "onyx.Input", onchange: "search"},
					{kind: "Image", src: "http://nightly.enyojs.com/latest/sampler/assets/search-input-search.png", style: "width: 20px; height: 20px;"}
				]},
				{kind: "onyx.Button", content: "search", ontap: "search"},
				{name: "searchSpinner", kind: "Image", src: "http://nightly.enyojs.com/latest/sampler/assets/spinner.gif", showing: false},
				{kind: "Scroller", name: "scroll", fit: true, components: [
		          {name: "panel", components:[]}
				]},				
		{kind: "onyx.Toolbar", name: "btnTool", components: [ {kind: "onyx.Button", content: "Close", ontap: "backMenu"}]}
		//{kind: "FlickrSearch", onResults: "searchResults"}	
	],
	create: function(){
		this.inherited(arguments)
				
			this.commands = new Array();
			this.commandsImages = new Array();
			this.commands.push("jenkins");
			this.commandsImages.push("assets/Script.png");
			
			var thisPanel = this;
			thisPanel.createComponent({name: "ListIcon",kind: "IconList", onDeselectedItems: "commandDeselect", onSelectedItem: "itemTap", commands: this.commands,
				commandsImages: this.commandsImages,container: thisPanel.$.panel,
				retrieveContentData: function(){
					this.data = createCommandItems(this.commands, this.commandsImages); } 
				}).render();
			thisPanel.reflow();
			
			//popup.delete();
		},
	itemTap: function(inSender, inEvent) {
		this.doSelectedStack(inEvent);
	},
	backMenu: function(inSender, inEvent) {
		this.doBack();
	
	},
	
		
});