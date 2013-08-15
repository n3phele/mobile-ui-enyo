var days;
var accountId;
var chartData = null;
var gap = 1;

/*
	This Kind represent the screen of account detail, that contains informations of a selected account.
*/
enyo.kind({
	name : "AccountDetails",
	kind: "FittableRows",
	fit: true,
	style: "padding: 0px",
	events: {
		onEditAcc: "", //this fuction occurs when the user clicked on edit account button
		onBack: "", //this fuction occurs when the user clicked on back button
        onRemoveAccount:"", //this fuction occurs when the user clicked on delete button
		onSelectMachine:"", //this fuction occurs when the user clicked on the link in active machines
		onLost:"", //this fuction occurs when the connection is lost
	},

	//create components of interface
	components : [
		{kind : "Scroller", style: "background: #fff", classes : "scroller-sample-scroller enyo-fit", components : [

			//Top toolbar that contains Title, Edit account button and back button ***************************************************************
		 	{kind : "onyx.Toolbar", name: "toolTop", classes: "toolbar-style", components: [
		 		{content : "Account"},
		 		{kind : "onyx.Button", classes:"button-style-left",content : "Accounts", ontap : "back"},
				{kind : "onyx.Button", classes:"button-style-right", content : "Edit", ontap : "editAccount"}
			]},

			//Show the Name, cloud name and description of account on the top***************************************************************
			{name : "account", style : "margin:5px 0 0 10px; font-weight: bold;"},
			{name : "description", style : "margin-top:0; text-align:center"},
			{content : "On Cloud: ", style : "margin:5px 0 0 10px;font-weight: normal;display: inline-block"},
			{name : "cloudName", style : "margin:5px 0 5px 10px;display:inline-block"},
			{kind : "onyx.Toolbar", content : "History", name : "title_2",classes: "toolbar-style"},
		   
		   	//Panel of selection the type of chart, like cost or cumulative cost ***************************************************************
			{name: "SelPanel", style: "text-align: center; margin: 1em auto;", components: [
				{kind:"Select", classes:"styled-select", name:"select", onchange:"typeOfCost", style:"-webkit-appearance:none !important;outline:none; width: 290px !important;",components:[ 
					{content:"Cost", value:"Cost"},
					{content:"Cumulative Cost", content:"Cumulative Cost"}						                                                             
				]}
			]},	
			
			//Panel of buttons that select the time of costs on chart ***************************************************************
			{name: "btnPanel", style: "text-align: center; margin: 1em auto;", components: [
				{kind : "onyx.Button", content : "24 hours", ontap : "button24",classes:"button-style"}, 
				{kind : "onyx.Button", content : "7 days", ontap : "button7",  style: "margin-left: 10px;",classes:"button-style"},
				{kind : "onyx.Button", content : "30 days", ontap : "button30",  style: "margin-left: 10px;", classes:"button-style"}
			]},

			{name : "btnContent", content: "24 Hours Costs Chart", style : "font-weight: bold; text-align: center;"}, 			
			{kind : "Panels", name : "chartPanel", style : "background:#F3F3F7; width:90%; margin: auto;border:1px solid #DBDBDE", onresize:"resizeChart", components:[]},
			{tag: "br"},

		   	//Panel of actives machine on this account ******************************************************************
			{kind : "onyx.Toolbar", content : "Active Machines", name : "title_3", classes: "toolbar-style"},
			{name : "groupbox", kind : "onyx.Groupbox", style : "border-bottom: 1px solid #768BA7",components : [
			   {name : "machines", style : "padding: 10px 0 1px 10px;border-radius:0", components : [
					{content : "Name", style : "display: inline-block; width:25%;font-weight: bold"},
					{content : "Activity", style : "display: inline-block; width:25%;font-weight: bold"},
					{content : "Age", style : "display: inline-block; width:25%;font-weight: bold"},
					{content : "Total Cost", style : "display: inline-block; width:25%;font-weight: bold"}, 
				]} 
			]},
			
			{name: "activeMachines", style: "padding: 10px 0 1px 10px;border-radius:0" ,components:[]},
			 
		   	//button that delete the account ****************************************************************************
			{name: "buttons",style:"text-align:center",  components:[  		
				{kind: "onyx.Button",  classes:"button-newStack",  style:"width:98%;height:40px;margin:1em auto;background-image:-webkit-linear-gradient(top,#B5404A 100%,#9E0919 100%) !important" ,content: "Delete Account", ontap: "removeAccount"}			
			]},
		]},
   	],

   	/*
		this function create the content of the account and create a chart cost 24 hours.
	*/
	create: function(){
		this.inherited(arguments)
		
		this.$.account.setContent(this.account.accountName);
		this.$.description.setContent(this.account.description);		
	    this.$.cloudName.setContent(this.account.cloud);

		accountId = this.account.uriAccount;
		accountId = accountId.substr(accountId.lastIndexOf('/'), accountId.length);
		
		//create the chart passing the number of days and the content that identify that time
		this.setChart(1, "24 Hours Costs Chart");
	},

	/*
		Create the chart passing the number of days and the content that identify that time, and get the selected type of cost 
	*/
	typeOfCost: function(sender, event){
		this.setChart(this.days, this.$.btnContent.content);
	},

	/*
		Create the chart of 24 hours cost when clicked on the 24 hours button
	*/
	button24: function(sender, event){
		this.setChart(1, "24 Hours Costs Chart");
	},

	/*
		Create the chart of 7 days cost when clicked on the 7 days button
	*/
	button7: function(sender, event){
		this.setChart(7, "7 Days Costs Chart"); 
	},

	/*
		Create the chart of 30 days cost when clicked on the 30 days button
	*/
	button30: function(sender, event){
		this.setChart(30, "30 Days Costs Chart");   
	},

	/*
		this function back to the Account List screen
	*/
	back: function( sender , event){
		this.doBack(event);
	},

	/*
		this function occurs when the edit account button is clicked and goes to the Edit Account screen
	*/
	editAccount: function(sender, envent){
		this.doEditAcc(this.account);
	},
	
	/*
		this function get the necessary informations by request to setup the chart using Ajax
	*/
	setChart: function(days, title){
		
		this.$.btnContent.setContent(title);
		this.days = days;

		var ajaxComponent = n3phele.ajaxFactory.create({
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
			this.getAccountActivities();
			this.chartData = results;
			this.resizeChart();
		})
		.error(this, function(inSender, inResponse){
		 	if(inSender.xhrResponse.status == 0) {
		  		alert("Connection Lost");
		  		this.doLost();
		 	}	
		});     
	},


	/*
		this function calculates the size of the chart should be rendered, depending on screen size
	*/
	resizeChart: function(){

		if (this.chartData != null) {
			var placeholder = $("#n3phele_accountDetails_chartPanel");
			noTicks = Math.ceil(placeholder.width() / 50);
			var maxTicks = (this.days == 1) ? 24 : this.days;
			if (maxTicks < noTicks) noTicks = maxTicks;

			this.gap = Math.ceil(maxTicks / noTicks);

			this.createChart(this.chartData, this.$.select.getValue());

		}
	},

	/*
		this function create the chart with the selected content
	*/
	createChart: function(data, type){

		var chartData = [];
		var chartPanel = $("#n3phele_accountDetails_chartPanel");
		var height;
		
		if (document.height > document.width) {
			height = document.height * 0.5;
		}
		else{
			height = document.height * 0.7;
		}

		chartPanel.css("height", height + "px");
		
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

		$.plot(chartPanel, [ chartData ], options);
	},

	/*
		this function create the content of the list, and do a request tho the server to populate this list.
	*/
	getAccountActivities: function(){

		var ajaxComponent = n3phele.ajaxFactory.create({
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
			
				if(results[i].name.length >= 7 && enyo.Panels.isScreenNarrow()){   
					var aux = results[i].name.substr(0,5)
					aux = aux.concat("...")
			   		this.createComponent({content : aux, style: "display: inline-block; text-decoration: underline; color: #f000; width:25%;font-weight: bold; font-size:17px;", ontap: "getActivity",container: this.$.activeMachines}).render();             
			  	}
			  	else{
			  		this.createComponent({content : results[i].name, style: "display: inline-block; width:25%;font-weight: bold; font-size:17px;" ,container: this.$.activeMachines}).render();
			 	}  
				  
				if(results[i].nameTop.length >= 7 && enyo.Panels.isScreenNarrow()){   
						var aux = results[i].nameTop.substr(0,5)
						aux = aux.concat("...")
			   			this.createComponent({content : aux, style: "display: inline-block; text-decoration: underline; color: #768BA7; width:25%;font-weight: bold; font-size:17px;", ontap: "getActivity",container: this.$.activeMachines}).render();
			  	}
				else{
					this.createComponent({content : results[i].nameTop, style: "display: inline-block; text-decoration: underline; color: #768BA7; width:25%;font-weight: bold; font-size:17px;", ontap: "getActivity",container: this.$.activeMachines}).render();
				}

				this.createComponent({content : results[i].age, style: "display: inline-block; width:25%;font-weight: bold; font-size:17px;", container: this.$.activeMachines}).render();
				this.createComponent({content : results[i].cost, style: "display: inline-block; width:25%;font-weight: bold; font-size:17px;", container: this.$.activeMachines}).render();
				this.createComponent({content : "", style: "display: inline-block; width:100%;font-weight: bold;border-top:2px solid #333333;padding-top:10px", container: this.$.activeMachines}).render();
			}
		})
		.error(this, function(inSender, inResponse){
		 	if(inSender.xhrResponse.status == 0) 
		 		this.doLost();
		}); 
	},

	/*
		this function occurs when the delete account button is clicked and goes to the Remove Account screen
	*/
	removeAccount:function (sender,event)
	{   
        this.doRemoveAccount(this.account);
	},

	/*
		this function goes to the activity page of a running machine
	*/
	getActivity:function(sender,event){  
	  console.log(sender.getContent());
		for (var i = 0; i < results.length; i++) {
	    	console.log("Caminhando:" + i + "content:" + sender.getContent());
	    	
	    	if(sender.getContent() == results[i].nameTop || sender.getContent() == results[i].nameTop.substr(0,5).concat("...") ) { 
		 		console.log(results[i].uriTopLevel); 
				 var obj =  new Object();
				obj.name = results[i].uriTopLevel
				obj.num = 1;
				 this.doSelectMachine(obj); //Sending obj with uritoplvl
			 	break;
			}
	  	}
	}
});