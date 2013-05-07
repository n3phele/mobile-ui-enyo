var results;
var i = 0;
enyo.kind({ 
	name:"AddService",
	kind: "FittableRows",
	fit: true,
	style: "padding: 0px",
	events: {
		onCreateAcc: "",
		onBack: "",
		onClickItem:""
	},
	components:[
		{kind: "onyx.Toolbar",style:"background:#b1c2d7;border:1px solid #375d8c;background-size:contain;color:#375d8c", components: [ { name: "title", content:"Add Service" }, {fit: true}]},
        {style:"margin: 3em auto;width:700px;", components:[
		{kind: "FittableRows", name:"panel", fit: true, components: [{classes: "onyx-toolbar-inline", components: [
		{content: "Name: ", style:"display:inline-block"},
			{kind: "onyx.InputDecorator", components: [
				{kind: "onyx.Input", name: "name", placeholder: ""}
			]}]}, //End Name1
			{components: [ 
			{content: "Description:",style:"display:inline-block"},
			{kind: "onyx.InputDecorator", components: [
				{kind: "onyx.Input", name: "description", placeholder: "",style:"width: 500px;"}
			]}]}
			
	    ]}]},
	    
		{kind: "onyx.Toolbar",style:"background:#b1c2d7;border:1px solid #375d8c;position:absolute;bottom:0;width:100%;background-size:contain;color:#375d8c;clear: both", components: [ {kind: "onyx.Button",style:"background-color:#FFFFFF;color:#375d8c;border-color:#375d8c" ,content: "Create", ontap: "newAccount"} , {kind: "onyx.Button" ,content: "Cancel", style:"float:right;background-color:#FFFFFF;color:#375d8c;border-color:#375d8c", ontap: "cancelAction"} ]}
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
	newService: function(sender, event){
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
