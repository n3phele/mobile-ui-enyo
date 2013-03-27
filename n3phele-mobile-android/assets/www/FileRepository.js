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
	n3pheleClient: new N3pheleClient(),
	create: function(){
		this.inherited(arguments);
		
		//the authentication header
		this.n3pheleClient.uid = this.uid;
			
		var error = function()
		{
			
		}
		
		var thisPanel = this;
		var success = function(files)
		{
			for(var i in files){	
				var file = files[i];
				thisPanel.createComponent({kind: "Node", name: file.name, object: file, icon: "assets/folder.png", content: file.name, expandable: true, expanded: false, onExpand: "nodeExpand", onNodeTap: "repositoryTap", container: thisPanel.$.panel, components: [
			                                                 
			    ]}).render();
			}
			thisPanel.$.panel.render();
			thisPanel.reflow();
		}
		
		this.n3pheleClient.listRepositories(success, error);
			
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
		console.log("node expand event");
		
		console.log(inSender, inEvent);
	},
	repositoryTap: function(inSender, inEvent) {
		var thisPanel = this;
		
		//Assuming that all values must be placed inside component (none of them already exist)
		var success = function(files)
		{		
			for(var i in files){	
				var file = files[i];
				
				if( file.mime == "application/vnd.com.n3phele.PublicFolder")
				{
					inSender.createComponent({ content: file.name, file: file, onNodeTap: "fileTap", icon: "assets/folder.png", onExpand: thisPanel.nodeExpand , container: inSender, expandable: true, expanded: false });
				}
				else
				{
					inSender.createComponent({ content: file.name, file: file, onNodeTap: "fileTap", icon: "assets/file.png", container: inSender });
				}
				
				//keep track of files count that were added
				inSender.filesCount = files.length;
			}
			thisPanel.$.panel.render();
			thisPanel.reflow();
		}
		
		var error = function() {}
		
		//Just check if element has files already
		if(!inSender.filesCount || inSender.filesCount <= 0)
		{
			this.n3pheleClient.listRepositoryFiles( inSender.object ,success, error);		
		}
		
		inSender.reflow();
	},
	fileTap: function(inSender,inEvent) {
		console.log("file tap");
	},
	select: function(inSender, inEvent) {
		inEvent.data.$.caption.applyStyle("background-color", "lightblue");
	},
	deselect: function(inSender, inEvent) {
		inEvent.data.$.caption.applyStyle("background-color", null);
	}
});