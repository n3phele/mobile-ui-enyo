var execCloudName = "44" ;
var execCloudZone = "23" ;
//var execCloudSett = "25" ;
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
                {content: "Machine name",classes: "machineName"} , 
				{content: "Zone", classes: "zoneName"} , 
				//{content: "Machine settings", classes: "subsubheader",  style:"width:"+execCloudSett+"%" } ,
				{content: "Send Notification?", classes:"NotificationName"} 
			]},
			{name: "checkBox", classes: "onyx-sample-tools", components: [	
			]},
			
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
		
		for( var i in linesInfo ){
			this.$.checkBox.createComponent({name: linesInfo[i].accountName, kind: "commandExecLine", data: linesInfo[i] });
			clouds[i] = eval("this.$.checkBox.$."+linesInfo[i].accountName);
			uris[i] = linesInfo[i].accountUri;
			zones[i] = linesInfo[i].implementation;
			}
		
	},
	addEmptyLine:function(){//there is not clouds available
		this.$.groupbox.createComponent({content:"There is not cloud available for this operation!", style:"text-align:center; padding:4px; font-weight:bold"});
	},
	insertLastLine: function(){
		this.$.groupbox.createComponent({components:[
 		    {name: "jobs", kind: "onyx.InputDecorator", style: "background-color:white; width:50%; display: inline-block; margin-right:10px; ", components: [
       				{kind: "onyx.Input", placeholder: "Enter Job Name", name:"job"}
       		]},
       		{kind:"onyx.Button", content: "Run", style: "margin-right:10px;", classes:"button-style", ontap: "runCommand" },
       	]}, {owner: this});
	},
	runCommand: function(sender, event){
		for(var i in clouds){
			var c = clouds[i].$.execCheck.getValue();
			if(c==true){
				send = eval(clouds[i].$.execSend.getValue());
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
	classes: "commandFilesLine",
	style:"padding: 1px;", 
	components:[
		{ classes: "machineContent", components: [
				{kind:"onyx.Checkbox", name: "execCheck"}, {name: "execCloud",  style: "display:inline-block;padding-left:10px"}
		]},
		{ name: "execZone", classes: "zoneContent" },
		{ name: "execSettings"/* , style:"width:"+execCloudSett+"%" */ },
		{kind:"onyx.Checkbox",/* style:"width:"+execCloudEmail+"%", */ name: "execSend"}
	],
	create: function(){
		this.inherited(arguments);
		this.$.execCheck.setValue(false);
		//this.$.execCloud.setContent(this.data.accountName);
		this.$.execZone.setContent(this.data.implementation);
		this.$.execSettings.setContent(this.data.description);
		this.$.execSend.setValue(false);
		
		cloudName = this.data.accountName;
		if(cloudName.length <= 8){
			accountName = cloudName;
		}else{
			accountName = cloudName.substr(0,6).concat("...");
		}
		this.$.execCloud.setContent(accountName);
		
	}
	
});