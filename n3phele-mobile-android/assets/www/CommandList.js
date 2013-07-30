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
		onBack: "",
		onLost:"",
	},
	components: [
			{kind: "onyx.Toolbar",classes: "toolbar-style", name: "toolTop", components: [{ content: "Commands", style:"padding-right:25px"}]},

				{kind: "onyx.InputDecorator",style: "margin:25px 10px 25px 10px;display: block; border-radius:6px 6px", layoutKind: "FittableColumnsLayout", components: [
					{name: "searchInput", fit: true, kind: "onyx.Input", onchange: "searc"},
					{kind: "onyx.Button",classes:"button-search-style", ontap: "search", components: [
						{kind: "onyx.Icon", src: "http://nightly.enyojs.com/latest/sampler/assets/search-input-search.png"}
					]}
				]},
				{name: "searchSpinner", kind: "Image", src: "http://nightly.enyojs.com/latest/sampler/assets/spinner.gif", showing: false},
                {name: "Spin",kind:"onyx.Spinner",classes: "onyx-light",style:" margin-top:100px;margin-left:45%"}				
	],
	create: function(){
		this.inherited(arguments)
         this.$.Spin.show();		
		if (this.closePanel.isScreenNarrow()) {
			this.createComponent({kind: "onyx.Button",classes:"button-style-left", content: "Menu", ontap: "backMenu", container: this.$.toolTop}).render();
		}
		
		stacks = new Array();
			
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
		 this.$.Spin.hide();	
		thisPanel.render();
		thisPanel.reflow();	
		})
		.error(this, function(inSender, inResponse){
		 if(inSender.xhrResponse.status == 0) 
		  alert("Connection Lost");
		 this.doLost();
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