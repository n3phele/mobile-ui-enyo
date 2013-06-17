enyo.kind({
	name: "commandParamGroup",
	components:[
		{tag: "br"},
		{name: "groupbox", classes: "commandTable", kind: "onyx.Groupbox", components: [
			{name: "header", kind: "onyx.GroupboxHeader", classes: "groupboxBlueHeader", content: "Parameters"},//header
			{classes: "subheader", components:[ //subheader
				{content: "Type of data", style: "width:70%", classes: "subsubheader" } , 
				{content: "Value", style: "width:30%", classes: "subsubheader"} 
			]},
			{name: "paramLines",classes: "commandFilesLine", style: "padding: 4px 4px"}
		]}//end groupbox
	],//end components inFilesList
	create: function(){
		this.inherited(arguments);
		
		if(typeof this.params == 'undefined') return;//checking if the lines informations are set
		this.params = fixArrayInformation(this.params);
		this.initializeLines(this.params);
	},
	initializeLines: function( linesInfo ){
		for( var i in linesInfo ){
			var fieldType = "";
			this.$.paramLines.createComponent({tag:"div", style: "width:70%", content: linesInfo[i].description.replace(","," , ")});
			//Set the field that will get the parameter needed	
			switch( linesInfo[i].type.toLowerCase() ){
				case "long":
					this.$.paramLines.createComponent({tag: "div", style:"width:30%", components: [ {kind: "onyx.Input", style:"width:100%", name: linesInfo[i].name, value: linesInfo[i].defaultValue}]});
				break;
				case "boolean":
					this.$.paramLines.createComponent({tag: "div", name: linesInfo[i].name,kind: "onyx.Checkbox", value: linesInfo[i].defaultValue});
				break;
				case "string":
					this.$.paramLines.createComponent({tag:"div", style:"width:30%", components: [ {kind: "onyx.Input", style:"width:100%",name: linesInfo[i].name, value: linesInfo[i].defaultValue}]});
				break;
			}	
		}		
	},
	//return value of paramenter name
	getValue: function(name){
		var value = eval("this.$.paramLines.$."+name+".getValue()");
		return value;
	}
});