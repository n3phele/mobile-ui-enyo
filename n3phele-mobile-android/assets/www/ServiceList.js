var results;
var i = 0;
enyo.kind({ 
	name:"ServiceList",
	kind: "FittableRows",
	fit: true,
	style: "padding: 0px",
	events: {
		onCreateService: "",
		onRemoveService: "",
		onClickService:""
	},
	components:[
		{kind: "onyx.Toolbar",style:"background:#b1c2d7;border:1px solid #375d8c;background-size:contain;color:#375d8c;border-bottom: 2px solid #88B0F2", components: [ { name: "title", content:"Services" }, {fit: true}]},

		{kind: "FittableRows", name:"panel", fit: true, components: [	        
				  					
	    ]},
	    {name: "list", kind: "List", count: 100, touch: true,  multiSelect: false,style:"height:85%; border-top: 2px solid #88B0F2", onSetupItem: "setupItem" , components: [
	         {name: "item", style: "padding: 10px 0 10px 10px; margin:auto; background-color: white; border:1px solid rgb(200,200,200)", components: [
	         	{name: "name", style:"width: 75%; display: inline-block",ontap: "selectedAccount"},  {name: "icon", kind: "onyx.IconButton", style:"float:right",src: "assets/remover.png", ontap: "removeItem"} 	    
	         ]}
	     ]}, 
<<<<<<< HEAD
		{name: "toolBar", kind: "onyx.Toolbar", style:"background:#b1c2d7;border:1px solid #375d8c;position:absolute;bottom:-1;width:100%;background-size:contain;color:#375d8c;clear: both",components: [ {kind: "onyx.Button",style:"background-color:#FFFFFF;color:#375d8c;border-color:#375d8c", content: "New Service", ontap: "newAccount"} ]}
=======
		{kind: "onyx.Toolbar",style:"background:#b1c2d7;border:1px solid #375d8c;position:absolute;bottom:0;width:100%;background-size:contain;color:#375d8c;clear: both",components: [ {kind: "onyx.Button",style:"background-color:#FFFFFF;color:#375d8c;border-color:#375d8c", content: "New Service", ontap: "newAccount"} ]}
>>>>>>> ac6e46526a19f44da69844722714c9b4b3c13b9e
	],
	create: function(){
		if (this.p.isScreenNarrow()) {
			this.$.toolBar.createComponent({kind: "onyx.Button", style: "float: right;", content: "Close", ontap: "backMenu"}).render();
		}
	},
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
