enyo.kind({
	name: "commandFilesGroup",
	files: "",
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
			this.$.groupbox.createComponent({ kind: "commandFilesLine", files: this.files, data: linesInfo[i], type: this.type });
		}
	}
});

enyo.kind({
	name: "commandFilesLine",
	classes: "commandFilesLine",
	style:"padding: 1px;",
	files: "",
	events: {
		onSelectedItem: ""
	},
	components:[
		{tag:"div", name: "files", components:[]},
		{tag:"div", style: "text-align:right", components:[
			{name:"msg", content: "Specify a file." , style: "margin: 2px 0px;display:block"},
			{name:"btnUp", kind:"onyx.Button", content: "Select", ontap:"doSelectFile"},
			{name:"btnDown", kind:"onyx.Button", content: "Download", ontap:"doFileDownload"},
		]}
	],
	doSelectFile: function(inSender, inEvent){
		this.doSelectedItem();
	},
	create: function(){
		this.inherited(arguments);
		this.files = fixArrayInformation(this.files);
		for(var i in this.files){
			this.$.files.createComponent({content: this.files[i].name, style:"padding:4px; font-weight:bold"}).render();
		}
		
		
		if(this.type == "output"){
			this.$.btnUp.addClass("btnInactive");
			this.$.btnDown.addClass("btnActive");			
		}else{//input
			this.$.btnUp.addClass("btnActive");
			this.$.btnDown.addClass("btnInactive");
		}
	},
	doFileDownload: function(){
		alert("Download function!!");
	}
	
});