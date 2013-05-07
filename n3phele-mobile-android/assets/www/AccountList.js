/*** The main classes that mount the account list page  ****/
var results;
enyo.kind({ 
	name:"AccountList",
	kind: "FittableRows",
	fit: true,
	style: "padding: 0px",
	events: {
		onCreateAcc: "",
		onClickItem:""
	},
	components:[
		{kind: "onyx.Toolbar", components: [ { name: "title", content:"Accounts" }, {fit: true}]},

		{kind: "FittableRows", name:"panel",style:"height:6%",fit: true, components: [	        
				    {name: "values", style:"margin:auto; font-weight: bold;", components:[ 
					       {content: "Name", style:"display: inline-block; width:25%;font-weight: bold"}, 
					       {content: "Last 24 hours", style:"display: inline-block; width:25%;font-weight: bold"}, 
					       {content: "Active", style:"display: inline-block; width:25%;font-weight: bold"},
					       {content: "Cloud", style:"display: inline-block; width:25%;font-weight: bold"},					
					]},						
	    ]},
	    {name: "list", kind: "List", count: 10, touch: true,  multiSelect: false, style:"height:90%;border-top: 2px solid #88B0F2", onSetupItem: "setupItem", components: [
	         {name: "item", style: "padding: 10px 0 10px 10px;margin:auto; background-color: white; border:1px solid rgb(200,200,200)", ontap: "selectedAccount", components: [
	         	{name: "name", style:"width: 25%; display: inline-block"} , 
				{name: "cost",  style:"width:25%; display: inline-block;" } , 
				{name: "active",  style:"width:25%; display: inline-block" } ,
				{name: "cloud", style:"width:25%; display: inline-block" }	    
	         ]}
	     ]}, 
		{kind: "onyx.Toolbar",style:"background:#b1c2d7;border:1px solid #375d8c;position:absolute;bottom:0;width:100%;background-size:contain;color:#375d8c;", components: [ {kind: "onyx.Button", content: "Create New Account", ontap: "newAccount"} ]}
	],
	create: function(){
		this.inherited(arguments)
		var popup = new spinnerPopup();
		popup.show();
		
		var ajaxComponent = new enyo.Ajax({
			url: serverAddress+"account",
			headers:{ 'authorization' : "Basic "+ this.uid},
			method: "GET",
			contentType: "application/x-www-form-urlencoded",
			sync: false, 
		}); 
				
		ajaxComponent.go()
		.response(this, function(sender, response){
			response.elements = fixArrayInformation(response.elements);
			results = response.elements;
			this.$.list.setCount(results.length);
			this.$.list.reset();
		})
		.error(this, function(){
			console.log("Error to load the detail of the command!");
			popup.delete();
		});		
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
		if(results == null ) return;
		this.$.item.addRemoveClass("onyx-selected", sender.isSelected(event.index));
		var i = event.index;
		var item = results[i];
		this.$.name.setContent(item.name);
		this.$.cost.setContent("US$0.0");
		this.$.active.setContent("0");
		this.$.cloud.setContent(item.cloudName);
	},
	activate: function(sender, event){
		this.doClickItem();
	}
});