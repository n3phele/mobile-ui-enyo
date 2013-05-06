enyo.kind({
	name : "AccountDetails",
	kind: "FittableRows",
	fit: true,
	style: "padding: 0px",
	components : [
		{kind : "Scroller",
		classes : "scroller-sample-scroller enyo-fit",
		components : [
		 {kind : "onyx.Toolbar", content : "Account", name : "title_1",style : "background:#b1c2d7;border:1px solid #375d8c;background-size:contain;color:#375d8c"},
		 	{content : "Name of Account", name : "account", style : "margin:0 0 0 10px; font-weight: bold; font-size:20px"},
			{content : "Name of Account", name : "description", style : "margin-top:0; text-align:center"},
			{content : "Name of Cloud", name : "cloudName", style : "margin:5px 0 5px 10px"},
			{kind : "onyx.Toolbar", content : "History", name : "title_2",style : "background:#b1c2d7;border:1px solid #375d8c;background-size:contain;color:#375d8c"},
           
			{name : "Panel", kind : "FittableRows", classes : "onyx-sample-tools", style: "margin: 1em auto;width: 700px", components : [  
				{kind : "onyx.MenuDecorator", onSelect : "itemSelected", style:"display:inline-block",components : [  
					{kind : "onyx.InputDecorator",components : [ 
					   {kind : "onyx.Input", name : "cost", disabled:true, placeholder:""}
					]},   
					{content : "v",allowHtml : true,style : "border-radius: 0 2px 2px 0"},
					{kind : "onyx.Menu", name : "costList", style : "width:192px;background:#303030", components:[  
						{content : "Cost"},
						{content : "Cumulative Cost"}
					]}
				]},
				{kind : "onyx.Button", content : "24 hours", ontap : "button24", style:"margin-left:140px"}, 
				{kind : "onyx.Button", content : "7 days", ontap : "button7"},
				{kind : "onyx.Button", content : "30 days", ontap : "button30"} 
			]},
			
			{name : "btnContent", content: "24 Hours Costs Chart", style : "font-weight: bold;width:300px;margin:auto;padding:0 110px 0 200px"}, 
			{kind: "Scroller", fit:true, components:[
			{kind : "Panels", name : "chartPanel", style : "background:#F3F3F7; height:500px; width:605px; margin: auto;border:1px solid #DBDBDE", components : [
			   {name : "chart",kind : "chart"} 
			]}]},
			{kind : "onyx.Toolbar", content : "Active Machines", name : "title_3", style : "background:#b1c2d7; margin-top:10px;border:1px solid #375d8c;background-size:contain;color:#375d8c"},

			{name : "groupbox", kind : "onyx.Groupbox", style : "border-bottom: 1px solid #88B0F2",components : [
			   {name : "machines", style : "padding: 10px 0 1px 10px", components : [
					{content : "Name", style : "display: inline-block; width:25%;font-weight: bold"},
					{content : "Activity", style : "display: inline-block; width:25%;font-weight: bold"},
					{content : "Age", style : "display: inline-block; width:25%;font-weight: bold"},
					{content : "Total Cost", style : "display: inline-block; width:25%;font-weight: bold"}, 
			    ]} 
			]},
			{name: "activeMachines", style: "padding-top:10px; padding-bottom:70px;", components:[		
			    {content : "HP", style: "font-weight: bold; font-size:20px;"},
			    {content : "...", style: "font-weight: bold; font-size:20px;"},
			    {content : "...", style: "font-weight: bold; font-size:20px;"},
			    {content : "HP", style: "font-weight: bold; font-size:20px;"}
			 ]}
			]},
					
			{kind : "onyx.Toolbar", name : "toolbar", style : "background:#b1c2d7;position:absolute;bottom:0;width:100%;border:1px solid #375d8c;background-size:contain", components : [
				{kind : "onyx.Button", style : "background-color:#FFFFFF;color:#375d8c;border-color:#375d8c; float:right", content : "Close", ontap : "closePanel"},
				{kind : "onyx.Button", style : "background-color:#FFFFFF;color:#375d8c;border-color:#375d8c", content : "Edit Account", ontap : "editAccount"} 
			]}
	],
	create: function(){
		this.inherited(arguments)
		var popup = new spinnerPopup();
		popup.show();
		this.$.account.setContent(this.account.name);
		this.$.description.setContent(this.account.description);
		this.$.cloudName.setContent(this.account.cloudName);
		
//		var ajaxComponent = new enyo.Ajax({
//			url: serverAddress+"account",
//			headers:{ 'authorization' : "Basic "+ this.uid},
//			method: "GET",
//			contentType: "application/x-www-form-urlencoded",
//			sync: false, 
//		}); 
//				
//		ajaxComponent.go()
//		.response(this, function(sender, response){
//			response.elements = fixArrayInformation(response.elements);
//			results = response.elements;
//			this.$.list.setCount(results.length);
//			this.$.list.reset();
//		})
//		.error(this, function(){
//			console.log("Error to load the detail of the command!");
//			popup.delete();
//		});		
	},
	itemSelected: function(sender, event){
		if (event.originator.content){
			this.$.cost.setPlaceholder(event.originator.content);
		}
	},
	button24: function(sender, event){
		this.$.btnContent.setContent("24 Hours Costs Chart");
	},
	button7: function(sender, event){
		this.$.btnContent.setContent("7 Days Costs Chart");
	},
	button30: function(sender, event){
		this.$.btnContent.setContent("30 Days Costs Chart");
	},
	closePanel: function(inSender, inEvent){
		var panel = inSender.parent.parent.parent;
		
		panel.setIndex(2);				
		panel.getActive().destroy();					
		panel.panelCreated = false;
		
		if (enyo.Panels.isScreenNarrow()) {
			panel.setIndex(1);
		}
		else {
			panel.setIndex(0);
		}		
		
		panel.reflow();		
	}	
});