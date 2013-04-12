var execCloudName = "34" ;
var execCloudZone = "26" ;
var execCloudSett = "25" ;
var execCloudEmail = "11";
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
                {content: "Machine name", classes: "subsubheader", style:"width:"+execCloudName+"%"} , 
				{content: "Zone", classes: "subsubheader", style:"width:"+execCloudZone+"%" } , 
				{content: "Machine settings", classes: "subsubheader",  style:"width:"+execCloudSett+"%" } ,
				{content: "Send Email?", classes: "subsubheader",  style:"width:"+execCloudEmail+"%" } ,
			]}
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
			this.$.groupbox.createComponent({ kind: "commandExecLine", data: linesInfo[i] });
		}
	},
	addEmptyLine:function(){//there is not clouds available
		this.$.groupbox.createComponent({content:"There is not cloud available for this operation!", style:"text-align:center; padding:4px; font-weight:bold"});
	},
	insertLastLine: function(){
		this.$.groupbox.createComponent({components:[
 		    {kind: "onyx.InputDecorator", style: "background-color:white; width:50%; display: inline-block; margin-right:10px; ", components: [
       				{kind: "onyx.Input", placeholder: "Enter Job Name", name:"job"}
       		]},
       		{kind:"onyx.Button", content: "Run", style: "margin-right:10px;", ontap: "runCommand" },
       	]}, {owner: this});
	},
	runCommand: function(sender, event){
		console.log("Run");
		this.doRunCommand(sender);
	}
});

enyo.kind({
	name: "commandExecLine",
	classes: "commandFilesLine",
	style:"padding: 1px;", 
	components:[
		{classes: "onyx-sample-tools", style:"width:"+execCloudName+"%", components: [
				{kind:"onyx.Checkbox", name: "execCheck"}, {name: "execCloud",  style: "display:inline-block"}
		]},
		{ name: "execZone", style:"width:"+execCloudZone+"%" },
		{ name: "execSettings", style:"width:"+execCloudSett+"%" },
		{style:"width:"+execCloudEmail+"%", components:[ {kind:"onyx.Checkbox", name: "execSend", onChange:"toggleChanged"} ]}
	],
	create: function(){
		this.inherited(arguments);
		this.$.execCheck.setValue(false);
		this.$.execCloud.setContent(this.data.accountName);
		this.$.execZone.setContent(this.data.cloudName);
		this.$.execSettings.setContent(this.data.description);
		this.$.execSend.setValue(false);
	}	
});