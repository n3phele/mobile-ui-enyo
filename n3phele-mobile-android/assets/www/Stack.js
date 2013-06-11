var results;
var listSize = 3;
enyo.kind({ 
	name:"Stack",
	kind: "FittableRows",
	fit: true,
	style: "padding: 0px",
	events: {
		onCreateService: "",
		onRemoveService: "",
		onClickService:"",
		onBack:""
	},
	components:[
		{name:"toolBar",  classes: "toolbar-style", kind: "onyx.Toolbar", components: [ { name: "title", content:"Stack" },
       {kind : "onyx.Button", classes:"button-style-left", content : "Service", ontap : "backMenu"},
		{kind: "onyx.Button",  content: "+", ontap: "newService", style: "font-size: 20px !important;font-weight: bold;", classes:"button-style-right"},{fit: true}]},
	    {name: "list", kind: "List", touch: true,  multiSelect: false, style:"height:80%;", fit: true, onSetupItem: "setupItem" , components: [
	         {name: "item", style: "padding: 10px 0 10px 10px; margin:auto; border:1px solid rgb(200,200,200)", ontap: "selectedAccount", components: [
	         	{name: "name", style:"width: 75%; display: inline-block"},
		        {name: "icon2", kind: "onyx.IconButton",style:"float:right",src: "assets/next.png"} 
	         ]}
	     ]}, 
	],	
	create: function(){
	this.inherited(arguments);
			var thisPanel = this;
		//this.$.title.setContent(this.stack.name);
		this.$.list.setCount(listSize);
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
	setupItem: function(sender, event){
	   this.$.name.setContent("VM:" + event.index);
	   results.push(this.$.name.getContent());
	   
	   if( event.index % 2 == 1)
	   {
	   this.$.item.applyStyle("background-color", "#F7F7F7")
	   };
         if( event.index % 2 == 0)
	   {
	   this.$.item.applyStyle("background-color", "white")
	   };
	  // if(results.length > listSize){
	  // this.$.list.createComponent({name: "more", style: "padding: 10px 0 10px 10px; margin:auto; border:1px solid rgb(200,200,200)",components: [
	//				{kind: "onyx.Button", content: "More activities", classes: "button-style", ontap: "moreServ"},
//			]});
		//}
	  },
	backMenu: function (sender, event){
		this.doBack();
	}
});
