var results;
var i = 0;
enyo.kind({ 
	name:"SelectRepository",
	kind: "FittableRows",
	fit: true,
	style: "padding: 0px;background:#fff",
	events: {
		onSelectRepository: "",
		onBack: "",
	},
	components:[
		{kind: "onyx.Toolbar", classes: "toolbar-style",components: [ 
		{kind: "onyx.Button" ,content: "Command", classes:"button-style-left", ontap: "cancelAction"},
		{name: "title", content:"Output file", style:"padding-left:20px" }, {fit: true}]},        
		{kind: "FittableRows", name:"panel", fit: true, components: [
				{style:"text-align:center;margin:2em auto", components:[							
					{kind: "onyx.InputDecorator",classes: "inputs", components: [
							{kind: "onyx.Input", name: "name",style:"float:left", placeholder: "File name"}
					]},
					{name:"b1",kind:"onyx.Button", content: "Select the repository where this file will be saved", classes:"button-style",  style:"width:98%;height:40px;margin:0.8em auto;", ontap:"selectRepository"}
				]},			
		]}		
	],
	selectRepository: function(sender, event){
		// go to the repository list
		var obj = new Object();
		obj.name = this.$.name.getValue();
        this.doSelectRepository(obj);	
	},
	cancelAction:function (sender,event)
	{  
		this.doBack();
	},
});
