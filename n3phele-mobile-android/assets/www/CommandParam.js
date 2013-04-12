enyo.kind({
	name: "commandParamGroup",
	components:[
		{tag: "br"},
		{name: "groupbox", classes: "commandTable", kind: "onyx.Groupbox", components: [
			{name: "header", kind: "onyx.GroupboxHeader", classes: "groupboxBlueHeader", content: "Parameters"},//header
			{classes: "subheader", components:[ //subheader
				{content: "Type of data", style: "width:70%", classes: "subsubheader" } , 
				{content: "Value", style: "width:30%", classes: "subsubheader"} 
			]}
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
			var line = this.$.groupbox.createComponent({
					classes: "commandFilesLine", style: "padding: 4px 4px",
					components: [
					             {tag:"div", style: "width:70%", content: linesInfo[i].description.replace(","," , ") },
					             {name: "field", tag:"div", style: "width:30%"}
					]
				});
			
			//Set the field that will gat the parameter needed	
			switch( linesInfo[i].type.toLowerCase() ){
				case "long":
					line.owner.$.field.createComponent({name:"vmNumbers", kind: "onyx.InputDecorator",  style:"background-color:white", components: [ {kind: "onyx.Input", name: "vmNumber", value: linesInfo[i].defaultValue} ] });
				break;
				case "boolean":
					line.owner.$.field.createComponent({name:"bool",kind: "onyx.Checkbox", value: linesInfo[i].defaultValue});
				break;
				case "string":
					line.owner.$.field.createComponent({name:"message", kind: "onyx.InputDecorator",  style:"background-color:white", components: [ {kind: "onyx.Input", name: "msg", value: linesInfo[i].defaultValue} ] });
				break;
			}
			
		}
		
	}
});