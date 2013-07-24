/*** The main classes that mount the account list page  ****/

enyo.kind({ 
	name:"AccountList",
	kind: "FittableRows",
	fit: true,
	
	results:null,
	datainfo:null,
	style: "padding: 0px",
	events: {
		onCreateAcc: "",
		onClickItem:"",
		onBack:""
	}, 
components:[
		{kind: "onyx.Toolbar", classes:"toolbar-style", name: "toolTop", components: [ { name: "title", content:"Accounts" }, {kind: "onyx.Button", classes:"button-style-right", content: "+", style: "font-size: 20px !important;font-weight: bold;", ontap: "newAccount"}]},		 
				    {name: "values", style:"font-weight: bold;padding-left:13px;margin: 0.3em auto", components:[  
					       {content: "Name", style:"display: inline-block; width:26%;font-weight: bold"}, 
					       {content: "Last 24 hours", style:"display: inline-block; width:24%;font-weight: bold"}, 
					       {content: "Active", style:"display: inline-block; width:20%;font-weight: bold"},
					       {content: "Cloud", style:"display: inline-block; width:25%;font-weight: bold"},					
					]},						
	    {name: "list", kind: "List", count: 1, touch: true,  multiSelect: false, fit: true, style:"height:87%;border-top: 2px solid #768BA7", onSetupItem: "setupItem", components: [
	         {name: "item", style: "padding: 10px 0 10px 10px;margin:auto;border:1px solid rgb(217,217,217)", ontap: "selectedAccount", components: [
	         	{name: "name", style:"width: 26%; display: inline-block"} , 
				{name: "cost",  style:"width:24%; display: inline-block;" } , 
				{name: "active",  style:"width:20%; display: inline-block" } ,
				{name: "cloud", style:"width:18%; display: inline-block" },
				{name: "icon2", kind: "onyx.IconButton",style:"float:right;margin-right:-11px",src: "assets/next.png", ontap: "nextItem"} 	    				
	         ]}
	     ]}, 
	],
	create: function(){
		this.inherited(arguments)
		var popup = new spinnerPopup();
		popup.show();
		
		var thisPanel = this;
			if (this.closePanel.isScreenNarrow()) {
		this.createComponent({kind: "onyx.Button",classes:"button-style-left", content: "Menu", ontap: "backMenu", container: this.$.toolTop}).render();
		}
		
		var ajaxComponent = new enyo.Ajax({
			url: serverAddress+"account/accountData",
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
		/////
		
		var ajaxComponent = new enyo.Ajax({
			url: serverAddress+"account/",
			headers:{ 'authorization' : "Basic "+ this.uid},
			method: "GET",
			contentType: "application/x-www-form-urlencoded",
			sync: false, 
		}); 
				
		ajaxComponent.go()
		.response(this, function(sender, response){
			response.elements = fixArrayInformation(response.elements);
			datainfo = response.elements;
			
		})
		.error(this, function(){
			console.log("Error to load the detail of the command!");
			popup.delete();
		});	
		
		
		this.render();
	},
	selectedAccount: function(sender, event){
	var description = "";
	
	for (var i=0;i<datainfo.length;i++)
		{ 
        if(datainfo[i].uri == results[event.index].uriAccount) description = datainfo[i].description;
		}
		console.log(results[event.index]);
		
		
        var myObject = new Object();
		myObject.accountName = results[event.index].accountName;
		myObject.actives = results[event.index].actives;
		myObject.cloud = results[event.index].cloud;
		myObject.cost = results[event.index].cost;
		myObject.uriAccount = results[event.index].uriAccount;
		myObject.description = description;
		
 		this.doClickItem(myObject);
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
		this.$.name.setContent(item.accountName);
		this.$.cost.setContent(item.cost);
		this.$.active.setContent(item.actives);
		this.$.cloud.setContent(item.cloud);
		if( event.index % 2 == 1)
	   {
	   this.$.item.applyStyle("background-color", "#F7F7F7")
	   };
         if( event.index % 2 == 0)
	   {
	   this.$.item.applyStyle("background-color", "white")
	   };
	},
	backMenu: function( sender , event){
		this.doBack(event);
	},
	activate: function(sender, event){
		this.doClickItem();
	}
});