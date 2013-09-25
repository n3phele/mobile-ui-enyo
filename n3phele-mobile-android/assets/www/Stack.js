

enyo.kind({ 
	name:"Stack",
	kind: "FittableRows",
	fit: true,
   results:null,
	style: "padding: 0px;background-color:#fff",
	events: {
	    onCreateRelationship: "",
		onCreateService: "",
		onRemoveService: "",
		onSelectedStack:"",
		onBack:""
	},
	components:[
		{name:"toolBar",  classes: "toolbar-style", kind: "onyx.Toolbar", components: [ { name: "title", content:"Stack" },
       {kind : "onyx.Button", classes:"button-style-left", content : "Service", ontap : "backMenu"},
	   {kind: "onyx.Button", content: "Delete", classes: "button-style-right",style:"background-image:-webkit-linear-gradient(top,#B5404A 50%,#9E0919 77%) !important" , ontap: "removeStack"}
		,{fit: true}]},
		   {name: "values", style:"font-weight: bold;padding-left:13px;margin: 0.3em auto", components:[  
					       {content: "Name", style:"display: inline-block; width:26%;font-weight: bold"} 					       					
					]},
         {name: "divider", classes: "list-divider"},	
	    {name: "list", kind: "List", touch: true,  multiSelect: false, style:"height:80%;", fit: true, onSetupItem: "setupItem" , components: [
	         {name: "item", style: "padding: 10px 0 10px 10px; margin:auto; border:1px solid rgb(200,200,200)", ontap: "selectedStack", components: [
	         	{name: "name", style:"width: 26%; display: inline-block"},
				{name:"cost",style:"width:26%;display:inline-block"},
		        {name: "icon2", kind: "onyx.IconButton",style:"float:right",src: "assets/next.png"} 
	         ]}
	     ]},
		 {name:"line",  style:"border-top:2px solid #768BA7;margin-top:10px;text-align:center"},
		/* {name: "buttonsPanel",components:[
					{name: "buttons",style:"text-align:center",  components:[  
						{name:"b1",kind:"onyx.Button", content: "Add Node", classes:"button-style",  style:"width:98%;height:40px;margin:0.8em auto", ontap:"addNode"},
						{name:"b2",kind:"onyx.Button", content: "Remove Node", classes:"button-style",  style:"width:98%;height:40px;margin:1.0em auto", ontap:"updateNode"}, 
					]}
		]},	 */
				
	],	
	create: function(){
	this.inherited(arguments);
	this.createComponent({content: "Cost per hour:", style:"display: inline-block; width:25%;font-weight: bold", container: this.$.values}).render();
	
	var thisPanel = this;
	var stackSize;
		this.$.title.setContent(this.stack.name);
		console.log(this.stack.stacks.vms);
			var ajaxParams = {
				url: this.stack.stacks.vms,
				headers:{ 'authorization' : "Basic "+ this.uid},
				method: "GET",
				contentType: "application/x-www-form-urlencoded",
				sync: false, 
			};	
			var ajaxComponent = n3phele.ajaxFactory.create(ajaxParams); //connection parameters		
			ajaxComponent
			.go()
			.response( this, "processActions" )
			.error(this, function(inSender, inResponse){
		 if(inSender.xhrResponse.status == 0) 
		  alert("Connection Lost");
		 this.doLost();
						this.$.Msg.setContent("Error to load recent activities!!!");
                        this.$.Spin.hide();});
		results = new Array();
			
		/* this.$.b1.setContent("Add Node");
		this.$.b2.setContent("Remove Node"); */
		
		
	},
	selectedStack: function(sender, event){
	
	 var obj = new Object();
	
	 obj.action = stackSize[event.index].action;
	 obj.name = stackSize[event.index].name;
	 console.log(obj);
	 
	 
		this.doSelectedStack(obj);	
	},
	
	newService: function(sender, event){
		this.doCreateService();
	},
	setupItem: function(sender, event){
	  if(this.stack.vnum == 0)
     {
     this.$.name.setContent(stackSize[event.index].name);	 
     this.$.cost.setContent(stackSize[event.index].costPerHour)	 
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
	 processActions: function( request, response){		
			if(response.total == 0){				
				this.$.list.applyStyle("display", "none !important");
				this.reflow();
				this.$.Spin.hide();
				this.$.Msg.setContent("No current Services in the list!");		
				return; 
			}
			response = fixArrayInformation(response);
			stackSize = response;
			this.$.list.setCount(stackSize.length);
		    this.$.list.reset();
		},  
	backMenu: function (sender, event){
		this.doBack();
	},
	addNode: function(inSender, inEvent){
		if(this.stack.vnum == 1){
			//this.doCreateRelationship();	
		}
	}	
});
