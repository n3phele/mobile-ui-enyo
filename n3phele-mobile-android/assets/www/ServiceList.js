var results;

enyo.kind({ 
	name:"ServiceList",
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
		{kind: "onyx.Toolbar",style:"background:#b1c2d7;border:1px solid #375d8c;background-size:contain;color:#375d8c;border-bottom: 2px solid #88B0F2", components: [ { name: "title", content:"Services" }, {fit: true}]},
			
			{name: "values", style:"padding: 10px 0 10px 10px; margin:auto; font-weight: bold;", components:[ 
				{content: "Name", style:"display: inline-block; width:25% ;font-weight: bold"}, 
					       					
			]},							

	    {name: "list", kind: "List", count: 100, touch: true,  multiSelect: false,style:"height:80%; border-top: 2px solid #88B0F2", fit: true, onSetupItem: "setupItem" , components: [
	         {name: "item", style: "padding: 10px 0 10px 10px; margin:auto; background-color: white; border:1px solid rgb(200,200,200)", components: [
	         	{name: "name", style:"width: 75%; display: inline-block",ontap: "selectedAccount"},  {name: "icon", kind: "onyx.IconButton", style:"float:right",src: "assets/remover.png", ontap: "removeItem"} 	    
	         ]}
	     ]}, 
	],	
	create: function(){
	this.inherited(arguments);
			var thisPanel = this;
			if (this.closePanel.isScreenNarrow()) {
		thisPanel.createComponent({kind: "onyx.Toolbar", style:"background:#b1c2d7;border:1px solid #375d8c;width:100%;background-size:contain;color:#375d8c;clear: both", components: [ {kind: "onyx.Button", content: "New Service", ontap: "newService"},{kind: "onyx.Button", style: "float: right;", content: "Close", ontap: "backMenu"}]}).render();
		}else{ 
		thisPanel.createComponent({kind: "onyx.Toolbar", style:"background:#b1c2d7;border:1px solid #375d8c;width:100%;background-size:contain;color:#375d8c;clear: both", components: [ {kind: "onyx.Button",  content: "New Service", ontap: "newService"}]}).render();		
		}
		results = new Array();
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
	newService: function(sender, event){
		this.doCreateService();
	},
	setupItem: function(sender, event){
	   this.$.name.setContent("Service:" + event.index);
	   results.push(this.$.name.getContent());
	  
	 
		},
	removeItem:function (sender,event)
	{   
        var obj =  new Object();
		obj.name = results[event.index];
		//obj.setContent(results[event.index]);
        console.log(obj);		
	    console.log(results[event.index]);
		this.doRemoveService(obj);
	},
	backMenu: function (sender, event){
		this.doBack();
	},
	activate: function(sender, event){
		this.doClickService();
	}

});
