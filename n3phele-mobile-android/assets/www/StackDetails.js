enyo.kind({
	name : "StackDetails",
	kind: "FittableRows",
	fit: true,
	style: "padding: 0px",
	events: {
		onSelectedItem: "",
		onBack: ""
	},
	components : [
		{kind : "Scroller",
		classes : "scroller-sample-scroller enyo-fit",
		components : [
		 {kind : "onyx.Toolbar",  classes: "toolbar-style",name : "title_1", components: [ { content : "Stack Details"},{kind : "onyx.Button", classes:"button-style-left", content : "<", ontap : "closePanel"},
				{kind : "onyx.Button",  classes:"button-style-right", content : "Run", ontap : "run"}]},
		 	{content : "Name", name : "stack", style : "margin:0 0 0 10px;"},
			{content : "Description", name : "description", style : "margin-top:0; text-align:center"},
			{content : "Version", name : "version", style : "margin:5px 0 5px 10px"},
			
			{name: "total", style: "color:#b1c2d7;border-top:3px solid;"},
			    {content : "Node count:",style:"padding-top:10px"},
				{kind: "onyx.InputDecorator", components: [
				{kind: "onyx.Input", placeholder: "Number here",onchange:"inputChanged"}
			]},
			   
			    {content : "Account:",style:"padding: 80px  0px 0px;"}, {content : "AccountName",}
			 
			]}/* ,
					
			{kind : "onyx.Toolbar", name : "toolbar", style : "background:#b1c2d7;position:absolute;bottom:0;width:100%;border:1px solid #375d8c;background-size:contain", components : [
				{kind : "onyx.Button", classes:"button-style-left", content : "<", ontap : "closePanel",},
				{kind : "onyx.Button",  classes:"button-style-right", content : "Run", ontap : "run"} 
			]} */
	],
	create: function(){
		this.inherited(arguments)
		this.$.stack.setContent(this.stack.name);
		this.$.description.setContent(this.stack.name);
		this.$.version.setContent("1.0");
		
	},
	itemSelected: function(sender, event){
		if (event.originator.content){
			this.$.cost.setPlaceholder(event.originator.content);
		}
	},
	
	closePanel: function(inSender, inEvent){
		var panel = inSender.parent.parent.parent;
		
		panel.setIndex(3);				
		panel.getActive().destroy();					
		panel.panelCreated = false;
		
		if (enyo.Panels.isScreenNarrow()) {
			panel.setIndex(3);
		}
		else {
			panel.setIndex(3);
		}		
		
		panel.reflow();		
	}	
});