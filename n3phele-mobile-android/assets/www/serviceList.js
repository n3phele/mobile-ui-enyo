var results;
var i = 0;
enyo.kind({ 
	name:"serviceList",
	kind: "FittableRows",
	fit: true,
	style: "padding: 0px",
	events: {
		onCreateService: "",
		onRemoveService: "",
		onClickService:""
	},
	components:[
		{kind: "onyx.Toolbar",style:"background:#b1c2d7;border:1px solid #375d8c;background-size:contain;color:#375d8c", components: [ { name: "title", content:"Services" }, {fit: true}]},

		{kind: "FittableRows", name:"panel", fit: true, components: [	        
				    {name: "values", style:"padding: 10px 0 10px 10px; margin:auto; font-weight: bold; border-bottom: 2px solid #88B0F2", components:[ 
					       {content: "Name", style:"display: inline-block; width:25%;font-weight: bold"}, 
					       					
					]},						
	    ]},
	    {name: "list", kind: "List", count: 100, touch: true,  multiSelect: false,style:"height:80%", onSetupItem: "setupItem" , components: [
	         {name: "item", style: "padding: 10px 0 10px 10px; margin:auto; background-color: white; border:1px solid rgb(200,200,200)", components: [
	         	{name: "name", style:"width: 75%; display: inline-block",ontap: "selectedAccount"},  {name: "icon", kind: "onyx.IconButton", style:"float:right",src: "assets/remover.png", ontap: "removeItem"} 	    
	         ]}
	     ]}, 
		{kind: "onyx.Toolbar", style:"background:#b1c2d7;border:1px solid #375d8c;background-size:contain;color:#375d8c",components: [ {kind: "onyx.Button",style:"background-color:#FFFFFF;color:#375d8c;border-color:#375d8c", content: "New Service", ontap: "newAccount"} ]}
	],
	
	selectedAccount: function(sender, event){
		this.doClickService();
	},
	closePanel: function(inSender, inEvent){
			var panel = inSender.parent.parent.parent;
			
			panel.setIndex(2);				
			panel.getActive().destroy();					
			panel.panelCreated = false;
			
			if (enyo.Panels.isScreenNarrow()) {
				panel.setIndex(1);
			}
			else {
				panel.setIndex(0);
			}		
			
			panel.reflow();		
			panel.owner.$.IconGallery.deselectLastItem();			
	},
	newAccount: function(sender, event){
		this.doCreateService();
	},
	setupItem: function(sender, event){
	   this.$.name.setContent("Service:" + event.index);
	   i++;
		},
	removeItem:function (sender,event)
	{  
		this.doRemoveService();
	},

	activate: function(sender, event){
		this.doClickService();
	}
});