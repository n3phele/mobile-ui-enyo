enyo.kind({
	name: "ServiceDetails",
	kind: "FittableRows",
	events: {
		onCreateStack: "",
		onBack: ""
	},
	components: [
		{kind:"Scroller",classes: "scroller-sample-scroller enyo-fit",components: [
			{kind: "onyx.Toolbar", content: "Service Detail", name: "title_1", style:"background:#b1c2d7;border:1px solid #375d8c;background-size:contain;color:#375d8c"},				
				{content: "Service foo", name: "service foo", style:"margin: 15px 0 10px 10px; font-size:20px"}, 	
				{name:"TreePanel", style:"height:75%;border:2px solid #375d8c", kind: "Scroller", fit: true, components:[			
						{name: "res", kind:"onyx.Button",style:"padding:6px 140px;background-color:#FFFFFF;color:#375d8c;border-color:#375d8c; border-width: 2px",ontap:"resource", content: "Resource"}, 
						{name: "rel", kind:"onyx.Button",style:"padding:6px 140px;background-color:#FFFFFF;color:#375d8c;border-color:#375d8c",ontap:"relationships", content: "Relationships"},
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
				{name: "buttons", style:"margin-top:20px; margin-bottom:20px", components:[
					{kind:"onyx.Button", content: "Add Node", style:"display:inline-block;margin-left:20px;background-color:#FFFFFF;color:#375d8c;border-color:#375d8c", ontap:"addNode"},
					{kind:"onyx.Button", content: "Update Node", style:"display:inline-block;margin-left:50px;background-color:#FFFFFF;color:#375d8c;border-color:#375d8c", ontap:"updateNode"},
				]}
				]},
			{kind: "onyx.Toolbar",style:"background:#b1c2d7;border:1px solid #375d8c;position:absolute;bottom:0;width:100%;background-size:contain;color:#375d8c;clear: both", components: [   //style:"background:#b1c2d7;position:absolute;bottom:0;width:100%;border:1px solid #375d8c;background-size:contain;clear: both",
				{kind: "onyx.Button",style:"background-color:#FFFFFF;color:#375d8c;border-color:#375d8c", content: "New Stack", ontap: "newStack"},	
				{kind: "onyx.Button",style:"background-color:#FFFFFF;color:#375d8c;border-color:#375d8c;float:right;", content: "Close", ontap: "close"},				
			]}	
		]},		
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
		
		this.$.buttonsPanel.createComponent({name: "buttons", style:"margin-top:20px; margin-bottom:20px", components:[
			{kind:"onyx.Button", content: "Add Node", style:"display:inline-block;margin-left:20px;background-color:#FFFFFF;color:#375d8c;border-color:#375d8c", ontap:"addNode"},
			{kind:"onyx.Button", content: "Update Node", style:"display:inline-block;margin-left:50px;background-color:#FFFFFF;color:#375d8c;border-color:#375d8c", ontap:"updateNode"},
		]}).render();
		
		this.$.rel.setStyle("padding:6px 140px;background-color:#FFFFFF;color:#375d8c;border-color:#375d8c; border-width: 1px");
		this.$.res.setStyle("padding:6px 140px;background-color:#FFFFFF;color:#375d8c;border-color:#375d8c; border-width: 2px");
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
		
		this.$.buttonsPanel.createComponent({name: "buttons", style:"margin-top:20px; margin-bottom:20px", components:[
			{kind:"onyx.Button", content: "Add Database", style:"display:inline-block;margin-left:20px;background-color:#FFFFFF;color:#375d8c;border-color:#375d8c", ontap:"addDatabase"},
			{kind:"onyx.Button", content: "Add Load Balancer", style:"display:inline-block;margin-left:50px;background-color:#FFFFFF;color:#375d8c;border-color:#375d8c", ontap:"AddLoad"},
		]}).render();				
		
		this.$.res.setStyle("padding:6px 140px;background-color:#FFFFFF;color:#375d8c;border-color:#375d8c; border-width: 1px");
		this.$.rel.setStyle("padding:6px 140px;background-color:#FFFFFF;color:#375d8c;border-color:#375d8c; border-width: 2px");
	},
});
