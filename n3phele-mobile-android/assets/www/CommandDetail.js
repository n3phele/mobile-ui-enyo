/*** The main classes that mount the command detail page  ****/
enyo.kind({ 
	name:"CommandDetail",
	kind: "FittableRows",
	fit: true,
	files: "",
	classes: "onyx onyx-sample commandDetail",
	style: "padding: 0px",
	events: {
		onSelectedFile: "",
		onRunCommand: "runCommand"
	},
	components:[
		{kind: "onyx.Toolbar", components: [ { name: "title" }, {fit: true}]},

		{kind: "Panels", name:"panels", fit: true, classes: "panels-sample-sliding-panels panels", arrangerKind: "CollapsingArranger", wrap: false, components: [
			{name: "info", classes: "info", style: "width:15%;", components: [
				{kind: "Scroller", classes: "enyo-fit", touch: true, style: "width:90%;margin:auto;padding: 10px 0px;", components: [
				     {name: "icon", tag: "img", classes: "card onyx-selected", style: "width:40%;height:auto"},
				     {name: "cName", style: "margin-top: -10px;margin-bottom:15px; color: black;font-weight:bold"},
				     {name: "description"}
				]}
			]},
			{name: "params",classes: "params", fit: true, style: "padding: 0px",  components: [
				{name: "comScroll", kind: "Scroller", classes: "enyo-fit", touch: true, components: [
					
				]}
			]}
		]},
		{kind: "onyx.Toolbar", components: [{kind: "onyx.Button", content: "Close", ontap: "closePanel"}]}
	],
	create: function(){
		this.inherited(arguments)
		var popup = new spinnerPopup();
		popup.show();
		
		var ajaxComponent = new enyo.Ajax({
			url: this.uri,
			headers:{ 'authorization' : "Basic "+ this.uid},
			method: "GET",
			contentType: "application/x-www-form-urlencoded",
			sync: false, 
			}); 
				
		ajaxComponent.go()
		.response(this, function(sender, response){
			this.setDynamicData(response);
			popup.delete();
		})
		.error(this, function(){
			console.log("Error to load the detail of the command!");
			popup.delete();
		});		
	},
	setDynamicData: function( data ){
		this.$.title.setContent(data.name);
		this.$.icon.setSrc(this.icon);
		this.$.cName.setContent(data.name);
		this.$.description.setContent(data.description);
		
		//Parameters Groupbox
		if(typeof data.executionParameters != 'undefined')
			this.$.comScroll.createComponent({name: "paramGroup", kind:"commandParamGroup", "params": data.executionParameters});
	
		
		//Input files Groupbox
		if(typeof data.inputFiles != 'undefined')
			this.createComponent({kind:"commandFilesGroup", "lines": data.inputFiles, container: this.$.comScroll, files: this.files, onSelectedItem: "repository", "type" : "input"});

		//Output files Groupbox
		if(typeof data.outputFiles != 'undefined')
			this.$.comScroll.createComponent({kind:"commandFilesGroup", "lines": data.outputFiles, "type" : "output" });
		
		//Cloud list
		if( typeof data.cloudAccounts != 'undefined' )
			this.$.comScroll.createComponent({kind:"commandExecGroup", "uri" : this.uri, onRunCommand: "runCommand", "lines": data.cloudAccounts });				
		else
			this.$.comScroll.createComponent({kind:"commandExecGroup", "uri" : this.uri, "lines": new Array() });	

		//panel reflow
		if (enyo.Panels.isScreenNarrow())
			this.$.info.destroy();
		this.$.comScroll.render();
		this.$.panels.reflow();
	},
	repository: function(sender, event){
		this.doSelectedFile();
	},
	repositorySelected: function(inSender,inEvent){				
		this.$.repositoryFiles.destroy();
		this.createComponent({ kind: "RepositoryFileList", "uid": this.uid, "uri" : inEvent.uri, "repositoryName" : inEvent.name , onBack: "closeFilePanel", container: this.$.panelRepo }).render();
		this.reflow();
		this.$.panelRepo.reflow();
	},
	tabTap: function( sender, event ){
		var tabs = this.$.ul.components;
		for( var i in tabs ){
			var tabname = tabs[i].name;
			this.$[tabname].addRemoveClass("active", this.$[tabname].name == "li"+sender.index );
		}
		
		var divs = this.$.panels.components;
		for( var i in divs ){
			var divname = divs[i].name;
			this.$[divname].addRemoveClass("active", this.$[divname].name == "div"+sender.index );
		}
	},
	runCommand: function(sender, event){
		console.log("Run");
		
		//define post Boody
		var postBody = {"Variable":[{"name":"n", "type":"Long", "value":["1"]},{"name":"message", "type":"String", "value":["hello world!"]},{"name":"notify", "type":"Boolean", "value":["false"]},{"name":"account", "type":"Object", "value":["https://n3phele-dev.appspot.com/resources/account/218003"]}]};
		
		if(sender.parent.owner.$.job.getValue()!=""){	
			var ajaxComponent = new enyo.Ajax({
				url: "https://n3phele-dev.appspot.com/resources/process/exec?action=Job",
				headers:{ 'authorization' : "Basic "+ this.uid},
				method: "POST",
				contentType: "application/x-www-form-urlencoded",
				postBody: this.$.postBody,
				sync: false, 
				}); 
			
			ajaxComponent.go({
					name: sender.parent.owner.$.job.getValue(),
					arg: "NShell "+this.uri
			})
			.response(this, function(sender, response){
			})
			.error(this, function(){
				console.log("Error to load the detail of the command!");
				popup.delete();
			});	
		}else{
			console.log("Put job name!");
		}
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
	}	
})