var stacks;
enyo.kind({
	name: "CommandList",
	kind: "FittableRows",
	fit: true,
	data: [],
	commands: null,
	commandsImages : null,
	events: {
		onSelectedCommand: "",
		onBack: ""
	},
	components: [
			{kind: "onyx.Toolbar",classes: "toolbar-style", name: "toolTop", components: [{ content: "Commands"}]},

				{kind: "onyx.InputDecorator",style: "position:relative; margin:25px 0 25px 10px; border-radius:6px 6px", layoutKind: "FittableColumnsLayout", components: [
					{name: "searchInput", fit: true, style: "width:60%;", kind: "onyx.Input", onchange: "searc"},
					{kind: "Image", ontap: "search", src: "http://nightly.enyojs.com/latest/sampler/assets/search-input-search.png", style: "width: 20px; height: 20px;"}
				]},
				{name: "searchSpinner", kind: "Image", src: "http://nightly.enyojs.com/latest/sampler/assets/spinner.gif", showing: false}		
	],
	create: function(){
		this.inherited(arguments)	
		if (this.closePanel.isScreenNarrow()) {
			this.createComponent({kind: "onyx.Button",classes:"button-style-left", content: "Menu", ontap: "backMenu", container: this.$.toolTop}).render();
		}
		
		stacks = new Array();
			
			var ajaxComponent = new enyo.Ajax({
			url: serverAddress+"command",
			headers:{ 'authorization' : "Basic "+ this.uid},
			method: "GET",
			contentType: "application/x-www-form-urlencoded",
			sync: false, 
		}); 
				
		ajaxComponent.go()
		.response(this, function(sender, response){
	
			response.elements = fixArrayInformation(response.elements);
			
			this.data = response.elements;
			this.commands = new Array();
			this.commandsImages = new Array();
			for( var i in this.data ){//set command list information
				this.commands.push( this.data[i].name ); //set name
				this.commandsImages.push("assets/Script.png");
				stacks.push(this.data[i].name);
		}		
		var thisPanel = this;
		thisPanel.createComponent({name: "IconGallery", kind: "IconList",style:"background:#FFF", onDeselectedItems: "commandDeselect", onSelectedItem: "itemTap", commands: this.commands,
			commandsImages: this.commandsImages,
			retrieveContentData: function(){
				this.data = createCommandItems(this.commands, this.commandsImages); } 
			}).render();
		
		thisPanel.render();
		thisPanel.reflow();	
		})
		.error(this, function(){
			console.log("Error to load the list of repositories");
		});		
	},
	itemTap: function(inSender, inEvent) {
		this.doSelectedCommand(inEvent);
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
	this.destroyClientControls();
		var thisPanel = this;
		thisPanel.createComponent(
		{name: "ListIcon",kind: "IconList", onDeselectedItems: "commandDeselect", onSelectedItem: "itemTap", commands: this.commands,
			commandsImages: this.commandsImages,
			retrieveContentData: function(){
			this.data = createCommandItems(search, this.commandsImages); } 
		}).render();
			thisPanel.reflow();
	},
	
		
});