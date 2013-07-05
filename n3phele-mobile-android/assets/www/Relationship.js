enyo.kind({ 
	name:"Relationship",
	kind: "FittableRows",
	fit: true,
	
	results:null,
	style: "padding: 0px; background-color:#fff",
	events: {
		onCreateService: "",
		onRemoveService: "",
		onClickService:"",
		onBack:""
	},
	components:[
		{name:"toolBar",  classes: "toolbar-style", kind: "onyx.Toolbar", components: [ 
			{name: "title", content:"Relationship" },			
			{kind: "onyx.Button", classes:"button-style-left", content : "Stack", ontap : "backMenu"},			
			{kind: "onyx.Button", classes:"button-style-right", content : "Done"},
			{fit: true}
		]},
		
		{style:"height:93%", components:[
			{classes:"containerDrop	", components:[
				{name: "SelPanel", style: "margin: 1em auto; padding:0 10px 0 10px", components: [
					{content:"Stacks", style:"padding-top:17px;color:#fff"},
					{kind:"Select", classes:"styled-select", name:"select", onchange:"itemSelected", style:"-webkit-appearance:none !important;outline:none; background-color:#fff !important",components:[     				/* <<<<--------------------- */
						{content:"Stack_01"},
						{content:"Stack_02"}						                                                             
					]}
				]},
				{name: "SelPanel", style: "margin: 1em auto; padding:0 10px 0 10px", components: [
					{content:"Relation", style:"padding-top:17px;color:#fff"},
					{kind:"Select", classes:"styled-select", name:"select", onchange:"itemSelected", style:"-webkit-appearance:none !important;outline:none; background-color:#fff !important",components:[     				/* <<<<--------------------- */
						{content:"Stack_03"},
						{content:"Stack_04"}						                                                             
					]}
				]},
			]},
			
			{classes:"containerSelect", components:[
				{kind: "onyx.InputDecorator", classes:"input",layoutKind: "FittableColumnsLayout", components: [
					{kind: "onyx.Input", name: "searchInput", fit: true, onchange: "searc"},
					{kind: "onyx.Button", classes:"button-search-style", style:"padding:0", ontap: "search", components: [
						{content:"Select"}				
					]}
				]},
			]},				
		]}		   			
	],	
	create: function(){
	this.inherited(arguments);
			var thisPanel = this;
			var listSize = 5;
		//this.$.title.setContent(this.stack.name);
		//this.$.list.setCount(listSize);
		results = new Array();
		console.log(this.stack);
		
		
		/* if(this.stack.vnum == 1)
		{
		this.$.b1.setContent("Add database");
		this.$.b2.setContent("Add load balancer");
		}
		else
		{
		this.$.b1.setContent("Add Node");
		this.$.b2.setContent("Remove Node");
		} */
		
	},
	selectedAccount: function(sender, event){
	//Service details will have the delete opt
	   var obj =  new Object();
		obj.name = results[event.index];
		this.doClickService(obj);
		
		
	},
	
	newService: function(sender, event){
		this.doCreateService();
	},
	setupItem: function(sender, event){
	  if(this.stack.vnum == 0)
     {
	  this.$.name.setContent("VM:" + event.index);
	   results.push(this.$.name.getContent());
	 }
     else
	 {
	 //Just for mockup reference since we also want to display contents in the list that are load balancer
	 if(event.index % 2 == 1)  
	 { 
	 this.$.name.setContent("Load balancer:");
	 }
	 else
	 {
	 this.$.name.setContent("Database:");
	 }
	 
	 
	 }
	   
	   if( event.index % 2 == 1)
	   {
	   this.$.item.applyStyle("background-color", "#F7F7F7")
	   };
         if( event.index % 2 == 0)
	   {
	   this.$.item.applyStyle("background-color", "white")
	   };
	  },
	  
	backMenu: function (sender, event){
		this.doBack();
	}
});
