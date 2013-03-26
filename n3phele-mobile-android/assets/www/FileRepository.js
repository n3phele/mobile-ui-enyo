enyo.kind({
	name: "FileRepository",
	classes: "enyo-unselectable enyo-fit",
	kind: "FittableRows",
	fit: true,
	style: "padding: 0px",
	data: [],
	events: {
		onSelectedItem: ""
	},
	components: [
{kind: "onyx.Toolbar", components: [ { name: "title", content:"Files" }, {fit: true}]},
		{kind: "Selection", onSelect: "select", onDeselect: "deselect"},
		{kind: "Scroller", fit: true, components: [
		      {name: "panel", components:[
		                                                                      
		     ]}
		]}
	],
	create: function(){
		this.inherited(arguments);
		var ajaxComponent = new enyo.Ajax({
			url: serverAddress+"repository",
			headers:{ 'authorization' : "Basic "+ this.uid},
			method: "GET",
			contentType: "application/x-www-form-urlencoded",
			sync: false, 
		}); 	
		ajaxComponent
		.go()
		.response(this, function(sender, response){
			
			response.elements = fixArrayInformation(response.elements);
			
			for(var i in fixArrayInformation(response.elements)){		
				var files;
				var ajax = new enyo.Ajax({
					url: fixArrayInformation(response.elements)[i].uri+"/list",
					headers:{ 'authorization' : "Basic "+ this.uid},
					method: "GET",
					contentType: "application/x-www-form-urlencoded",
					sync: false
				});
				ajax.go()
				.response(this, function(sender, response){
					//update files list
					response.crumbs.files = fixArrayInformation(response.files);			
					files = fixArrayInformation(response.files);
					//popup.delete();
				})
				.error(this, function(){
					console.log("Error to load the list of files");
					popup.delete();
				});		
			this.$.panel.createComponent({kind: "Node", name: fixArrayInformation(response.elements)[i].name, icon: "assets/folder.png", content: fixArrayInformation(response.elements)[i].name, expandable: true, expanded: false, onExpand: "nodeExpand", onNodeTap: "nodeTap", components: [
			       {content: files}                                                          
			    ]}).render();
			}
			this.$.panel.render();
			this.reflow();
			this.$.repositoryList.setCount(response.total);
			this.$.repositoryList.reset();
			
		})
		.error(this, function(){
			console.log("Error to load the list of repositories");
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
	nodeExpand: function(inSender, inEvent) {
		inSender.setIcon("assets/" + (inSender.expanded ? "folder-open.png" : "folder.png"));
	},
	nodeTap: function(inSender, inEvent) {
		var node = inEvent.originator;
		this.$.selection.select(node.id, node);
this.selected = this.data[inEvent.index];
		
		this.doSelectedItem(this.selected);
	},
	select: function(inSender, inEvent) {
		inEvent.data.$.caption.applyStyle("background-color", "lightblue");
	},
	deselect: function(inSender, inEvent) {
		inEvent.data.$.caption.applyStyle("background-color", null);
	}
});