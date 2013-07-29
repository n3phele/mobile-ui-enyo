enyo.kind({ 
	name:"RemoveRepository",
	kind: "FittableRows",
	fit: true,
	style: "padding: 0px",
	 style:"background:#fff",
	events: {
		onCreateAcc: "",
		onBack: "",
		onDelete:"",
		onClickItem:""
	},
		components:[
		{kind: "onyx.Toolbar",classes:"toolbar-style", components: [
			{kind: "onyx.Button",classes:"button-style-right",content: "OK", ontap: "deleteRepository"} , 
			{kind: "onyx.Button",classes:"button-style-left",style:"margin-right:-4px",  content: "Repository List", ontap: "cancelAction"},	
			{ name: "title", content:"Delete Repository"}, 
			{fit: true}
		]},
		{style:"text-align:center;margin:3em auto", components:[		
			{kind: "FittableRows", name:"panel", fit: true, components: [
				{name:"name",content: "Repository"}, 
			]},
	    ]},
	],
	create: function() {
		this.inherited(arguments);

		this.$.name.setContent("Are you sure you want to delete " + this.repository.name + " ?");
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
	deleteRepository: function(sender, event){
		var ajaxComponent = n3phele.ajaxFactory.create({
			url: this.repository.originator.uri,
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
		//this.doBack(event);
		console.log(this.uid);
		console.log(this.repository.originator.uri);
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