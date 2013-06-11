var porco;
enyo.kind({
	name: "ServiceDetails",
	kind: "FittableRows",
	data: [],
	commands: null,
	commandsImages : null,
	stacks:null,
	vnum:null,
	style:"background:#fff",
	events: {
		onCreateStack: "",
		onBack: "",
		onRemoveService: "",
		onSelectedStack:"",
	}, 
	components: [
	
				{kind: "onyx.Toolbar",classes: "toolbar-style",components:[ {kind: "onyx.Button", content: "Delete", classes: "button-style-right",style:"background-image:-webkit-linear-gradient(top,#B5404A 50%,#9E0919 77%) !important" , ontap: "removeService"},
			{kind: "onyx.Button",classes:"button-style-left", content: "Services", ontap: "close"},		
		{kind: "onyx.Button",classes:"button-style-right", content: "New Stack", ontap: "newStack"},
			{content: "Service", name: "title_1", }]},							
				{content: "Service foo", name: "service foo", style:"margin: 25px 0 30px 10px"},
				 
				 	{kind: "onyx.InputDecorator",style: "margin:25px 10px 25px 10px;display: block; border-radius:6px 6px", layoutKind: "FittableColumnsLayout", components: [
					{name: "searchInput", fit: true, kind: "onyx.Input", onchange: "searc"},
					{kind: "onyx.Button",classes:"button-search-style", ontap: "search", components: [
						{kind: "onyx.Icon", src: "http://nightly.enyojs.com/latest/sampler/assets/search-input-search.png"}
					]}
				]}, 
						
				
			{name:"line",  style:"border-top:2px solid #768BA7;margin-top:10px;text-align:center"},
		{kind: "Scroller", name: "scroll", fit: true, components: [
		          {name: "panel", style: "border 1px solid" , components:[]}
				]},	
				
			
      
					/*{name:"reso",kind: "onyx.Button", content: "Resource", style:"width:50%;", ontap:"resource" },		

					{name:"rela",kind: "onyx.Button", content: "Relationship" , style:"width:50%;" , ontap:"relationships" },*/
             
				{kind: "onyx.RadioGroup", onActivate:"radioActivated", components: [
					{content: "Resource",style:"width:50%;padding-top:15px;padding-bottom:15px;" ,active: true, ontap:"resources"},
					{name:"rela",content: "Relationship",style:"width:50%;padding-top:15px;padding-bottom:15px;",ontap:"relationships"}		
				]},
			
		
		
		
	],	
	create: function(){
		this.inherited(arguments)
		    this.vnum = 0;		
			
			this.commands = new Array();
			this.commandsImages = new Array();
			stacks = ["Stack01", "Stack02", "Stack03", "StackXY"]
			for(var i in stacks){
				this.commands.push(stacks[i]);
			}
			
			for(var i in this.commands){
			this.commandsImages.push("assets/folder.png");
			}
		var thisPanel = this;
			thisPanel.createComponent({name: "ListIcon",kind: "IconList", onDeselectedItems: "commandDeselect", onSelectedItem: "itemTap", commands: this.commands,
				commandsImages: this.commandsImages,container: thisPanel.$.panel,
				retrieveContentData: function(){
					this.data = createCommandItems(this.commands, this.commandsImages); } 
				}).render();
			thisPanel.reflow();
	},
	
	newStack: function(inSender, inEvent) {
		this.doCreateStack();
	},
	
	close: function(inSender, inEvent){
		this.doBack();
	},
	relationships:function(inSender,inEvent)
	{ 
      this.vnum = 1;
	 console.log("relationships!" + this.vnum);
	},
	resources:function(inSender,inEvent)
	{   
      this.vnum = 0;
      console.log("resources!" + this.vnum );
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
	itemTap: function(inSender, inEvent) {
		this.doSelectedStack(inEvent);
		console.log(inEvent);
	},
	
});
