/*
	The main classes that mount the new stack list page 
 */
enyo.kind({
	name: "NewStack",
	data: [],
	commands: null,
	commandsImages : null,
	stacks: null,
	commandsUri: null,
	style:"background:#fff",
	events: {
		onSelectedStack: "",
		onBack: ""
	},
	components: [
			{kind: "onyx.Toolbar",classes: "toolbar-style", name: "title_1", components: [{ content: "New Stack", style:"padding-right:40px"},{kind: "onyx.Button", classes:"button-style-left", content: "Service", ontap: "backMenu"}]},
			
			{kind: "onyx.InputDecorator",style: "margin:25px 10px 25px 10px;display: block; border-radius:6px 6px", layoutKind: "FittableColumnsLayout", components: [
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
		this.commandsUri = new Array();	
		this.stacks = new Array();
			
		var ajaxComponent = n3phele.ajaxFactory.create({
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

			if(this.data[i].tags == "service"){
				this.commands.push( this.data[i].name ); //set name
				this.commandsImages.push("assets/juju.png");
				this.stacks.push(this.data[i].name);
				this.commandsUri.push(i);	
			}
		}	
		var thisPanel = this;
		thisPanel.createComponent({name: "IconGallery", kind: "IconList",style:"background:#FFF", onDeselectedItems: "commandDeselect", onSelectedItem: "itemTap", commands: this.commands, commandsImages: this.commandsImages,
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
		var obj = new Object();
		obj.index = inEvent.index;
		obj.uri = this.commandsUri[inEvent.index];
		console.log(obj);
		this.doSelectedStack(obj);
	},

	backMenu: function(inSender, inEvent) {
		this.doBack();
	},

	search: function(inSender, inEvent) {
		var search =  new Array();
			for (var i in this.stacks) {
				if (this.stacks[i].indexOf(this.$.searchInput.getValue()) !== -1) {
					search.push(this.stacks[i]);
       			}
    		}
		
		this.destroyClientControls();
		
		var thisPanel = this;
		thisPanel.createComponent({name: "ListIcon",kind: "IconList", onDeselectedItems: "commandDeselect", onSelectedItem: "itemTap", commands: this.commands,
			commandsImages: this.commandsImages,container: thisPanel.$.panel,
			retrieveContentData: function(){
			this.data = createCommandItems(search, this.commandsImages); } 
		}).render();
		
		thisPanel.reflow();
	}	
});