enyo.kind({
	name: "commandFilesGroup",
	files: "",
	output :"",
	components:[
		{tag: "br"},
		{name: "groupbox", classes: "commandTable", kind: "onyx.Groupbox", components: [
			{name: "header", kind: "onyx.GroupboxHeader", classes: "groupboxBlueHeader", content: "Title"},//header
			{classes: "subheader", components:[ //subheader
				{content: "Filename", classes: "subsubheader" } , 
				{content: "Status", classes: "subsubheader"} 
			]}
		]}//end groupbox
	],//end components inFilesList
	create: function(){
		this.inherited(arguments);
		
		//checking the type of groupbox
		if(this.type == 'output')
			this.$.header.setContent( "Output Files" );
		else
			this.$.header.setContent( "Input Files" );
		
		this.lines = fixArrayInformation(this.lines);

		this.initializeLines( this.lines );
	},
	initializeLines: function( linesInfo ){
		for( var i in linesInfo ){
			this.$.groupbox.createComponent({ kind: "commandFilesLine", file: this.files[i], outputfile:this.output[i], index: i, data: linesInfo[i], type: this.type });
		}
	}
});

enyo.kind({
	name: "commandFilesLine",
	classes: "commandFilesLine",
	style:"padding: 1px;",
	file: "",
	outputfile: "",
	index: "",
	events: {
		onSelectedItem: "",
		onOutputItem: ""
	},
	components:[
		{tag:"div", name: "files", components:[]},
		{tag:"div", style: "text-align:right", components:[
			{name:"msg", content: "Specify a file." , style: "margin: 2px 0px;display:block"},
			{name:"btnUp", kind:"onyx.Button", content: "Select File", classes:"button-style", ontap:"doSelectFile"},
			{name:"btnDown", kind:"onyx.Button", content: "Save as...", classes:"button-style", ontap:"doFileDownload"},
		]}
	],
	doSelectFile: function(inSender, inEvent){
		fileindex = {index: this.index};
		this.doSelectedItem(fileindex);
	},
	create: function(){
		this.inherited(arguments);
		//this.$.files.createComponent({content:this.outputfile.name,style:"padding:4px;font-weight:bold"}).render();
		if(this.type == "output"){
			this.$.files.createComponent({content: this.outputfile.path, style:"padding:4px; font-weight:bold"}).render();
			this.$.btnUp.addClass("btnInactive");
			this.$.btnDown.addClass("btnActive");			
		}else{//input
			this.$.files.createComponent({content: this.file.name, style:"padding:4px; font-weight:bold"}).render();
			this.$.btnUp.addClass("btnActive");
			this.$.btnDown.addClass("btnInactive");
		}
	},
	doFileDownload: function(){
		fileindex = {index: this.index};
		this.doOutputItem(fileindex);
	}
	
});