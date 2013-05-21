enyo.kind({ 
	name:"RemoveRepository",
	kind: "FittableRows",
	fit: true,
	style: "padding: 0px",
	 style:"background:#fff",
	events: {
		onCreateAcc: "",
		onBack: "",
		onClickItem:""
	},
		components:[
		{kind: "onyx.Toolbar",classes:"toolbar-style", components: [
				{kind: "onyx.Button",classes:"button-style-right",content: "Delete", ontap: "newAccount"} , 
				{kind: "onyx.Button",classes:"button-style-left", content: "Repository List", ontap: "cancelAction"},	
				{ name: "title", content:"Delete Repository", }, {fit: true}]},
		{style:"margin: 3em auto;width:400px;", components:[		
			{kind: "FittableRows", name:"panel", fit: true, components: [
				{name:"name",content: "Repository", style:"display:inline-block"}, 
				
				/*{kind: "onyx.InputDecorator", style:"display:inline-block;margin-left:10px", components: [
					{kind: "onyx.Input",name:"service", disabled: true, value: "Service to be deleted"}
				]} ,*/ 
				//{content: "Are you sure you want to delete this service? "},
				
			]},
	    ]},
	],
	create: function() {
		this.inherited(arguments);
		;
	//"Are you sure you want to delete" + outratela.param +  " ?" 
		this.$.name.setContent("Are you sure you want to delete " + this.repository.name + " ?");
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
		var ajaxComponent = new enyo.Ajax({
			url: this.uri,
			headers:{ 'authorization' : "Basic "+ this.uid},
			method: "DELETE",
			contentType: "application/x-www-form-urlencoded",
			sync: false, 
		}); 		
		ajaxComponent.go()
		.response()
		.error(this, function(){
			console.log("Error to delete the detail of the command!");
		});	
		this.doBack(event);
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