enyo.kind({
	name: "FileRepository",
	classes: "enyo-unselectable enyo-fit",
	kind: "FittableRows",
	fit: true,
	style: "padding: 0px",
	data: [],
	events: {
		onSelectedItem: "",
		onNewRepository: ""
	},
	components: [
		{kind: "onyx.Toolbar", components: [ { name: "title", content:"Files" }, {fit: true}]},
		{kind: "Selection", onSelect: "select", onDeselect: "deselect"},
		{kind: "Scroller", fit: true, components: [
		      {name: "panel", components:[
		                                                                      
		     ]}
		]},
		{kind: "onyx.Toolbar", components: [ {kind: "onyx.Button", content: "Create New Repository", ontap: "newrepo"}]},
	],
	constructor: function(args) {
        // low-level or esoteric initialization, usually not needed at all
        this.inherited(arguments);
		
		//Dependency Injection
		if(args.n3pheleClient)
		{
			this.n3pheleClient = args.n3pheleClient;
		}
    },
	create: function(){
	
		this.inherited(arguments);
			
		if( !this.n3pheleClient )
		{
			this.n3pheleClient = new N3pheleClient();
		}		
		
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
				//thisPanel.createComponent({kind: "Node", name: "repository_" + file.name , object: file, type: "repository", icon: "assets/folder.png", content: file.name, expandable: true, expanded: false, onExpand: "nodeExpand", onNodeTap: "nodeTap", container: thisPanel.$.panel, components: [                               
			   // ]}).render();
				thisPanel.createComponent({kind: "onyx.IconButton", ontap:"iconTapped", container: thisPanel.$.panel, components: [
				                                                                                     {name: "icon", kind: "Image", src: "assets/folderG.png"},
				                                                                                 	{tag: "br"},
				                                                                                 		{content: file.name}
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
		inEvent.originator.setIcon("assets/" + (inSender.expanded ? "folder-open.png" : "folder.png"));
	},
	nodeTap: function(inSender, inEvent) {
		var node = inEvent.originator;
		this.$.selection.select(node.id, node);
		
		if (node.type == "repository")
		{
			this.repositoryTap(inSender);
		}
		else if (node.type == "folder")
		{
			this.folderTap(node);
		}
	},
	createFunctionAddFilesOnNodeAndUpdatePanel: function(node, panel) {
		//Assuming that all values must be placed inside component (none of them already exist)
		return function(files)
		{
			for(var i in files){
				var file = files[i];
				
				if( file.mime == "application/vnd.com.n3phele.PublicFolder" )
				{
					node.createComponent({ content: file.name, type: "folder", object: file, icon: "assets/folder.png", container: node, expandable: true, expanded: false });
				}
				else
				{
					node.createComponent({ content: file.name, type: "file", object: file, icon: "assets/file.png", container: node });
				}
				
				//keep track of files count that were added
				node.filesCount = files.length;
			}
			panel.$.panel.render();
			panel.reflow();
		}
	},
	folderTap: function(folder){
		var thisPanel = this;		
		var success = this.createFunctionAddFilesOnNodeAndUpdatePanel(folder, thisPanel);		
		var error = function() {}
		
		//Just check if element has files already
		if(!folder.filesCount || folder.filesCount <= 0)
		{
			this.n3pheleClient.listFolderFiles( folder.object ,success, error);
		}
		
		folder.reflow();
	},
	repositoryTap: function(repository) {
		var thisPanel = this;
		var success = this.createFunctionAddFilesOnNodeAndUpdatePanel(repository, thisPanel);
		var error = function() {}
		
		//Just check if element has files already
		if(!repository.filesCount || repository.filesCount <= 0)
		{
			this.n3pheleClient.listRepositoryFiles( repository.object ,success, error);
		}
		
		repository.reflow();
	},
	select: function(inSender, inEvent) {
		inEvent.data.$.caption.applyStyle("background-color", "lightblue");
	},
	deselect: function(inSender, inEvent) {
		inEvent.data.$.caption.applyStyle("background-color", null);
	},
	newrepo: function(sender, event){
		console.log("New repo");
		this.doNewRepository();
	}
});