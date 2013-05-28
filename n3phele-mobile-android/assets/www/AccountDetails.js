var days;
var accountId;
var chartData = null;
var gap = 1;
enyo.kind({
	name : "AccountDetails",
	kind: "FittableRows",
	fit: true,
	style: "padding: 0px",
	events: {
		onEditAcc: "",
		onBack: ""      
	},
	components : [
		{kind : "Scroller",
		style: "background: #fff",
		classes : "scroller-sample-scroller enyo-fit",
		components : [
		 {kind : "onyx.Toolbar", name: "toolTop", classes: "toolbar-style", components: [{ content : "Account"},{kind : "onyx.Button", classes:"button-style-left",content : "Activity List", ontap : "backMenu"},
				{kind : "onyx.Button", classes:"button-style-right", content : "Edit", ontap : "editAccount"}]},
			{content : "Name of Account", name : "account", style : "margin:5px 0 0 10px; font-weight: bold;"},
			{content : "Name of Account", name : "description", style : "margin-top:0; text-align:center"},
			{content : "Name of Cloud", name : "cloudName", style : "margin:5px 0 5px 10px"},
			{kind : "onyx.Toolbar", content : "History", name : "title_2",classes: "toolbar-style"},
		   
			{name : "Panel", kind : "FittableRows", classes : "onyx-sample-tools", style: "margin: 1em auto;width: 360px;padding-left:70px", components : [  
				{name:"select", kind: "Select", classes:"styled-select", onchange:"itemSelected", style:"-webkit-appearance:none !important;outline:none;width: 80% !important; margin-bottom:10px",components:[             /* <<<<--------------------- */
					{content:"Cost", value:"Cost"},
					{content:"Cumulative Cost", content:"Cumulative Cost"}						                                                             /* <<<<--------------------- */
				]},	
				{kind : "onyx.Button", content : "24 hours", ontap : "button24",  classes:"button-style"}, 
				{kind : "onyx.Button", content : "7 days", ontap : "button7",  classes:"button-style"},
				{kind : "onyx.Button", content : "30 days", ontap : "button30",  classes:"button-style"} 
			]},
			
			{name : "btnContent", content: "24 Hours Costs Chart", style : "font-weight: bold;width:205px;margin:auto;padding:0 110px 0 110px"}, 
			//{kind: "Scroller", fit:true, components:[
			{kind : "Panels", name : "chartPanel", style : "background:#F3F3F7; height:70%; width:90%; margin: auto;border:1px solid #DBDBDE", onresize:"resizeChart", components : [
			   
			]},//]},
			{tag: "br"},
			{kind : "onyx.Toolbar", content : "Active Machines", name : "title_3", classes: "toolbar-style"},

			{name : "groupbox", kind : "onyx.Groupbox", style : "border-bottom: 1px solid #768BA7",components : [
			   {name : "machines", style : "padding: 10px 0 1px 10px;border-radius:0", components : [
					{content : "Name", style : "display: inline-block; width:25%;font-weight: bold"},
					{content : "Activity", style : "display: inline-block; width:25%;font-weight: bold"},
					{content : "Age", style : "display: inline-block; width:25%;font-weight: bold"},
					{content : "Total Cost", style : "display: inline-block; width:25%;font-weight: bold"}, 
				]} 
			]},
			{name: "activeMachines", style: "padding-top:10px; padding-bottom:7px;", components:[       	
			 ]}
			]},     
	],
	create: function(){
		this.inherited(arguments)
		var popup = new spinnerPopup();
		popup.show();
		this.$.account.setContent(this.account.name);
		this.$.description.setContent(this.account.description);
		this.$.cloudName.setContent(this.account.cloudName);
		accountId = this.account.uri;
		accountId = accountId.substr(accountId.lastIndexOf('/'), accountId.length);
		this.setChart(1, "24 Hours Costs Chart");
		
	},
	itemSelected: function(sender, event){
			this.setChart(this.days, this.$.btnContent.content);
	},
	button24: function(sender, event){
		this.setChart(1, "24 Hours Costs Chart");
	},
	button7: function(sender, event){
		this.setChart(7, "7 Days Costs Chart"); 
	},
	button30: function(sender, event){
		this.setChart(30, "30 Days Costs Chart");   
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
	},
	backMenu: function( sender , event){
		this.doBack();
	},
	editAccount: function(sender, envent){
		this.doEditAcc(this.account);
	},
	
	setChart: function(days, title){
		this.$.btnContent.setContent(title);
		this.days = days;
		var ajaxComponent = new enyo.Ajax({
			url: serverAddress+"account"+ accountId + "/lastcompleted/" + days +"/get",
			headers:{ 'authorization' : "Basic "+ this.uid},
			method: "GET",
			contentType: "application/x-www-form-urlencoded",
			sync: false, 
		}); 
				
		ajaxComponent.go()
		.response(this, function(sender, response){
			response.elements = fixArrayInformation(response.elements);
			results = response.elements;
			//this.createComponent({name : "chart",kind : "chart", "data": results, "type": this.$.cost.getPlaceholder(), container: this.$.chartPanel}).render();
			this.getAccountActivities();
			//this.createChart(results, this.$.cost.getPlaceholder());
			this.chartData = results;
			this.resizeChart();
		})
		.error(this, function(){
		console.log("Error to load the detail of the command!");
		});     
		
	},

	createChart: function(data, type){
		var chartData = [];
		
		for(var i = 0; i < data.length; i++){
			chartData[i] = [i, parseFloat(data[i])];
		}

		if (type == "Cumulative Cost") {
			for (var i = 1; i < chartData.length; i++) {
				chartData[i][1] = chartData[i][1] + chartData[i - 1][1];
			}
		}

		var ticksOptions = [];
		var fontsize;
		var date = new Date();

		if (this.days == 1) {
			fontsize = 11;
			date.setHours(date.getHours() - 23);
			for (var i = 0; i < chartData.length; i+=this.gap) {
				ticksOptions[i] = [i, date.getHours()+ "h"];
				date.setHours(date.getHours() + this.gap);
			}
		}
		else{
			date.setDate(date.getDate() - (this.days - 1));
			var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
			fontsize = (this.days==30)? 9:13;
			for (var i = 0; i < chartData.length; i+=this.gap) {
				ticksOptions[i] = [i, monthNames[date.getMonth()] + "" + date.getDate()];
				date.setDate(date.getDate() + this.gap);
			}
		}

		var noTickSize = (this.days == 1) ? 24 : this.days;

		var options = {
			xaxis: {
				ticks: ticksOptions,
				font: {size: fontsize, style: "italic",weight: "bold" , color:"black"},
			}
		};

		$.plot($("#n3phele_accountDetails_chartPanel"), [ chartData ], options);
	},

	getAccountActivities: function(){
		var ajaxComponent = new enyo.Ajax({
			url: serverAddress+"account"+ accountId + "/runningprocess/get",
			headers:{ 'authorization' : "Basic "+ this.uid},
			method: "GET",
			contentType: "application/x-www-form-urlencoded",
			sync: false, 
		}); 
				
		ajaxComponent.go()
		.response(this, function(sender, response){
			this.$.activeMachines.destroyClientControls();
			response.elements = fixArrayInformation(response.elements);
			results = response.elements;
			
			for (var i = 0; i < results.length; i++) {
				this.createComponent({content : results[i].name, style: "display: inline-block; width:25%;font-weight: bold; font-size:20px;", container: this.$.activeMachines}).render();
				this.createComponent({content : results[i].nameTop, style: "display: inline-block; text-decoration: underline; color: #f000; width:25%;font-weight: bold; font-size:20px;", container: this.$.activeMachines, ontap: "backMenu"}).render();
				this.createComponent({content : results[i].age, style: "display: inline-block; width:25%;font-weight: bold; font-size:20px;", container: this.$.activeMachines}).render();
				this.createComponent({content : results[i].cost, style: "display: inline-block; width:25%;font-weight: bold; font-size:20px;", container: this.$.activeMachines}).render();
			};

		})
		.error(this, function(){
		console.log("Error to load the detail of the command!");
		}); 
	},

	resizeChart: function(){

		if (this.chartData != null) {
			var placeholder = $("#n3phele_accountDetails_chartPanel");
			noTicks = Math.ceil(placeholder.width() / 50);
			var maxTicks = (this.days == 1) ? 24 : this.days;
			if (maxTicks < noTicks) noTicks = maxTicks;

			this.gap = Math.ceil(maxTicks / noTicks);

			this.createChart(this.chartData, this.$.select.getValue());

		}
	}
	
});