var stacks;
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
					{name: "searchInput", fit: true, kind: "onyx.Input", onchange: "searc"},
					{kind: "Image", src: "http://nightly.enyojs.com/latest/sampler/assets/search-input-search.png", style: "width: 20px; height: 20px;"}
				]},
				{kind: "onyx.Button", style:"background-color:#FFFFFF;color:#375d8c;border-color:#375d8c", content: "search", ontap: "search"},
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
			stacks = ["jenkins", "cassandra", "hadoop", "mongodb", "mysql", "phpmyadmin", "postgresql", "rails", "joomla", "wordpress"]
			for(var i in stacks){
				this.commands.push(stacks[i]);
			}
			
			for(var i in this.commands){
			this.commandsImages.push("assets/Script.png");
			}
			var thisPanel = this.$.panel;
			thisPanel.createComponent({name: "ListIcon",kind: "IconList", onDeselectedItems: "commandDeselect", onSelectedItem: "itemTap", commands: this.commands,
				commandsImages: this.commandsImages,container: thisPanel.$.panel,
				retrieveContentData: function(){
					this.data = createCommandItems(this.commands, this.commandsImages); } 
				}).render();
			thisPanel.reflow();
	},
	itemTap: function(inSender, inEvent) {
		console.log("Clicado");
		this.doSelectedStack(inEvent);
	},
	backMenu: function(inSender, inEvent) {
		this.doBack();
	},
	search: function(inSender, inEvent) {
	var search =  new Array();
		 for (var i in stacks) {
			if (stacks[i].indexOf(this.$.searchInput.getValue()) !== -1) {
			search.push(stacks[i]);
        }
    }
	this.$.panel.destroyClientControls();
		var thisPanel = this.$.panel;
		thisPanel.createComponent({name: "ListIcon",kind: "IconList", onDeselectedItems: "commandDeselect", onSelectedItem: "itemTap", commands: this.commands,
			commandsImages: this.commandsImages,container: thisPanel.$.panel,
			retrieveContentData: function(){
			this.data = createCommandItems(search, this.commandsImages); } 
		}).render();
			thisPanel.reflow();
	},
	
		
});