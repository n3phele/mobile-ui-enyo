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
		style:"background:#fff",
		components : [
			{kind : "onyx.Toolbar",  classes: "toolbar-style",name : "title_1", components: [ { content : "Stack Details"},{kind : "onyx.Button", classes:"button-style-left", content : "Stacks", ontap : "backMenu"},
				{kind : "onyx.Button",  classes:"button-style-right", content : "Run", ontap : "run"}]},
		 	{content : "Name", name : "stack", style : "margin:0 0 0 10px;"},
			{content : "Description", name : "description", style : "margin-top:0; text-align:center"},
			{content : "Version", name : "version", style : "margin:5px 0 5px 10px"},
			{style:"text-align:center", components:[		
				{name: "total", style: "color:#768BA7;border-top:3px solid;padding-bottom: 1%;"},								
				{kind: "onyx.InputDecorator",classes: "inputs",style:"margin-top:20px", components: [
					{kind: "onyx.Input",style:"float:left;padding-left:10px", placeholder: "Number of nodes",onchange:"inputChanged"}
				]},
				{tag:"select", classes:"styled-select", style:"-webkit-appearance:none !important;outline:none",components:[             /* <<<<--------------------- */
					{tag:"option", content:"Accounts"}						                                                             /* <<<<--------------------- */
				]}					
			]} 
		]}
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
	backMenu: function(inSender, inEvent) {
		this.doBack();
	},
	closePanel: function(inSender, inEvent){
		var panel = inSender.parent.parent.parent;
		console.log(panel);
		panel.setIndex(4);				
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