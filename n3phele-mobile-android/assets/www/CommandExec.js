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
		onRunCommand: ""
	},
	components:[
		{tag: "br"},
		{name: "groupbox", classes: "commandTable", kind: "onyx.Groupbox", components: [
			{name: "header", kind: "onyx.GroupboxHeader", classes: "groupboxBlueHeader", content: "Execute on"},//header
			{classes: "subheader", components:[ //subheader
                {content: "Account",classes: "machineName"}, 
				{content: "Cloud", classes: "zoneName"} 				
			]},
			{name: "checkBox",kind: "Group", classes: "onyx-sample-tools group", components: []},
		]}
	],	
	create: function(){
		this.inherited(arguments);
		if(!this.lines) return;
		this.lines = fixArrayInformation(this.lines);
		
		if( this.lines.length == 0 ){
			this.addEmptyLine();
		}else{
			this.addLines(this.lines);
			this.insertLastLine();
		}		
	},
	
	addLines: function( linesInfo ){//addlines from an array
		
		if (linesInfo.length == 1) 
		{  
	
	      this.$.checkBox.createComponent({name: "account", kind: "commandExecLine", data: linesInfo[0] , index: 0,"check":true,"checkmail":checkmail});
			clouds[0] = eval("this.$.checkBox.$.account");
			uris[0] = linesInfo[0].accountUri;
			zones[0] = linesInfo[0].implementation;
		
		}
	    else
         {	

		for( var i in linesInfo ){
			this.$.checkBox.createComponent({name: linesInfo[i].accountName, kind: "commandExecLine", index: i, data: linesInfo[i],"checkmail":checkmail});
			clouds[i] = eval("this.$.checkBox.$."+linesInfo[i].accountName);
			uris[i] = linesInfo[i].accountUri;
			zones[i] = linesInfo[i].implementation;/* onyx-sample-tools */
			zones[i] = linesInfo[i].implementation;
			}
		}
		
	},
	addEmptyLine:function(){//there is not clouds available
		this.$.groupbox.createComponent({content:"There is not cloud available for this operation!", style:"text-align:center; padding:4px; font-weight:bold"});
	},
	insertLastLine: function(){
	
		this.$.groupbox.createComponent({style:"padding:5px", components:[
			{kind:"onyx.Checkbox", name: "execSend"}, 
			{content: "Send Notification?", classes:"notificationName"},
		]},{owner: this});
			
		if(this.complete == true)
		{
			this.$.groupbox.createComponent({style:"padding:5px", components:[
				{name: "jobs", kind: "onyx.InputDecorator", style: "background-color:white; width:50%;display:inline-block; margin-right:10px; ", components:[  
					{kind: "onyx.Input", placeholder: "Enter Job Name", name:"job"}
				]},
				{kind:"onyx.Button", content: "Run", style: "margin-right:10px;", classes:"button-style", ontap: "runCommand" },
			]},{owner: this});
		}
		else
			this.$.groupbox.createComponent({style:"padding:5px", components:[
				{name: "jobs", kind: "onyx.InputDecorator", style: "background-color:white; width:50%;display:inline-block; margin-right:10px; ", components:[  
					{kind: "onyx.Input", placeholder: "Enter Job Name", name:"job"}
				]},
				{kind:"onyx.Button", content: "Run", style: "margin-right:10px;", disabled:true, classes:"button-style", ontap: "runCommand" },
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
				send = eval(clouds[0].$.execSend.getValue());
				uri = uris[i];
				zone = zones[i];
			}
		}
		this.doRunCommand();
	},
	getValue: function(){
		return '{"name":"notify", "type":"Boolean", "value":["'+send+'"]},{"name":"account", "type":"Object", "value":["'+uri+'"]}'; 
	},
	getJob: function(){
		return this.$.job.getValue();
	},
	getZone: function(){
		return zone;
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