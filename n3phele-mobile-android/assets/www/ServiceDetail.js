
/*
	The main class that mount the Service Detail page 
 */
enyo.kind({
	name: "ServiceDetails",
	kind: "FittableRows",
	data: [],
	id:null,
	commands: null,
	commandsImages : null,
	stacks:null,
	action: null,
	vnum:null,
	relations: null,
	style:"background:#fff",
	events: {
		onCreateStack: "",
		onBack: "",
		onRemoveService: "",
		onSelectedStack:"",
		onCreateRelationship: "",
	}, 
	//create components of interface
	components: [

		//top toolbar that contains Title, add stack button, delete button ****************************************************************
		{kind: "onyx.Toolbar",classes: "toolbar-style",components:[ 
			{kind: "onyx.Button", content: "Delete", classes: "button-style-right",style:"background-image:-webkit-linear-gradient(top,#B5404A 50%,#9E0919 77%) !important" , ontap: "removeService"},
			{kind: "onyx.Button",classes:"button-style-left", content: "Services", ontap: "back"},		
			{kind: "onyx.Button",classes:"button-style-right", content: "New Stack", ontap: "newStack"},
			{content: "Service", name: "title"}
		]},							
		
		//set the name of service	*******************************************************************************************************
		{content: "Service", name: "service", style:"margin: 25px 0 30px 10px"},
		
		{name: "btnRelation", style: "text-align: center", components: [ 
			{name:"buttonRelation",kind:"onyx.Button", content: "Add Relationship", classes:"button-style",  style:"width:98%;height:40px;margin:0.8em auto", ontap:"addRelationship"}
		]},
		
		//create the search component	**********************************************************************
		{name: "searchBar", components: [ 
			{kind: "onyx.InputDecorator",style: "margin:25px 10px 25px 10px;display: block; border-radius:6px 6px", layoutKind: "FittableColumnsLayout", components: [
				{name: "searchInput", fit: true, kind: "onyx.Input"},
				{kind: "onyx.Button",classes:"button-search-style", ontap: "search", components: [
					{kind: "onyx.Icon", src: "http://nightly.enyojs.com/latest/sampler/assets/search-input-search.png"}
				]}
			]}
		]},
			
		{name:"line",  style:"border-top:2px solid #768BA7;margin-top:10px;text-align:center"},
		
		//create the panel of stacks in service **********************************************************************
		{kind: "Scroller", name: "scroll", fit: true, components: [
		    {name: "panel", style: "border 1px solid" , components:[]},{name: "Spin",kind:"onyx.Spinner",classes: "onyx-light",style:"margin-left:47%;margin-top:100px"}, 
		]},	
		
		//buttons for resource and relationship **********************************************************************
		/* {kind: "onyx.RadioGroup", onActivate:"radioActivated", components: [
			{content: "Resource",style:"width:100%;padding-top:15px;padding-bottom:15px;" ,active: true, ontap:"resources"},
			{name:"relationTab",content: "Relationship",style:"width:50%;padding-top:15px;padding-bottom:15px;",ontap:"relationships"}		
		]},  */
	],	

	/*
		this function call the update Service Detail to request to the server to populate the list.
	*/
	create: function(){
		this.inherited(arguments)
		this.$.btnRelation.hide();
		//this.$.relationTab.hide(); 
		var stacks;
		console.log(this);

		this.updateServiceDetail(this);
		
		var self = this;
		var updateList = function(){
			self.updateServiceDetail(self);
		}
		n3phele.addListener(this, updateList, serverAddress+"process/activeServiceActions" );
		
		this.render();

		this.$.service.setContent(this.service.name);
		this.vnum = 0;		
		this.$.Spin.show();

	},

	/*
		this function update the service detail list and do the request call to the server 
	*/
	updateServiceDetail: function(panel){
		var ajaxComponent = n3phele.ajaxFactory.create({
			url: panel.service.uri,
			headers:{ 'authorization' : "Basic "+ panel.uid},
			method: "GET",
			contentType: "application/x-www-form-urlencoded",
			sync: false, 
			}); 
				
		ajaxComponent.go()
		.response(panel, "stackList")
		.error(panel, function(){
			console.log("Error to load the detail of the command!");
		});		
	},

	/*
		this function represents the response of ajax call
	*/
	stackList: function(sender, response){
		
		this.action = response.action;
		
		id = this.action;
		id= id.split("/");
		id = id.pop();

		var ajax = n3phele.ajaxFactory.create({
			url: response.action,
			headers:{ 'authorization' : "Basic "+ this.uid},
			method: "GET",
			contentType: "application/x-www-form-urlencoded",
			sync: false, 
		}); 
				
		ajax.go()
		.response(this, function(sender, response){
		
			this.relations =fixArrayInformation(response.relationships);
			response.stacks = fixArrayInformation(response.stacks);
			stacks = response.stacks;
			this.commands = new Array();
			this.commandsImages = new Array();
			
			for(var i in stacks){
				this.commands.push(stacks[i].name);
			}
		
			for(var i in this.commands){
				this.commandsImages.push("assets/folder.png");
			}
			
			this.showData();	
		})
		.error(this, function(){
			console.log("Error to load the detail of the command!");
		});					
	},
	
	/*
		this function occurs when the add stack button is clicked and goes to the Add Stack screen
	*/
	newStack: function(inSender, inEvent) {  
	  	var serviceInfo = new Object();
	   	serviceInfo.uri = this.action;
	   	serviceInfo.id = id;
		this.doCreateStack(serviceInfo);
	},
	
	/*
		this function back to the Service list page
	*/
	back: function(inSender, inEvent){
		this.doBack();
	},
	
	/*
		this function create the relationship list screen
	*/
	relationships:function(inSender,inEvent){ 
		this.$.panel.destroyClientControls();
	 	this.$.Spin.show();
	 	this.$.btnRelation.show();
		setTimeout(enyo.bind(this, this.relationshipList ),200);
     	this.$.searchBar.hide();
	},
	
	/*
		this function create the vms list screen
	*/
	/* resources:function(inSender,inEvent){ 
		this.$.panel.destroyClientControls();
	  	this.$.Spin.show();
     	this.$.btnRelation.hide();
	 	setTimeout(enyo.bind(this,this.showData ),200);
      	this.vnum = 0;
	  	this.$.searchBar.show();
	}, */

	/*
		this function is triggered when the search button is clicked, making the search for the string placed in the input
	*/
    search: function(inSender, inEvent) {
		var search =  new Array();
		for (var i in stacks) {
			if (stacks[i].indexOf(this.$.searchInput.getValue()) !== -1) {
				search.push(stacks[i]);
        	}
   		}

		this.$.panel.destroyClientControls();	

	},

	/*
		this function goes to the screen of resource or relationships
	*/
	itemTap: function(inSender, inEvent) {
		
		this.$.panel.destroyClientControls();
		this.updateServiceDetail(this);

		var stack =  new Object();
		stack.name = inEvent.name;
		stack.id = id;
		stack.vnum = this.vnum;
		stack.stacks = stacks[inEvent.index];
		
		console.log(stack);
	
		console.log(stack);
		this.destroyClientControls
		this.doSelectedStack(stack);
	},

	/*
		this function create the icons of the list
	*/
	showData:function(){
		this.$.Spin.hide();
		var thisPanel = this;
		
		thisPanel.createComponent({kind: "IconList", onDeselectedItems: "commandDeselect", onSelectedItem: "itemTap", commands: this.commands,
			commandsImages: this.commandsImages,container: thisPanel.$.panel,retrieveContentData: function(){
				this.data = createCommandItems(this.commands, this.commandsImages);
			} 
		}).render();
		
		thisPanel.reflow();
	},
	
	relationshipList: function(sender, event){
		this.$.Spin.hide();
		var thisPanel = this;
		
		thisPanel.createComponent({name: "list", kind: "List", touch: true, multiSelect: false,style: "height: 80%", fit: true, container: thisPanel.$.panel,components: [
	         {name: "item", style: "padding: 10px 0 10px 10px; margin:auto; border:1px solid rgb(200,200,200)", components: [
	         	{name: "relation", style:"width: 75%; display: inline-block"}
	         ]}
	     ]}, {owner: this});

		this.populateRelations();
		thisPanel.render();
		thisPanel.reflow();
	},

	populateRelations: function(sender, event){
		this.$.list.setCount(this.relations.length);
		for(var i =0; i<this.relations.length;i++){
			this.$.relation.setContent(this.relations[i].name);
		}
	},

	addRelationship: function(sender, event){
		this.doCreateRelationship();
	},
	removeService:function(sender,event)
	{   
	
	
	   console.log(this);
	   var obj = new Object();
	   obj.uri = this.uri;
	   obj.name = this.service.name;
	   obj.uid = this.uid;
	   
	
		
		this.doRemoveService(obj);
   
	
	}
	
});
