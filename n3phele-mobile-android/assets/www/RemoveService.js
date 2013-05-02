var results;
var i = 0;
enyo.kind({ 
	name:"removeService",
	kind: "FittableRows",
	fit: true,
	style: "padding: 0px",
	events: {
		onCreateAcc: "",
		onBack: "",
		onClickItem:""
	},
	components:[
		{kind: "onyx.Toolbar",style:"background:#b1c2d7;border:1px solid #375d8c;background-size:contain;color:#375d8c", components: [ { name: "title", content:"Remove Service" }, {fit: true}]},

		{kind: "FittableRows", name:"panel", fit: true, components: [{content: "Name: ", style:"float:left;padding: 0px 0 0px 500px;"}, 
			{classes: "onyx-toolbar-inline", components: [
			{kind: "onyx.InputDecorator", components: [
				{kind: "onyx.Input", disabled: true, value: "Service to be deleted"}
			]} , 
			{content: "Are you sure you want to delete this service? ", style:"float:left;padding: 0px 0 0px 500px;"},
			
	    ]}]},
	    
		{kind: "onyx.Toolbar",style:"background:#b1c2d7;border:1px solid #375d8c;background-size:contain;color:#375d8c", components: [ {kind: "onyx.Button",style:"background-color:#FFFFFF;color:#375d8c;border-color:#375d8c" ,content: "Delete", ontap: "newAccount"} , {kind: "onyx.Button", content: "Cancel", style:"float:right;background-color:#FFFFFF;color:#375d8c;border-color:#375d8c", ontap: "cancelAction"} ]}
	],
	
	selectedAccount: function(sender, event){
		this.doClickItem(results[event.index]);
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
		this.doCreateAcc();
	},
	setupItem: function(sender, event){
	   this.$.name.setContent("Service:" + i);
	   i++;
		},
	cancelAction:function (sender,event)
	{  
		this.doBack();
	},

	activate: function(sender, event){
		this.doClickItem();
	}
});