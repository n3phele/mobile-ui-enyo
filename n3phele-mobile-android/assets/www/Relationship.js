
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
			{kind: "onyx.Button", classes:"button-style-left", content : "Stack", ontap : "back"},			
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
				{name: "SelPanel2", style: "margin: 1em auto; padding:0 10px 0 10px", components: [
					{content:"Relation", style:"padding-top:17px;color:#fff"},
					{kind:"Select", classes:"styled-select", name:"select2", onchange:"itemSelected", style:"-webkit-appearance:none !important;outline:none; background-color:#fff !important",components:[     				/* <<<<--------------------- */
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
		results = new Array();
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

	back: function (sender, event){
		this.doBack();
	}
});
