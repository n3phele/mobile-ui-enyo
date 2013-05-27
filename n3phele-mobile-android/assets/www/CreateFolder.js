enyo.kind({ 
	name:"CreateFolder",
	kind: "FittableRows",
	fit: true,
	style: "padding: 0px;background:#fff",
	events: {
		onCreateAcc: "",
		onBack: "",
		onClickItem:""
	},
	components:[
		{kind: "onyx.Toolbar", classes: "toolbar-style",components: [{kind: "onyx.Button",classes:"button-style-right",content: "Done", ontap: "newAccount"}, 
		{kind: "onyx.Button" ,content: "Repository", classes:"button-style-left", ontap: "cancelAction"},
		{ name: "title", content:"Create Folder" }, {fit: true}]},
		{style:"text-align:center;padding-top: 3%;",components:[	
			{kind: "onyx.InputDecorator",classes: "inputs", components: [
				{kind: "onyx.Input", name: "name", style:"float:left;padding:7px 0 0 10px",  placeholder: "Folder name"}
			]} //End Name1 
			]}  
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
	
		},
	cancelAction:function (sender,event)
	{  
		this.doBack();
	},

	activate: function(sender, event){
		this.doClickItem();
	}
});
