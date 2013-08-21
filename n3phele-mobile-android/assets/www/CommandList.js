enyo.kind({
	name: "CommandList",
	kind: "FittableRows",
	fit: true,
	stacks: null,
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

				{kind: "onyx.InputDecorator",style: "margin:25px 10px 25px 10px;display: block; border-radius:6px 6px; background:#fff;", layoutKind: "FittableColumnsLayout", components: [
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
				this.commands.push( this.data[i].name ); //set name
				
				if(this.data[i].tags == "juju"){
					this.commandsImages.push("assets/juju.png");
				}else{
					this.commandsImages.push("data:image/png;base64,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");
				}
				
				this.stacks.push(this.data[i].name);
				
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
			if(inSender.xhrResponse.status == 0) {
		 		alert("Connection Lost");
		 		this.doLost();
		 	}
		});	
 		
	},

	itemTap: function(inSender, inEvent) {
		console.log(inEvent);
		this.doSelectedCommand(inEvent);
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
		thisPanel.createComponent(
		{name: "ListIcon",kind: "IconList", onDeselectedItems: "commandDeselect", onSelectedItem: "itemTap", commands: this.commands,
			commandsImages: this.commandsImages,
			retrieveContentData: function(){
			this.data = createCommandItems(search, this.commandsImages); } 
		}).render();
			thisPanel.reflow();
	},
	
		
});