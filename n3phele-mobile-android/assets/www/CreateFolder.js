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
		{kind: "onyx.Toolbar", classes: "toolbar-style",components: [{kind: "onyx.Button",classes:"button-style-right",content: "Done", ontap: "newFolder"}, 
		{kind: "onyx.Button" ,content: "Repository", classes:"button-style-left", ontap: "cancelAction"},
		{ name: "title", content:"Create Folder" }, {fit: true}]},
		{style:"text-align:center;padding-top: 3%;",components:[	
			{kind: "onyx.InputDecorator",classes: "inputs", components: [
				{kind: "onyx.Input", name: "name", style:"float:left;padding:7px 0 0 10px",  placeholder: "Folder name"}
			]} //End Name1 
			]}  
	],
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
	newFolder: function(sender, event){
		console.log(this.uri);
		var ajaxParams = {
				url: this.uri+"/list",
				headers:{ 'authorization' : "Basic "+ this.uid},
				method: "POST",
				contentType: "application/x-www-form-urlencoded",
				sync: false, 
			};
		var ajaxComponent = n3phele.ajaxFactory.create(ajaxParams); //connection parameters
		ajaxComponent
		.go({ //We need to test this!!
		})
		.response( this, function(inSender, inResponse){
		}).error( this, function(inSender, inResponse){
		});
	},
	cancelAction:function (sender,event)
	{  
		this.doBack();
	},

	activate: function(sender, event){
		this.doClickItem();
	}
});
