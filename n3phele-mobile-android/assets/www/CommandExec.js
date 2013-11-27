var execCloudName = "44" ;
var execCloudZone = "23" ;
var execCloudEmail = "11";
var clouds = new Array();
var uris = new Array();
var zones = new Array();
var zone;
var send;
var uri;
var cloudName = "";

enyo.kind({ 
	name: "commandExecGroup",
	events: {
		onRunCommand: "",
		onNewService:"",
	},
	components:[
		{tag: "br"},
		{name: "groupbox", classes: "commandTable", kind: "onyx.Groupbox", components: [
			{name: "header", kind: "onyx.GroupboxHeader", classes: "groupboxBlueHeader", content: "Execute on"},//header
			{classes: "subheader", components:[ //subheader
                {name: "typeContent", content: "Account",classes: "machineName"}, 
				{content: "Cloud", classes: "zoneName"} 				
			]},
			{name: "checkBox",kind: "Group", classes: "onyx-sample-tools group", components: []},
		]}
	],	
	create: function(){
		this.inherited(arguments);
		if(!this.lines) return;
		this.lines = fixArrayInformation(this.lines);
		
		if(this.type == "service"){
			this.$.typeContent.setContent("Service");
			
		}
		
		if( this.lines.length == 0 ){
			this.addEmptyLine();
		}else{
			this.addLines(this.lines);
			this.insertLastLine();
		}
	},
	
	addLines: function( linesInfo ){//addlines from an array

	 	
			for( var i in linesInfo ){
			
			var str= linesInfo[i].accountName;
			var n = str.replace("-","_");
			   
			   if(i == 0 ) {
				this.createComponent({name: n, kind: "commandExecLine", data: linesInfo[0] , index: 0,"check":true,"checkmail":checkmail, container: this.$.checkBox});
				}
				else{
				this.createComponent({name: n, kind: "commandExecLine", index: i, data: linesInfo[i],"checkmail":checkmail, container: this.$.checkBox});
				}

				clouds[i] = eval("this.$."+n);				
				uris[i] = linesInfo[i].accountUri;
				zones[i] = linesInfo[i].implementation;
			}
			
	},
	addEmptyLine:function(){//there is not clouds available
	
		if(this.type == "service"){
			this.createComponent({content:"Create new service", style:"text-decoration: underline;padding:4px;color: #f000 !important; font-weight:bold",ontap: "NewService",container: this.$.groupbox});
		}else
			this.$.groupbox.createComponent({content:"There is not cloud available for this operation!", style:"text-align:center; padding:4px; font-weight:bold"});
	},
	insertLastLine: function(){
	
		var runButtonName;
		var placeholderName;
		
		this.$.groupbox.createComponent({style:"padding:5px", components:[
			{kind:"onyx.Checkbox", name: "execSend"}, 
			{content: "Send Notification?", classes:"notificationName"},
		]},{owner: this});
		
		if(this.type == "service"){
			runButtonName = "Create";
			placeholderName = "Enter Service Name";
		}else{
			runButtonName = "Run";
			placeholderName = "Enter Job Name";
		}
		
		if(this.complete == true)
		{
			this.$.groupbox.createComponent({style:"padding:5px", components:[
				{name: "jobs", kind: "onyx.InputDecorator", style: "background-color:white; width:50%;display:inline-block; margin-right:10px; ", components:[  
					{kind: "onyx.Input", placeholder: placeholderName, name:"job"}
				]},
				{kind:"onyx.Button", content: runButtonName, style: "margin-right:10px;", classes:"button-style", ontap: "runCommand" },
			]},{owner: this});
		}
		else
			this.$.groupbox.createComponent({style:"padding:5px", components:[
				{name: "jobs", kind: "onyx.InputDecorator", style: "background-color:white; width:50%;display:inline-block; margin-right:10px; ", components:[  
					{kind: "onyx.Input", placeholder: placeholderName, name:"job"}
				]},
				{kind:"onyx.Button", content: runButtonName, style: "margin-right:10px;", disabled:true, classes:"button-style", ontap: "runCommand" },
			]},{owner: this});
			
		if(checkmail == true)
		{
		this.$.execSend.setValue(true);
		}
		else
		this.$.execSend.setValue(false);	
	},
	runCommand: function(sender, event){
		for(var i in clouds){
			var c = clouds[i].$.execCheck.getValue();
			if(c==true){
				send = eval(this.$.execSend.getValue());
				uri = uris[i];
				zone = zones[i];
			}
		}
		this.doRunCommand();
	},
	getValue: function(){
		if(this.type == "service"){
			return '{"name":"notify", "type":"Boolean", "value":["'+this.$.execSend.getValue()+'"]}'; 
		}else if(this.type == "command"){
			return '{"name":"notify", "type":"Boolean", "value":["'+this.$.execSend.getValue()+'"]},{"name":"account", "type":"Object", "value":["'+uri+'"]}'; 
		}
	},
	getProcess: function(){
		return uri;
	},
	getJob: function(){
		return this.$.job.getValue();
	},
	getZone: function(){
		return zone;
	},
	NewService:function()
	{
	 
	 this.doNewService();
	}
});

enyo.kind({
	name: "commandExecLine",	
	style:"padding: 1px;", 
	index: "", 
	components:[
		{ classes: "machineContent",style:"display:inline-block", components: [
				{kind:"onyx.Checkbox", name: "execCheck"}, {name: "execCloud",  style: "display:inline-block;padding-left:10px;font-size:15px !important;"}
		]},
		{name: "execZone", classes: "zoneContent"}		
	],
	create: function(){
		this.inherited(arguments);	

       if(this.check == true)
		{
		this.$.execCheck.setValue(true);
		}
		else
		{
		this.$.execCheck.setValue(false);
		}
		
		this.$.execZone.setContent(this.data.implementation);		
		
		cloudName = this.data.accountName;
		if(cloudName.length <= 8){
			accountName = cloudName;
		}else{
			accountName = cloudName.substr(0,6).concat("...");
		}
		this.$.execCloud.setContent(accountName);
	}
	
});