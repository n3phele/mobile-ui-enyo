/*** The main classes that mount the command detail page  ****/
var Parameters;
var listFile = new Array();
enyo.kind({ 
	name:"CommandDetail",
	kind: "FittableRows",
	fit: true,
	files: "",
	commandType:null,
	outputFiles: "",
	classes: "onyx onyx-sample commandDetail",
	style: "padding: 0px",
	events: {
		onSelectedFile: "",
		onCommandCreated: "",
		onOutputFile: ""
	},
	components:[
		{kind: "onyx.Toolbar", classes:"toolbar-style", components: [ { name: "title" }, {kind: "onyx.Button", content: "Commands", classes:"button-style-left", ontap: "closePanel"}]},

		{kind: "Panels", name:"panels", fit: true, classes: "panels-sample-sliding-panels panels", arrangerKind: "CollapsingArranger", wrap: false, components: [
			{name: "info", classes: "info", style: "width:15%;background:#fff", components: [
				{kind: "Scroller", classes: "enyo-fit", touch: true, style: "width:90%;margin:auto;padding: 10px 0px;background:#fff", components: [
				     {name: "icon", tag: "img", classes: "card onyx-selected", style: "width:40%;height:auto"},
				     {name: "cName", style: "margin-top: -10px;margin-bottom:15px; color: black;font-weight:bold"},
				     {name: "description"}
				]}
			]},
			{name: "params",classes: "params", fit: true, style: "padding: 0px",  components: [
				{name: "comScroll", kind: "Scroller",style:"background:#fff", classes: "enyo-fit", touch: true, components: [	 
				]}
			]}
		]}
	],
	create: function(){
		this.inherited(arguments);
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
			Parameters = response;
			
			if(response.processor == null || response.processor.length == 0) this.commandType = "Job";
			else this.commandType="StackService";
			this.setDynamicData(response);
			
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
			this.createComponent({kind:"commandFilesGroup", "lines": data.outputFiles, container: this.$.comScroll, output: this.outputFiles, onOutputItem: "selectRepository","type" : "output" });
		
		//Cloud list
		if( typeof data.cloudAccounts != 'undefined' )
			this.createComponent({name: "commandExec",kind:"commandExecGroup", "uri" : this.uri, onRunCommand: "runCommand", "lines": data.cloudAccounts, container: this.$.comScroll });				
		else
			this.createComponent({kind:"commandExecGroup", "uri" : this.uri, onRunCommand: "runCommand", "lines": new Array(), container: this.$.comScroll });	

		//panel reflow
		if (enyo.Panels.isScreenNarrow())
		this.$.info.destroy();
		//this.$.comScroll.render();
		this.$.params.reflow();
		this.render();
		

	},
	repository: function(sender, event){
	   var Obj = new Object();
	   Obj.event = event;
	   Obj.uri = this.uri;	   
		this.doSelectedFile(Obj);
	},
	
	selectRepository: function(sender, event){
		this.doOutputFile(event);
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
		var self = this;
		var value;
		var countFile = 0;
		//create JSON for post body in runcommand
		var parameters = '{"Variable":[';

		for(var i in Parameters.executionParameters){
			console.log(Parameters.executionParameters[i].name);
			console.log(Parameters.executionParameters[i].type);
			value = this.$.comScroll.$.paramGroup.getValue(Parameters.executionParameters[i].name);
			parameters += '{"name":"'+Parameters.executionParameters[i].name+'", "type":"'+
			Parameters.executionParameters[i].type+'", "value":["'+value+'"]},';
		}

		var commandFiles = fixArrayInformation(Parameters.inputFiles);
		console.log(commandFiles);

		for (var i = 0; i < this.files.length; i++) {
			value = this.files[i].path;
			parameters += '{"name":"'+commandFiles[i].name+'", "type":"File", "value":["'+value+'"]},';
		};

		var commandOutputFiles = fixArrayInformation(Parameters.outputFiles);
		console.log(commandOutputFiles);

		for (var i = 0; i < this.outputFiles.length; i++) {
			value = this.outputFiles[i].path;
			parameters += '{"name":"'+commandOutputFiles[i].name+'", "type":"File", "value":["'+value+'"]},';
		};	
		parameters += this.$.commandExec.getValue(); 
		parameters += ']}';
		//console.log(parameters);

		if(this.$.commandExec.getJob()!=""){		
			var ajaxComponent = new enyo.Ajax({
				url: serverAddress+"process/exec?action="+this.commandType+"&name="+this.$.commandExec.getJob()+"&arg=NShell+"+encodeURIComponent(this.uri+"#"+this.$.commandExec.getZone()),
				headers:{ 'authorization' : "Basic "+ this.uid},
				method: "POST",
				contentType: "application/json",
				postBody: parameters,
				sync: false, 
				}); 
			
			ajaxComponent.go()
			.response(this, function(sender, response){
				var location = sender.xhrResponse.headers.location;
				var object = new Object();
				object.location = location;
				object.num = 0;				
				self.doCommandCreated(object);
			})
			.error(this, function(){
				console.log("Error to load the detail of the command!");
			});	
		}else{
			alert("Put job name!");
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
			//panel.owner.$.IconGallery.deselectLastItem();			
	}

})