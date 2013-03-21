/*** The main classes that mount the account list page  ****/
enyo.kind({ 
	name:"RepositoryFileList",
	kind: "FittableRows",
	fit: true,
	repositoryName: "",
	path: [],
	style: "padding: 0px",
	data: [],
	events: {
		onSelectedItem: "",
		onBack: ""
	},
	components:[
		{kind: "onyx.Toolbar", components: [ { name: "title", content:"Files" }, {fit: true}]},
		
		{ name:"path", components: [ { name: "repositoryRoot", kind: "enyo.Button", ontap: "folderClicked" } ] },
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
		
		this.$.repositoryRoot.setContent( this.repositoryName );
		this.path.push( this.$.repositoryRoot );
		this.updateFilesFromURI(this.uri + "/list", function(){ popup.delete(); });
	},
	updateFilesFromURI: function(uri, success){
		var ajaxComponent = new enyo.Ajax({
			url: uri,
			headers:{ 'authorization' : "Basic "+ this.uid},
			method: "GET",
			contentType: "application/x-www-form-urlencoded",
			sync: false
		});
		
		ajaxComponent.go()
		.response(this, function(sender, response){
			//update files list
			response.crumbs.files = fixArrayInformation(response.files);			
			this.data = response.files;
						
			this.$.list.setCount(response.files.length);
			this.$.list.reset();
			
			if(success) success();
			
			//popup.delete();
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
	folderMime: "application/vnd.com.n3phele.PublicFolder",
	itemTap: function(inSender, inEvent) {
		this.selected = this.data[inEvent.index];
		
		//If is a folder, open it
		if(this.selected.mime == this.folderMime)
		{
			//put on path
			var newButton = this.createComponent( { kind: "enyo.Button", content: this.selected.name, container: this.$.path } ).render();
			this.path.push( newButton );
			this.reflow();
			
			//download the new folder to data
			this.updateFilesFromURI(this.uri + '/list?prefix=' + this.selected.name + '%2F');
		}
		
		this.doSelectedItem(this.selected);
	},
	folderClicked: function(inSender,inEvent){
		this.navigateBack(inSender.content);
	},
	navigateBack: function(folder){
		//navigate back to repository/folder specified that is already on path
		while(this.path[this.path.length-1].getContent() != folder)
		{
			var button = this.path.pop();
			button.destroy();
		}
		
		var newUri = this.uri + '/list';
		if( this.path.length > 1 )
		{
			var prefix = "";
			newUri = newUri + '?prefix='
			for (var i=1;i<this.path.length;i++)
			{ 
				prefix = prefix + this.path[i].getContent() + '%2F';
			}
		}
		this.updateFilesFromURI(newUri);
	}
})