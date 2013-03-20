/*** The main classes that mount the account list page  ****/
enyo.kind({ 
	name:"RepositoryList",
	kind: "FittableRows",
	fit: true,
	style: "padding: 0px",
	data: [],
	events: {
		onSelectedItem: ""
	},
	components:[
		{kind: "onyx.Toolbar", components: [ { name: "title", content:"Repositories" }, {fit: true}]},
		                                                		
		{name: "groupbox", classes: "table", kind: "onyx.Groupbox", style: "width: 80%;margin:auto; height: 100%", components: [
			{name: "header", kind: "onyx.GroupboxHeader", classes: "groupboxBlueHeader", content: "List of repositories"},
			{classes: "subheader", style:"background-color: rgb(200,200,200);font-weight: bold;font-size:13px;", components:[ //subheader
			  {content: "Name", style:"width: 25%; display: inline-block;"} , 
			  {content: "Description",  style:"width:25%; display: inline-block;" } ,
            ]},
			{kind: "List", name:"repositoryList", fit: true, count: 0, onSetupItem: "setupItem", style: "height: 0px", components: [
			  {classes: "item", ontap: "itemTap", style: "background-color:white", components: [
			    {content: "Name", name: "name", classes: "subsubheader",  style:"width:25%; display: inline-block;"},
			    {content: "Description", name: "description", classes: "subsubheader",  style:"width:25%; display: inline-block;" },
			  ]}
		    ]}
		]},
		
		{kind: "onyx.Toolbar", components: [ {kind: "onyx.Button", content: "Close", ontap: "backMenu"} ]}
	],
	create: function(){
		this.inherited(arguments)
		var popup = new spinnerPopup();
		popup.show();
		
		var ajaxComponent = new enyo.Ajax({
			url: serverAddress+"repository",
			headers:{ 'authorization' : "Basic "+ this.uid},
			method: "GET",
			contentType: "application/x-www-form-urlencoded",
			sync: false, 
		}); 
				
		ajaxComponent.go()
		.response(this, function(sender, response){
	
			response.elements = fixArrayInformation(response.elements);
			
			this.data = response.elements;
						
			this.$.repositoryList.setCount(response.total);
			this.$.repositoryList.applyStyle("height",response.total*21 + "px");
			this.$.repositoryList.reset();
			
			popup.delete();
		})
		.error(this, function(){
			console.log("Error to load the detail of the command!");
			popup.delete();
		});		
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
	backMenu: function( sender , event){
		sender.parent.parent.parent.parent.setIndex(0);
	},
	setupItem: function(inSender, inEvent) {
	    // given some available data.
	    var data = this.data[inEvent.index];
	    this.$.name.setContent(data.name);
	    this.$.description.setContent(data.description);
	},
	itemTap: function(inSender, inEvent) {
		this.selected = this.data[inEvent.index];
		
		this.doSelectedItem(this.selected);
	}
	
})