enyo.kind({
	name: "ServiceDetails",
	kind: "FittableRows",
	events: {
		onCreateStack: "",
		onBack: ""
	}, 
	components: [
		{kind:"Scroller", style:"background:#fff",classes: "scroller-sample-scroller enyo-fit",components: [
				{kind: "onyx.Toolbar",classes: "toolbar-style",components:[ {kind: "onyx.Button",classes:"button-style-right", content: "New Stack", ontap: "newStack"},	
			{kind: "onyx.Button",classes:"button-style-left", content: "Service List", ontap: "close"},		
			{content: "Service Detail", name: "title_1", }]},							
				{content: "Service foo", name: "service foo", style:"margin: 25px 0 30px 10px; font-size:20px"}, 
				
					{name: "res", kind:"onyx.Button",style:"width:30%;min-width:170px;background-color:#FFFFFF;border-radius:0px;padding:10px 18px; border-width: 2px",ontap:"resource", content: "Resource"}, 
					{name: "rel", kind:"onyx.Button",style:"width:30%;min-width:170px;background-color:#FFFFFF;border-radius:0px;padding:10px 18px",ontap:"relationships", content: "Relationships"},
				{name:"TreePanel", style:"height:60%;border:1px solid #375d8c", kind: "Scroller", fit: true, components:[									
						{name: "panel",components: [
						{name: "Tree", style: "margin: 15px 0 0 20px;height:30%", components: [
							{kind: "Selection", onSelect: "select", onDeselect: "deselect"},
							{kind: "Scroller", fit: true, components: [
								{kind: "Node", icon: "assets/folder-open.png", content: "Stack 1",style:"font-size:20px", expandable: true, expanded: true, onExpand: "nodeExpand", onNodeTap: "nodeTap", components: [
									{icon: "assets/file.png", content: "VM1"},
									{icon: "assets/file.png", content: "VM2"}, 
								]},
							]},	
							{kind: "Selection", onSelect: "select", onDeselect: "deselect"},
							{kind: "Scroller", fit: true, components: [
								{kind: "Node", icon: "assets/folder.png", content: "Stack 2",style:"font-size:20px",  expandable: true, expanded: false, onExpand: "nodeExpand", onNodeTap: "nodeTap", components: [
									{icon: "assets/file.png", content: "VM1"},
									{icon: "assets/file.png", content: "VM2"}, 
								]},
							]},	
							{kind: "Selection", onSelect: "select", onDeselect: "deselect"},
							{kind: "Scroller", fit: true, components: [
								{kind: "Node", icon: "assets/folder.png", content: "Stack 3",style:"font-size:20px",  expandable: true, expanded: false, onExpand: "nodeExpand", onNodeTap: "nodeTap", components: [
									{icon: "assets/file.png", content: "VM1"},
									{icon: "assets/file.png", content: "VM2"},
								]},
							]},	
							{kind: "Selection", onSelect: "select", onDeselect: "deselect"},
							{kind: "Scroller", fit: true, components: [
								{kind: "Node", icon: "assets/folder.png", content: "Stack 4",style:"font-size:20px",  expandable: true, expanded: false, onExpand: "nodeExpand", onNodeTap: "nodeTap", components: [
									{icon: "assets/file.png", content: "VM1"},
									{icon: "assets/file.png", content: "VM2"},
								]},
							]},	
							{kind: "Selection", onSelect: "select", onDeselect: "deselect"},
							{kind: "Scroller", fit: true, components: [
								{kind: "Node", icon: "assets/folder.png", content: "Stack 5",style:"font-size:20px",  expandable: true, expanded: false, onExpand: "nodeExpand", onNodeTap: "nodeTap", components: [
									{icon: "assets/file.png", content: "VM1"},
									{icon: "assets/file.png", content: "VM2"},
								]},
							]},	
						]},	
					]},						
				]},
				{name: "buttonsPanel",components:[
				{name: "buttons", style:"margin:1em auto;width:400px;float:left", components:[ 
					{kind:"onyx.Button", content: "Add Node", classes:"button-style", style:"display:inline-block;margin-left:20px", ontap:"addNode"},
					{kind:"onyx.Button", content: "Update Node", classes:"button-style", style:"display:inline-block;margin-left:50px", ontap:"updateNode"},
				]}
				]}			
		]}	
		
	],	
	nodeExpand: function(inSender, inEvent) {
		inSender.setIcon("assets/" + (inSender.expanded ? "folder-open.png" : "folder.png"));
	},
	newStack: function(inSender, inEvent) {
		this.doCreateStack();
	},
	nodeTap: function(inSender, inEvent) {
		var node = inEvent.originator;
		this.$.selection.select(node.id, node);
	},
	select: function(inSender, inEvent) {
		inEvent.data.$.caption.applyStyle("background-color", "lightblue");
	},
	deselect: function(inSender, inEvent) {
		inEvent.data.$.caption.applyStyle("background-color", null);
	},
	close: function(inSender, inEvent){
		this.doBack();
	},
	resource: function(inSender, inEvent) {
		this.$.panel.destroyClientControls();
		
		this.$.panel.createComponent({name: "Tree", style: "margin: 15px 0 0 20px;height:30%", components: [
							{kind: "Selection", onSelect: "select", onDeselect: "deselect"},
							{kind: "Scroller", fit: true, components: [
								{kind: "Node", icon: "assets/folder-open.png", content: "Stack 1",style:"font-size:20px", expandable: true, expanded: true, onExpand: "nodeExpand", onNodeTap: "nodeTap", components: [
									{icon: "assets/file.png", content: "VM1"},
									{icon: "assets/file.png", content: "VM2"}, 
								]},
							]},	
							{kind: "Selection", onSelect: "select", onDeselect: "deselect"},
							{kind: "Scroller", fit: true, components: [
								{kind: "Node", icon: "assets/folder.png", content: "Stack 2",style:"font-size:20px",  expandable: true, expanded: false, onExpand: "nodeExpand", onNodeTap: "nodeTap", components: [
									{icon: "assets/file.png", content: "VM1"},
									{icon: "assets/file.png", content: "VM2"}, 
								]},
							]},	
							{kind: "Selection", onSelect: "select", onDeselect: "deselect"},
							{kind: "Scroller", fit: true, components: [
								{kind: "Node", icon: "assets/folder.png", content: "Stack 3",style:"font-size:20px",  expandable: true, expanded: false, onExpand: "nodeExpand", onNodeTap: "nodeTap", components: [
									{icon: "assets/file.png", content: "VM1"},
									{icon: "assets/file.png", content: "VM2"},
								]},
							]},	
							{kind: "Selection", onSelect: "select", onDeselect: "deselect"},
							{kind: "Scroller", fit: true, components: [
								{kind: "Node", icon: "assets/folder.png", content: "Stack 4",style:"font-size:20px",  expandable: true, expanded: false, onExpand: "nodeExpand", onNodeTap: "nodeTap", components: [
									{icon: "assets/file.png", content: "VM1"},
									{icon: "assets/file.png", content: "VM2"},
								]},
							]},	
							{kind: "Selection", onSelect: "select", onDeselect: "deselect"},
							{kind: "Scroller", fit: true, components: [
								{kind: "Node", icon: "assets/folder.png", content: "Stack 5",style:"font-size:20px",  expandable: true, expanded: false, onExpand: "nodeExpand", onNodeTap: "nodeTap", components: [
									{icon: "assets/file.png", content: "VM1"},
									{icon: "assets/file.png", content: "VM2"},
								]},
							]},	
						]}).render();
						
		this.$.buttonsPanel.destroyClientControls();
		
		this.$.buttonsPanel.createComponent({name: "buttons", style:"margin:1em auto;width:400px;float:left", components:[
			{kind:"onyx.Button", content: "Add Node", classes:"button-style", style:"display:inline-block;margin-left:20px", ontap:"addNode"},  
			{kind:"onyx.Button", content: "Update Node", classes:"button-style", style:"display:inline-block;margin-left:50px", ontap:"updateNode"}, 
		]}).render();
		
		this.$.rel.setStyle("width:30%;min-width:170px;background-color:#FFFFFF;border-radius:0px;padding:10px 18px; border-width: 1px");
		this.$.res.setStyle("width:30%;min-width:170px;background-color:#FFFFFF;border-radius:0px;padding:10px 18px; border-width: 2px");
	},
	relationships: function(inSender, inEvent) {
		this.$.panel.destroyClientControls();
		this.$.panel.createComponent({name: "Tree", style: "margin: 15px 0 0 20px;height:30%", components: [
							{kind: "Selection", onSelect: "select", onDeselect: "deselect"},
							{kind: "Scroller", fit: true, components: [
								{kind: "Node", icon: "assets/folder-open.png", content: "Stack 1",style:"font-size:20px", expandable: true, expanded: true, onExpand: "nodeExpand", onNodeTap: "nodeTap", components: [
									{icon: "assets/file.png", content: "Database"},
									{icon: "assets/file.png", content: "Load Balancer"}, 
								]},
							]},	
							{kind: "Selection", onSelect: "select", onDeselect: "deselect"},
							{kind: "Scroller", fit: true, components: [
								{kind: "Node", icon: "assets/folder.png", content: "Stack 2",style:"font-size:20px",  expandable: true, expanded: false, onExpand: "nodeExpand", onNodeTap: "nodeTap", components: [
									{icon: "assets/file.png", content: "Database"},
									{icon: "assets/file.png", content: "Load Balancer"}, 
								]},
							]},	
							{kind: "Selection", onSelect: "select", onDeselect: "deselect"},
							{kind: "Scroller", fit: true, components: [
								{kind: "Node", icon: "assets/folder.png", content: "Stack 3",style:"font-size:20px",  expandable: true, expanded: false, onExpand: "nodeExpand", onNodeTap: "nodeTap", components: [
									{icon: "assets/file.png", content: "Database"},
									{icon: "assets/file.png", content: "Load Balancer"},
								]},
							]},	
							{kind: "Selection", onSelect: "select", onDeselect: "deselect"},
							{kind: "Scroller", fit: true, components: [
								{kind: "Node", icon: "assets/folder.png", content: "Stack 4",style:"font-size:20px",  expandable: true, expanded: false, onExpand: "nodeExpand", onNodeTap: "nodeTap", components: [
									{icon: "assets/file.png", content: "Database"},
									{icon: "assets/file.png", content: "Load Balancer"},
								]},
							]},	
							{kind: "Selection", onSelect: "select", onDeselect: "deselect"},
							{kind: "Scroller", fit: true, components: [
								{kind: "Node", icon: "assets/folder.png", content: "Stack 5",style:"font-size:20px",  expandable: true, expanded: false, onExpand: "nodeExpand", onNodeTap: "nodeTap", components: [
									{icon: "assets/file.png", content: "Database"},
									{icon: "assets/file.png", content: "Load Balancer"},
								]},
							]},	
						]}).render();
					
		this.$.buttonsPanel.destroyClientControls();
		
		this.$.buttonsPanel.createComponent({name: "buttons", style:"margin:1em auto;width:400px;float:left", components:[  // style:"margin:1em auto;width:400px;padding-right:1200px"
			{kind:"onyx.Button", content: "Add Database", classes:"button-style", style:"display:inline-block;margin-left:20px", ontap:"addDatabase"}, 
			{kind:"onyx.Button", content: "Add Load Balancer", classes:"button-style", style:"display:inline-block;margin-left:50px", ontap:"AddLoad"},
		]}).render();				
		
		this.$.res.setStyle("width:30%;min-width:170px;background-color:#FFFFFF;border-radius:0px;padding:10px 18px; border-width: 1px");
		this.$.rel.setStyle("width:30%;min-width:170px;background-color:#FFFFFF;border-radius:0px;padding:10px 18px; border-width: 2px");
	},
});
