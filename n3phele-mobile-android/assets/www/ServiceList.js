var results;

enyo.kind({ 
	name:"ServiceList",
	kind: "FittableRows",
	fit: true,
	style: "padding: 0px",
	events: {
		onCreateService: "",
		onRemoveService: "",
		onClickService:"",
		onBack:""
	},
	components:[
		{name:"toolBar",  classes: "toolbar-style", kind: "onyx.Toolbar", components: [ { name: "title", content:"Services" }, {kind: "onyx.Button",  content: "+", ontap: "newService", style: "font-size: 20px;font-weight: bold;", classes:"button-style-right"},{fit: true}]},
	    {name: "list", kind: "List", count: 100, touch: true,  multiSelect: false, style:"height:80%; border-top: 2px solid #88B0F2", fit: true, onSetupItem: "setupItem" , components: [
	         {name: "item", style: "padding: 10px 0 10px 10px; margin:auto; border:1px solid rgb(200,200,200)", components: [
	         	{name: "name", style:"width: 75%; display: inline-block",ontap: "selectedAccount"},
		        {name: "icon2", kind: "onyx.IconButton",style:"float:right",src: "assets/next.png", ontap: "nextItem"} 
	         ]}
	     ]}, 
	],	
	create: function(){
	this.inherited(arguments);
			var thisPanel = this;
			if (this.closePanel.isScreenNarrow()) {
		     this.createComponent({kind: "onyx.Button", classes:"button-style-left", content: "Menu", ontap: "backMenu", container: this.$.toolBar}).render();
		}
		
		results = new Array();
	},
	selectedAccount: function(sender, event){
	//Service details will have the delete opt
	   var obj =  new Object();
		obj.name = results[event.index];
		this.doClickService(obj);
 
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
		this.doCreateService();
	},
	setupItem: function(sender, event){
	   this.$.name.setContent("Service:" + event.index);
	   results.push(this.$.name.getContent());
	   //console.log("Testando com" + event.index + "resultado de" + event.index % 2);
	   if( event.index % 2 == 1)
	   {
	   this.$.item.applyStyle("background-color", "#F7F7F7")
	   };
         if( event.index % 2 == 0)
	   {
	   this.$.item.applyStyle("background-color", "white")
	   };
	   },
	backMenu: function (sender, event){
		this.doBack();
	},


});
