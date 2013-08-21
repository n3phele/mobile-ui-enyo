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
			
			if(response.processor == null || response.processor.length == 0 || response.processor == "Job") this.commandType = "Job";
			else this.commandType="StackService";
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
		this.$.icon.setSrc("data:image/png;base64,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");
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
			this.createComponent({name: "commandExec",kind:"commandExecGroup", "uri" : this.uri, onRunCommand: "runCommand", "lines": data.cloudAccounts, container: this.$.comScroll , "complete":complete});				
		else
			this.createComponent({kind:"commandExecGroup", "uri" : this.uri, onRunCommand: "runCommand", "lines": new Array(), container: this.$.comScroll,"complete":complete });	

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
			value = this.$.comScroll.$.paramGroup.getValue(Parameters.executionParameters[i].name);
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
		if(this.$.commandExec.getJob()!=""){		
			var ajaxComponent = n3phele.ajaxFactory.create({
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
	   console.log(this.vnum)
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
	}

})