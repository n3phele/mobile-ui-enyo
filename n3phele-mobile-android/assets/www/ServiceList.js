
enyo.kind({ 
	name:"ServiceList",
	kind: "FittableRows",
	fit: true,
	results:null,
	
	style: "padding: 0px",
	events: {
		onCreateService: "",
		onRemoveService: "",
		onClickService:"",
		onBack:""
	},
	components:[
		{name:"toolBar",  classes: "toolbar-style", kind: "onyx.Toolbar", components: [ { name: "title", content:"Services" }, {kind: "onyx.Button",  content: "+", ontap: "newService", style: "font-size: 20px !important;font-weight: bold;", classes:"button-style-right"},{fit: true}]},
		  {name: "Spin",kind:"onyx.Spinner",classes: "onyx-light",style:" margin-top:100px;margin-left:45%"},
		    {name: "list", kind: "List", touch: true,  multiSelect: false, style:"height:80%;", fit: true, onSetupItem: "setupItem" , components: [
	         {name: "item", style: "padding: 10px 0 10px 10px; margin:auto; border:1px solid rgb(200,200,200)", ontap: "selectedService", components: [
	         	{name: "name", style:"width: 75%; display: inline-block"},
		        {name: "icon2", kind: "onyx.IconButton",style:"float:right",src: "assets/next.png"} 
	         ]}
	     ]},	  {tag: "br"},
		{name: "Msg", style: "color:#FF4500; text-align:center"},
		{tag: "br"},
   		 
		
	],	
	create: function(){
	this.inherited(arguments);
		this.$.Spin.show();

          var listSize;
			var thisPanel = this;
			if (this.closePanel.isScreenNarrow()) {
		     this.createComponent({kind: "onyx.Button", classes:"button-style-left", content: "Menu", ontap: "backMenu", container: this.$.toolBar}).render();
		} 
			var ajaxParams = {
				url: serverAddress+"process/activeServiceActions",
				headers:{ 'authorization' : "Basic "+ this.uid},
				method: "GET",
				contentType: "application/x-www-form-urlencoded",
				sync: false, 
			};	
			var ajaxComponent = new enyo.Ajax(ajaxParams); //connection parameters		
			ajaxComponent
			.go()
			.response( this, "processActions" )
			.error( this, function(){
						this.$.Msg.setContent("Error to load recent activities!!!");
                        this.$.Spin.hide();});
		results = new Array();
	},
	selectedService: function(sender, event){
	//Service details will have the delete opt
		this.doClickService(results[event.index]);
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
	   this.$.name.setContent(listSize[event.index].name);
	   results.push(listSize[event.index]);
	   
	   if( event.index % 2 == 1)
	   {
	   this.$.item.applyStyle("background-color", "#F7F7F7")
	   };
         if( event.index % 2 == 0)
	   {
	   this.$.item.applyStyle("background-color", "white")
	   };

	  },
	  
	  processActions: function( request, response){		
			if(response.total == 0){				
				this.$.list.applyStyle("display", "none !important");
				this.reflow();
					this.$.Spin.hide();
								this.$.Msg.setContent("No current Services in the list!");

				
				return; 
			}
			response.elements = fixArrayInformation(response.elements);
			listSize = response.elements;
			this.$.list.setCount(listSize.length);
		    this.$.list.reset();
			this.$.Spin.hide();
		},
	backMenu: function (sender, event){
		this.doBack();
	}
});
