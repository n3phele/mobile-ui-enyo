/*** The main classes that mount the account list page  ****/
enyo.kind({ 
	name:"RepositoryFileList",
	kind: "FittableRows",
	fit: true,
	style: "padding: 0px",
	data: [],
	events: {
		onSelectedItem: "",
		onBack: ""
	},
	components:[
		{kind: "onyx.Toolbar", components: [ { name: "title", content:"Repositories" }, {fit: true}]},
		                                                		
		{name: "groupbox", classes: "table", fit:true, kind: "onyx.Groupbox", style: "width: 80%;margin:auto;", components: [
			{name: "header", kind: "onyx.GroupboxHeader", classes: "groupboxBlueHeader", content: "List of Files"},
			{classes: "subheader", style:"background-color: rgb(200,200,200);font-weight: bold;font-size:13px;", components:[ //subheader
			  {content: "Name", style:"width: 25%; display: inline-block;"}
            ]},			
			{name: "list", kind: "List", fit: true, touch:true, count: 0, onSetupItem: "setupItem", style: "margin: auto;border-style:none;max-height:70%", components: [
			  {name: "item", classes: "item", ontap: "itemTap", style: "background-color:white; box-shadow: -4px 0px 4px rgba(0,0,0,0.3);", components: [
			    {content: "Name", name: "name", classes: "subsubheader", style:"width:50%; display: inline-block;"}
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
			url: this.uri + "/list",
			headers:{ 'authorization' : "Basic "+ this.uid},
			method: "GET",
			contentType: "application/x-www-form-urlencoded",
			sync: false, 
		});
				
		ajaxComponent.go()
		.response(this, function(sender, response){
	
			response.crumbs.files = fixArrayInformation(response.files);
			
			this.data = response.files;
						
			this.$.list.setCount(response.files.length);
			//this.$.list.applyStyle("height",response.files.length*21 + "px");
			this.$.list.reset();
			
			popup.delete();
		})
		.error(this, function(){
			console.log("Error to load the list of files");
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
		//sender.parent.parent.parent.parent.setIndex(0);
		this.doBack(event);
	},
	setupItem: function(inSender, inEvent) {
	    // given some available data.
	    var data = this.data[inEvent.index];
		
	    this.$.name.setContent(data.name);
	},
	itemTap: function(inSender, inEvent) {
		this.selected = this.data[inEvent.index];
		
		console.log(this.selected);
		
		this.doSelectedItem(this.selected);
	}
	
})