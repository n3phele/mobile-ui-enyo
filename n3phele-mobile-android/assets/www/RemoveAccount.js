
var results;
var i = 0;
enyo.kind({ 
	name:"RemoveAccount",
	kind: "FittableRows",
	fit: true,
	style: "padding: 0px;background:#fff",
	events: {
		onDelete: "",
		onBack: "",
		onClickItem:""
	},
		components:[
		{kind: "onyx.Toolbar",classes:"toolbar-style", components: [
				{kind: "onyx.Button",classes:"button-style-right",content: "OK", ontap: "deleteAccount"} , 
				{kind: "onyx.Button", content: "Account Detail", classes:"button-style-left", ontap: "cancelAction"} ,
				{ name: "title", content:"Remove Account", }, {fit: true}]},
		{style:"text-align:center;margin:3em auto", components:[		
			{kind: "FittableRows", name:"panel", fit: true, components: [
				{name:"account",content: "Account"},				
			]},
	    ]},		
	],
	create: function() {
		this.inherited(arguments);
		
		
		this.$.account.setContent("Are you sure you want to delete " + this.account.name + "   ?");
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
	deleteAccount: function(sender, event){
		var ajaxComponent = new enyo.Ajax({
			url: this.account.uri,
			headers:{ 'authorization' : "Basic "+ this.uid},
			method: "DELETE",
			contentType: "application/x-www-form-urlencoded",
			sync: true, 
		}); 		
		ajaxComponent.go()
		.response()
		.error(this, function(){
			console.log("Error to delete the detail of the command!");
		});	
		console.log(this.uid);
		console.log(this.account.uri);
		this.doDelete();
	},

	cancelAction:function (sender,event)
	{  
		this.doBack();
	},

	activate: function(sender, event){
		this.doClickItem();
	}
});