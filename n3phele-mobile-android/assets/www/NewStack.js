var stacks;
enyo.kind({
	name: "NewStack",
	data: [],
	commands: null,
	commandsImages : null,
	style:"background:#fff",
	events: {
		onSelectedStack: "",
		onBack: ""
	},
	components: [
			{kind: "onyx.Toolbar",classes: "toolbar-style", name: "title_1", components: [{ content: "New Stack"},{kind: "onyx.Button", classes:"button-style-left", content: "Service Detail", ontap: "backMenu"}]},
				{kind: "onyx.InputDecorator",style: "margin:25px 0 25px 15px;display: block; width:95%; border-radius:6px 6px", layoutKind: "FittableColumnsLayout", components: [
					{name: "searchInput", fit: true, kind: "onyx.Input", onchange: "searc"},
					{kind: "onyx.Button",classes:"button-search-style", ontap: "search", components: [
						{kind: "onyx.Icon", src: "http://nightly.enyojs.com/latest/sampler/assets/search-input-search.png"}
					]}
				]},
				{name: "searchSpinner", kind: "Image", src: "http://nightly.enyojs.com/latest/sampler/assets/spinner.gif", showing: false},
				{kind: "Scroller", name: "scroll", fit: true, components: [
		          {name: "panel", components:[]}
				]}			
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
			var thisPanel = this;
			thisPanel.createComponent({name: "ListIcon",kind: "IconList", onDeselectedItems: "commandDeselect", onSelectedItem: "itemTap", commands: this.commands,
				commandsImages: this.commandsImages,container: thisPanel.$.panel,
				retrieveContentData: function(){
					this.data = createCommandItems(this.commands, this.commandsImages); } 
				}).render();
			thisPanel.reflow();
	},
	itemTap: function(inSender, inEvent) {
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
		var thisPanel = this;
		thisPanel.createComponent({name: "ListIcon",kind: "IconList", onDeselectedItems: "commandDeselect", onSelectedItem: "itemTap", commands: this.commands,
			commandsImages: this.commandsImages,container: thisPanel.$.panel,
			retrieveContentData: function(){
			this.data = createCommandItems(search, this.commandsImages); } 
		}).render();
			thisPanel.reflow();
	},
	
		
});