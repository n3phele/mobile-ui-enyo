/*** The main classes that mount the command detail page  ****/
var Parameters;
var listFile = new Array();
var checkmail;
enyo.kind({ 
	name:"CommandDetail",
	kind: "FittableRows",
	fit: true,
	files: "",
	commandType:null,
	outputFiles: "",
	commandName:"",
	classes: "onyx onyx-sample commandDetail",
	style: "padding: 0px",
	events: {
		onSelectedFile: "",
		onCommandCreated: "",
		onOutputFile: "",
		onLost:"",
		onBack:"",
		onNewService:"",
	},
	components:[
		{kind: "onyx.Toolbar", classes:"toolbar-style", components: [ { name: "title" }, {name: "back", kind: "onyx.Button", content: "Commands", classes:"button-style-left", ontap: "closePanel"}]},

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
		
		if(this.backContent!=undefined){
			this.$.back.setContent(this.backContent);
		}		
		
		
		var ajaxComponent = n3phele.ajaxFactory.create({
			url: this.uri,
			headers:{ 'authorization' : "Basic "+ this.uid},
			method: "GET",
			contentType: "application/x-www-form-urlencoded",
			sync: false, 
			}); 
				
		ajaxComponent.go()
		.response(this, function(sender, response){
			Parameters = response;
			
			if(response.processor == null || response.processor.length == 0 || response.processor == "Job"){
				this.commandType = "Job";
			}
			else if(response.processor == "StackService"){
				this.commandType="NShell";
			}else if(response.processor == "NShell"){
				this.commandType="NShell";
			}
			
			this.setDynamicData(response);
			
		})
		.error(this, function(){
			console.log("Error to load the detail of the command!");
			popup.delete();
			
		});	
	        
	},
	setDynamicData: function( data ){		
		var complete = true;
		var count = 0;
		if(data.inputFiles != undefined)
		{
		  count = 0;
			complete = false;
			if(data.inputFiles.length == undefined )
			{
			if(data.inputFiles.optional == "false") count = count +1;
			if(this.files.length >= count) complete = true;		
			}			
			else 
			{	
				for(var i in data.inputFiles)
				{  				 
					if(data.inputFiles[i].optional == "false") count = count + 1;
				}
				for(var i = 0 ; i < count ; i++)
				{
				   if(this.files[i] == undefined) 
				   {
				   complete = false;
				   break;
				   }
				   complete = true;
				}	   
			}
		}
		
        checkmail = false;	
		this.$.icon.setSrc(this.icon);
		this.$.cName.setContent(data.name);
		this.$.description.setContent(data.description);
		
		this.commandName = data.name;
			if(this.commandName.length <=25){
				var name = this.commandName;
			}else{
				var name = this.commandName.substr(0,20).concat("...");
			}
			this.$.title.setContent(name);
		//Parameters Groupbox
		if(typeof data.executionParameters != 'undefined')
			this.$.comScroll.createComponent({name: "paramGroup", kind:"commandParamGroup", "params": data.executionParameters});
		//Input files Groupbox
		if(typeof data.inputFiles != 'undefined')
			this.createComponent({kind:"commandFilesGroup", "lines": data.inputFiles, container: this.$.comScroll, files: this.files, onSelectedItem: "repository", "type" : "input" , "count":count});

		//Output files Groupbox
		if(typeof data.outputFiles != 'undefined')
			this.createComponent({kind:"commandFilesGroup", "lines": data.outputFiles, container: this.$.comScroll, output: this.outputFiles, onOutputItem: "selectRepository","type" : "output" , "count":count });
		
		//Cloud list
		if( typeof data.cloudAccounts != 'undefined' )
			this.createComponent({name: "commandExec",kind:"commandExecGroup", "uri" : this.uri, onRunCommand: "runCommand", "lines": data.cloudAccounts, "type": "command", container: this.$.comScroll , "complete":complete});				
		else if( typeof data.serviceList != 'undefined'){
			this.createComponent({name: "commandExec",kind:"commandExecGroup",onNewService:"NewService" ,onRunCommand: "runCommand", "lines": data.serviceList, "type": "service", container: this.$.comScroll , "complete":complete});
		}else{
			if(data.tags == "service"){
				this.createComponent({kind:"commandExecGroup", "uri" : this.uri, onRunCommand: "runCommand",onNewService:"NewService" ,"lines": new Array(), "type": "service", container: this.$.comScroll,"complete":complete });	
			}else{
				this.createComponent({kind:"commandExecGroup", "uri" : this.uri, onRunCommand: "runCommand", "lines": new Array(), container: this.$.comScroll,"complete":complete });	
			}
		}
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
			var str=Parameters.executionParameters[i].name;
			var n = str.replace("-","_");			
			value = this.$.comScroll.$.paramGroup.getValue(n);
			parameters += '{"name":"'+Parameters.executionParameters[i].name+'", "type":"'+
			Parameters.executionParameters[i].type+'", "value":["'+value+'"]},';
		} 

		var commandFiles = fixArrayInformation(Parameters.inputFiles);		

		for (var i = 0; i < this.files.length; i++) {
			value = this.files[i].path;
			parameters += '{"name":"'+commandFiles[i].name+'", "type":"File", "value":["'+value+'"]},';
		};

		var commandOutputFiles = fixArrayInformation(Parameters.outputFiles);		

		for (var i = 0; i < this.outputFiles.length; i++) {
			value = this.outputFiles[i].path;
			parameters += '{"name":"'+commandOutputFiles[i].name+'", "type":"File", "value":["'+value+'"]},';
		};	
		
		parameters += this.$.commandExec.getValue(); 
		parameters += ']}';	
		
		var runCommandUrl;		
		if(this.commandType == "StackService"){
		console.log(this.$.commandExec.getProcess());
			runCommandUrl = serverAddress+"process/exec?action=NShell&name="+this.$.commandExec.getJob()+"&arg="+encodeURIComponent(this.uri+"#"+this.$.commandExec.getZone())+"&parent="+encodeURIComponent(this.$.commandExec.getProcess());
		}else if(this.commandType == "Job"){
			runCommandUrl =  serverAddress+"process/exec?action=Job&name="+this.$.commandExec.getJob()+"&arg=NShell+"+encodeURIComponent(this.uri+"#"+this.$.commandExec.getZone());
		}else if(this.commandType == "NShell"){
		console.log(this.$.commandExec.getProcess());
			runCommandUrl = serverAddress+"process/exec?action=NShell&name="+this.$.commandExec.getJob()+"&arg="+encodeURIComponent(this.uri+"#"+this.$.commandExec.getZone())+"&parent="+encodeURIComponent(this.$.commandExec.getProcess());
		}
		console.log(runCommandUrl);
		
		if(this.$.commandExec.getJob()!=""){		
			var ajaxComponent = n3phele.ajaxFactory.create({
				url: runCommandUrl,
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
	  if(this.backContent!=undefined || this.stackdetail == true)
	  { 	
	    this.doBack();
	  }			
     else {			
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
     }			
	},
	NewService:function(sender,event)
	{ 
	 var obj = new Object();
	 obj.service = "backCommand";
	  this.doNewService(obj);
	}

})