enyo.kind({
	name: "commandParamGroup",
	components:[
		{name: "groupbox", classes: "commandTable", kind: "onyx.Groupbox", components: [  
			{name: "header", kind: "onyx.GroupboxHeader", classes: "groupboxBlueHeader", content: "Parameters"},//header  
			//{name: "contentList" /* classes: "groupboxBlueHeader", */ },
			{classes: "subheader", components:[ ]}, //subheader				
			{name: "paramLines",classes: "commandFilesLine"}	
		]}     //end groupbox		
	],         //end components inFilesList
	create: function(){
		this.inherited(arguments);
		
		if(typeof this.params == 'undefined') return;//checking if the lines informations are set
		this.params = fixArrayInformation(this.params);
		this.initializeLines(this.params);
	},
	initializeLines: function( linesInfo ){	
		for( var i in linesInfo ){
			if(linesInfo[i].name == "$notify"){
				if(linesInfo[i].defaultValue=="true")
				checkmail = true;			
				break;
			}

			var fieldType = "";
			
			//Set the field that will get the parameter needed	
			switch( linesInfo[i].type.toLowerCase() ){
				case "long":
				if(i % 2 == 0){
					this.$.groupbox.createComponent({classes:"bodyCommandWhite", components:[ 
						{content:linesInfo[i].description.replace(","," , "), classes:"contentCommand"},						
						{classes:"imputCommand", kind: "onyx.Input", name: linesInfo[i].name, value: linesInfo[i].defaultValue}											
					]});
				}else if(i % 2 == 1){
					this.$.groupbox.createComponent({classes:"bodyCommand", components:[
						{content:linesInfo[i].description.replace(","," , "), classes:"contentCommand"},						
						{classes:"imputCommand", kind: "onyx.Input",  name: n, value: linesInfo[i].defaultValue}										
					]});
				}	
				break;
				case "boolean":
				if(i % 2 == 0){
					this.$.groupbox.createComponent({classes:"bodyCommandWhite", components:[
						{content:linesInfo[i].description.replace(","," , "), classes:"contentCommand"},						
						{classes:"imputCommand", kind: "onyx.Checkbox", name: linesInfo[i].name, value: linesInfo[i].defaultValue}												
					]});	
				}else if(i % 2 == 1){
					this.$.groupbox.createComponent({classes:"bodyCommand", components:[
						{content:linesInfo[i].description.replace(","," , "), classes:"contentCommand"},						
						{classes:"imputCommand",kind: "onyx.Checkbox", name: linesInfo[i].name, value: linesInfo[i].defaultValue}											
					]});
				}
				break;
				case "string":
				if(i % 2 == 0){				
					var str=linesInfo[i].name;					
					var n = str.replace("-","_");
					this.$.groupbox.createComponent({classes:"bodyCommandWhite", components:[
						{content:linesInfo[i].description.replace(","," , "), classes:"contentCommand"},						
						{classes:"imputCommand", kind: "onyx.Input", name: n, value: linesInfo[i].defaultValue}						
					]});
				}else if(i % 2 == 1){				
					var str=linesInfo[i].name;					
					var n = str.replace("-","_");
					this.$.groupbox.createComponent({classes:"bodyCommand", components:[
						{content:linesInfo[i].description.replace(","," , "), classes:"contentCommand"},						
						{classes:"imputCommand", kind: "onyx.Input", name: n, value: linesInfo[i].defaultValue}												
					]});
				}
				break;
			}			
		}		
	},
	//return value of paramenter name
	getValue: function(name){
		var value = eval("this.$.groupbox.$."+name+".getValue()");		
		return value;
	}
});