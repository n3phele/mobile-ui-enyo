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
		{kind: "onyx.Toolbar", classes: "toolbar-style",components: [  {kind: "onyx.Button",classes:"button-style-right",content: "Done", ontap: "newService"}, 
		{kind: "onyx.Button" ,content: "Services", classes:"button-style-left", ontap: "cancelAction"},
		{name: "title", content:"New Service", style:"padding-left:20px" }, {fit: true}]},        
		{kind: "FittableRows", name:"panel", fit: true, components: [
				{style:"text-align:center;margin:2em auto", components:[							
					{kind: "onyx.InputDecorator",style:"border:1px solid #9A9A9A;width:90%;margin-bottom:10px", components: [
							{kind: "onyx.Input", name: "name",style:"float:left", placeholder: "Service name"}
					]},
					{kind: "onyx.InputDecorator",style:"border:1px solid #9A9A9A;width:90%;margin-bottom:10px", components: [
							{kind: "onyx.Input", name: "description",style:"float:left", placeholder: "Service description"}
					]}
				]},				
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
		var  name = this.$.name.getValue();
		var postJson = "{}";
		var ajaxComponent = new enyo.Ajax({
				url: "https://n3phele-dev.appspot.com/resources/process/exec?action=StackService&name="+name+"&arg=&parent=",
				headers:{ 'authorization' : "Basic "+ this.uid},
				method: "POST",
				contentType: "application/json",
				postBody: postJson,
				sync: false, 
				}); 
			
		ajaxComponent.go()
		.response( this, function(inSender, inResponse){
		console.log ("Sucesso");
		}).error( this, function(inSender, inResponse){
					console.log ("Erro");

		});
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
