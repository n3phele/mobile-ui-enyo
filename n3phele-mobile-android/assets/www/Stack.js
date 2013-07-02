

enyo.kind({ 
	name:"Stack",
	kind: "FittableRows",
	fit: true,

	results:null,
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
	   {kind: "onyx.Button", content: "Delete", classes: "button-style-right",style:"background-image:-webkit-linear-gradient(top,#B5404A 50%,#9E0919 77%) !important" , ontap: "removeStack"}
		,{fit: true}]},
	    {name: "list", kind: "List", touch: true,  multiSelect: false, style:"height:80%;", fit: true, onSetupItem: "setupItem" , components: [
	         {name: "item", style: "padding: 10px 0 10px 10px; margin:auto; border:1px solid rgb(200,200,200)", ontap: "selectedAccount", components: [
	         	{name: "name", style:"width: 75%; display: inline-block"},
		        {name: "icon2", kind: "onyx.IconButton",style:"float:right",src: "assets/next.png"} 
	         ]}
	     ]},
		 {name:"line",  style:"border-top:2px solid #768BA7;margin-top:10px;text-align:center"},
		 {name: "buttonsPanel",components:[
					{name: "buttons",style:"text-align:center",  components:[  
						{name:"b1",kind:"onyx.Button", content: "Add Node", classes:"button-style",  style:"width:98%;height:40px;margin:0.8em auto", ontap:"addNode"},
						{name:"b2",kind:"onyx.Button", content: "Remove Node", classes:"button-style",  style:"width:98%;height:40px;margin:1.0em auto", ontap:"updateNode"}, 
					]}
				]},	
				
	],	
	create: function(){
	this.inherited(arguments);
			var thisPanel = this;
			var listSize = 5;
		this.$.title.setContent(this.stack.name);
		this.$.list.setCount(listSize);
		results = new Array();
		console.log(this.stack);
		if(this.stack.vnum == 1)
		{
		this.$.b1.setContent("Add database");
		this.$.b2.setContent("Add load balancer");
		}
		else
		{
		this.$.b1.setContent("Add Node");
		this.$.b2.setContent("Remove Node");
		}
		
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
