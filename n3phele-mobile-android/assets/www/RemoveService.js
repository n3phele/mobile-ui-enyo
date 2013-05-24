var results;
var i = 0;
enyo.kind({ 
	name:"RemoveService",
	kind: "FittableRows",
	fit: true,
	style: "padding: 0px;background:#fff",
	events: {
		onCreateAcc: "",
		onBack: "",
		onClickItem:""
	},
		components:[
		{kind: "onyx.Toolbar",classes:"toolbar-style", components: [
				{kind: "onyx.Button",classes:"button-style-right",content: "OK", ontap: "newAccount"} , 
				{kind: "onyx.Button", content: "Service Detail", classes:"button-style-left", ontap: "cancelAction"} ,
				{ name: "title", content:"Remove Service", }, {fit: true}]},
		{style:"margin: 3em auto;width:400px;", components:[		
			{kind: "FittableRows", name:"panel", fit: true, components: [
				{name:"service",content: "Service ", style:"display:inline-block"}, 
				
				/*{kind: "onyx.InputDecorator", style:"display:inline-block;margin-left:10px", components: [
					{kind: "onyx.Input",name:"service", disabled: true, value: "Service to be deleted"}
				]} ,*/ 
				//{content: "Are you sure you want to delete this service? "},
				
			]},
	    ]},
		//{kind: "onyx.Toolbar",style:"background:#b1c2d7;border:1px solid #375d8c;position:absolute;bottom:0;width:100%;background-size:contain;color:#375d8c;clear: both"}
	],
	create: function() {
		this.inherited(arguments);
		
		
		this.$.service.setContent("Are you sure you want to delete " + this.service.name + "   ?");
	},
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