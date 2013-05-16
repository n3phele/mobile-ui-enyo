var results;
var i = 0;
enyo.kind({ 
	name:"AddService",
	kind: "FittableRows",
	fit: true,
	style: "padding: 0px;background:#fff",
	events: {
		onCreateAcc: "",
		onBack: "",
		onClickItem:""
	},
	components:[
		{kind: "onyx.Toolbar", classes: "toolbar-style",components: [  {kind: "onyx.Button",classes:"button-style-right",content: "Done", ontap: "newAccount"}, 
		{kind: "onyx.Button" ,content: "<", classes:"button-style-left", ontap: "cancelAction"},
		{ name: "title", content:"Add Service" }, {fit: true}]},
        {style:"margin: 3em auto;width:700px;", components:[
		{kind: "FittableRows", name:"panel", fit: true, components: [{classes: "onyx-toolbar-inline", components: [
		{content: "Name: ", style:"display:inline-block;padding-right:38px;margin-left:1px"},
			{kind: "onyx.InputDecorator", components: [
				{kind: "onyx.Input", name: "name", placeholder: ""}
			]}]}, //End Name1
			{components: [ 
			{content: "Description:",style:"display:inline-block;padding-right:4px;margin-left:0px"},
			{kind: "onyx.InputDecorator", components: [
				{kind: "onyx.Input", name: "description", placeholder: "",style:"width: 500px;"}
			]}]}
			
	    ]}]}	    
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
