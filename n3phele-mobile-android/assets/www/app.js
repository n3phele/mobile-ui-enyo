var createCommandItems = function(arrayOfCommands, arrayOfImages) {
	list = [];
	for (var i in arrayOfCommands)
	{
		var widget = { name: arrayOfCommands[i], displayName: arrayOfCommands[i], image: arrayOfImages[i] };
		list.push(widget);
	}
	return list;
}
var CommandData;
var FilesList = new Array();
var OutputFilesList = new Array();
var count = 0;
var countOutput = 0;
/*Main painels*/
enyo.kind({
	name: "com.N3phele",
	kind: "FittableRows",
	classes: "onyx enyo-fit",
	menu:["Files","Commands","Activity History","Accounts","Services"],	
	menuImages:["./assets/files.png","./assets/commands.png","./assets/activityHistory.png","./assets/accounts.png","./assets/service.png"],
	commands: null,
	commandsImages : null,
	serviceaction:null,
	id:null,
	published: {
		trackedRow: -1
	},
	trackedRowChanged: function(inOld) {
		// fixup the old row (no-op if inOld is out of range)
		this.$.list.renderRow(inOld);
		// mark the new row
		this.$.list.renderRow(this.trackedRow);
	},
	components: [
		{name:"N3pheleCommands", style: "display:none"},   //User cant slide panels if draggable is set to false
		{kind: "Panels", style: "background:#FFF", panelCreated : false, fit: true, touch: true,draggable:false ,classes: "panels-sample-sliding-panels", arrangerKind: "CollapsingArranger", wrap: false, components: [
			{name: "left", components: [
				{kind: "Scroller", classes: "enyo-fit", style: "background:#FFF", touch: true, components: [					
					{kind: "onyx.Toolbar", classes:"toolbar-style",  components: [ {content: "N3phele"}, {fit: true},
						{kind: "onyx.Button", name:"Logout", ontap:"logout", classes:"button-logout", content: "Logout"}
					]}, //Panel Title
					{name: "mainMenuPanel", style:"width:95%; margin:auto;", components:[//div to align content
					    {name:"n3pheleimg",kind:"Image", src:"assets/cloud-theme.gif", fit: true, style:  "padding-left:30px; padding-top: 15px;"},
						{name:"mainmenupn",kind: "onyx.Toolbar",classes: "toolbar-style", style: "padding:0",components:[ {content: "Main Menu"},{fit: true}]},					
						{kind: "List", name: "list",fit:true,touch:true,touchOverscroll:false, count:5, style: "height:"+(5*63)+"px", onSetupItem: "setupItemMenu", components: [
							{name: "menu_item",	ontap: "mainMenuTap", classes: "panels-sample-flickr-item", style: "box-shadow: -4px 0px 9px #768BA7", components: [
								{name:"menu_image",  kind:"Image", classes: "panels-sample-flickr-thumbnail"},	
								{name: "menu_option", classes: "panels-sample-flickr-title"},
								{name: "icon2", kind: "onyx.IconButton",classes: "panels-sample-flickr-icon", src: "assets/next.png", ontap: "mainMenuTap"}								
							]}							
						]}
					]}// end mainMenuPanel
				]}//end scroller
			]},
			{name: "imageIconPanel", style:"background:#FFF", kind:"FittableRows", fit:true, components:[
				{name: "imageIcon",kind: "enyo.Scroller"},		
			]}			
		]}
	],	
	/** It's called when the king is instanciated **/
	create: function() {
		this.inherited(arguments);
		var popup = new spinnerPopup();
		popup.show();
		if (enyo.Panels.isScreenNarrow() && (document.width < 400))
		{
	     this.$.n3pheleimg.hide();
		 this.$.mainmenupn.hide();
		}
		this.$.menu_item.addClass("menu");
         //test this!
		 document.addEventListener(("pause"), enyo.bind(this, this.paused), false);				
				
		var statejson = window.localStorage.getItem("laststate");

   if (statejson) {
      try {
         var state = enyo.json.parse(statejson);
      } catch (e) {
         // The JSON could not be parsed...
      }
   }		
        
		this.createComponent({name:"recent", kind: "RecentActivityList", classes: "menu", 'uid' : this.uid, onClick:"actList",container:this.$.mainMenuPanel,  n3pheleClient: n3phele }).render();			
		
		this.createComponent({
					kind: "CommandList", 
					'uid' : this.uid, 
					onSelectedCommand : "commandTap",
					onNewRepository : "newRepository",
					onBack: "backMenu",
					onLost:"logout",
					"closePanel": enyo.Panels,
					container: this.$.imageIconPanel
				}).render();
	},
	
	
	//paused func
	  paused: function()
   {
      window.localStorage.setItem("laststate", enyo.json.stringify(this.getState()));
   },   
   
	refreshActivityMenu:function(){
		this.$.recent.destroy();
		this.createComponent({name:"recent", kind: "RecentActivityList", classes: "menu", 'uid' : this.uid, onClick:"actList",container:this.$.mainMenuPanel,  n3pheleClient: n3phele });
		this.$.mainMenuPanel.render();
		this.$.mainMenuPanel.reflow();
	},
	
	destroyPanel: function(inSender, inEvent) {
		this.setIndex(2);				
		this.getActive().destroy();					
		this.panelCreated = false;
		
		if (enyo.Panels.isScreenNarrow()) {
			this.setIndex(1);
		}
		else {
			this.setIndex(0);
		}		
		this.reflow();
		this.owner.$.IconGallery.deselectLastItem();
	},			
	closePanel: function(){
		this.$.panels.setIndex(0);
		this.destroyPanel();
	},	
	setupItemMenu: function(inSender, inEvent) {// given some available data.
		this.$.menu_item.addRemoveClass("onyx-selected", inEvent.index == this.trackedRow);	
		this.$.menu_image.setSrc(this.menuImages[inEvent.index]);
		this.$.menu_option.setContent(this.menu[inEvent.index]);		
	},
	mainMenuTap: function(inSender, inEvent) {
		this.setTrackedRow(inEvent.index);	
	
		//Checking if the device has a small screen and adjust if necessary
		if (enyo.Panels.isScreenNarrow()) {
			this.$.panels.setIndex(1);
		}		

		if(this.$.panels.panelCreated)this.$.panels.destroyPanel(); //??
		
		this.$.imageIconPanel.destroyClientControls(); // clear second painel
		
		//Checking the menu selected
		switch(inEvent.index){
			case 0:
				//File menu
				this.closeSecondaryPanels(2);
				this.createComponent({
					kind: "RepositoryList", 
					'uid' : this.uid, 
					onSelectedItem : "repositorySelected",
					onNewRepository : "newRepository",
					onBack: "backMenu",
					onLost:"logout",
					callBy: "repositoryList",
					"closePanel": enyo.Panels,
					container: this.$.imageIconPanel
				});
				this.$.imageIconPanel.render();
						

			break;
			case 1:
				//Command Menu
				this.closeSecondaryPanels(2);
				this.createComponent({
					kind: "CommandList", 
					'uid' : this.uid, 
					onSelectedCommand : "commandTap",
					onNewRepository : "newRepository",
					onBack: "backMenu",
					onLost:"logout",
					"closePanel": enyo.Panels,
					container: this.$.imageIconPanel
				}).render();
			break;
			case 2:
				//Activity History
				this.closeSecondaryPanels(2);
				this.createComponent({
					kind: "ActivityList", 'uid' : this.uid, onBack: "backMenu",onLost:"logout","closePanel": enyo.Panels, onSelectedActivity: "selectedActivity", container: this.$.imageIconPanel, n3pheleClient: n3phele
				});
				this.$.imageIconPanel.render();	
			break;
			case 3:
				//Accounts
				this.closeSecondaryPanels(2);
				this.createComponent({
					name:"accountList",kind: "AccountList", 'uid' : this.uid, onCreateAcc: "newAccount", onClickItem: "accountDetail", "closePanel": enyo.Panels,onLost:"logout" ,onBack: "backMenu", container: this.$.imageIconPanel
				});
				this.$.imageIconPanel.render();	
			break;
			case 4:
				//Services
				
				this.closeSecondaryPanels(2);
				this.createComponent({
					kind: "ServiceList", 'uid' : this.uid, onCreateService: "newService", "closePanel": enyo.Panels, onBack: "backMenu",onLost:"logout" ,onClickService: "serviceDetail", container: this.$.imageIconPanel
				});
				this.$.imageIconPanel.render();	
			break;
			
			

			
			
		}//end switch
	},	
	logout: function(inSender){
		this.uid = null;
		this.destroy();
		window.location.assign("index.html");
	},
	backMenu: function(inSender){
		this.$.panels.setIndex(0);
	},
	actList: function(inSender,inEvent){	
	
	   this.closeSecondaryPanels(2);
	
	
		this.createComponent({ kind: "RecentActivityPanel",'url': inEvent.url ,"menulist":inEvent.menulist,"panels":inEvent.panels,"uid": inEvent.uid,onRerun:"reRun",onCancel:"CancelActivity",onBack: "closePanel",onBackMenu:"goBackAct",container: this.$.panels, n3pheleClient: n3phele }).render();
		this.$.panels.reflow();
		this.$.panels.setIndex(3);
	},
	setPanelIndex: function(index) {
		if (enyo.Panels.isScreenNarrow()) {
			this.$.panels.setIndex(index);
		}
		else {
			this.$.panels.setIndex(index-1);
		}
	},
	selectedActivity: function(sender, event){		
		this.openActivityPanel(event.uri);
	},
	commandExecuted: function(sender, event){	
			//close old panels	
		this.closeSecondaryPanels(4);		
		//create panel to show selected activity	
       	
		this.createComponent({ kind: "RecentActivityPanel", "uid": this.uid, 'url': event.location,"num":event.num ,onBack: "refreshCommands",onCancel:"CancelActivity" ,onRerun:"reRun", container: this.$.panels, n3pheleClient: n3phele }).render();
		this.refreshActivityMenu();		
		this.$.panels.reflow();
		this.$.panels.setIndex(5);	
	},
	openActivityPanel: function(uri){
		//close old panels	
		this.closeSecondaryPanels(2);		
		//create panel to show selected activity		
		this.createComponent({ kind: "RecentActivityPanel", "uid": this.uid, 'url': uri, onBack: "closeFilePanel",onCancel:"CancelActivity" ,onRerun:"reRun", container: this.$.panels, n3pheleClient: n3phele }).render();
		this.$.panels.reflow();
		this.$.panels.setIndex(3);	
	}	
	,	
	repositorySelected: function(inSender,inEvent){	
		//close old panels	
		this.closeSecondaryPanels(2);		
		//create panel of files based on repository selected
		this.createComponent({ kind: "RepositoryFileList", "uid": this.uid, "uri" : inEvent.uri, callBy: "repositoryList", "repositoryName" : inEvent.name ,onRemoveRepository: "RemoveRepository", onCreateFolder:"CreateFolder" , onOpenContent: "fileContent", onBack: "closeFilePanel", container: this.$.panels }).render();
		this.$.panels.reflow();
		this.$.panels.setIndex(3);
	},
	fileContent: function(inSender,inEvent){
		this.closeSecondaryPanels(3);
		this.createComponent({ kind: "FileContent", "name": inEvent.name, "uri": inEvent.uri,onBack:"closePanel4" ,container: this.$.panels}).render();
		this.$.panels.reflow();
		this.$.panels.setIndex(4);
	},
	newRepository: function(inSender,inEvent){	
		//close old panels	
		this.closeSecondaryPanels(2);		
		//create panel to create a new repository of files
		this.createComponent({ kind: "NewRepository", "uid": this.uid, "uri": inEvent.uri, onBack: "refreshRepository", container: this.$.panels }).render();
		this.$.panels.reflow();
		this.$.panels.setIndex(2);
	},	
	newRegistration: function(inSender,inEvent){	
		//close old panels	
		this.closeSecondaryPanels(2);		
		//create panel to create a new repository of files
		this.createComponent({ kind: "NewRegistration", "uid": this.uid, "uri": inEvent.uri, container: this.$.panels }).render();
		this.$.panels.reflow();
		this.$.panels.setIndex(2);
	},
	forgotPassword: function(inSender,inEvent){	
		//close old panels	
		this.closeSecondaryPanels(2);		
		//create panel to create a new repository of files
		this.createComponent({ kind: "ForgotPassword", "uid": this.uid, "uri": inEvent.uri, container: this.$.panels }).render();
		this.$.panels.reflow();
		this.$.panels.setIndex(2);
	},	
	newAccount: function(inSender,inEvent){		
		//close old panels	
		this.closeSecondaryPanels(2);		
		//create panel to create a new account
		this.createComponent({ kind: "CreateAccount", "uid": this.uid, "uri": inEvent.uri,onLost:"logout" ,onBack: "closeFilePanel",onSucess:"refreshAccountList", container: this.$.panels }).render();
		this.$.panels.reflow();
		this.$.panels.setIndex(2);
	},
	newService: function(inSender,inEvent){		
		//close old panels	
		this.closeSecondaryPanels(2);		
		//create panel to create a new account
		this.createComponent({ kind: "AddService", "uid": this.uid, "uri": inEvent.uri, onBack: "refreshServiceList", "service":inEvent.service , onBackCmd:"refreshCmd",container: this.$.panels }).render();
		this.$.panels.reflow();
		this.$.panels.setIndex(2);
	},
	RemoveRepository: function(inSender,inEvent){		
		//close old panels	
		this.closeSecondaryPanels(3);	
		//create panel to create a new account
		this.createComponent({ kind: "RemoveRepository", "uid": this.uid , "repository":inEvent,"uri": inEvent.uri, onBack: "closeFilePanel" , onDelete:"refreshRepository", container: this.$.panels }).render();
		this.$.panels.reflow();
		this.$.panels.setIndex(4);
	},	
	CreateFolder: function(inSender,inEvent){		
		//close old panels	
		this.closeSecondaryPanels(3);		
		//create panel to create a new account
		this.createComponent({ kind: "CreateFolder", "uid": this.uid , "repository":inEvent, "uri": inEvent.uri, onBack: "closePanel4", container: this.$.panels }).render();
		this.$.panels.reflow();
		this.$.panels.setIndex(4);
	},
	serviceDetail: function(inSender,inEvent){		
		//close old panels	
		this.closeSecondaryPanels(2);		
		//create panel to access account details
		this.createComponent({ kind: "ServiceDetails", "uid": this.uid, "uri": inEvent.uri, "service":inEvent ,"account": inEvent,onRemoveService: "DeleteService" ,onSelectedStack:"Stack" ,onCreateRelationship: "Relationship", onCreateStack: "newStack", onBack: "closeFilePanel", container: this.$.panels }).render();
		this.$.panels.reflow();
		this.$.panels.setIndex(3);
	},

	newStack: function(inSender,inEvent){		
		//close old panels	
		
		if(id==null)id = inEvent.id;
		this.closeSecondaryPanels(3);		
		//create panel to create a new stack
		this.createComponent({ kind: "NewStack", "uid": this.uid, "uri": inEvent.uri , "service":inEvent,onSelectedStack: "stackTap", onBack: "closePanel4", container: this.$.panels }).render();

		this.$.panels.reflow();
		this.$.panels.setIndex(4);
	},

	Stack: function(inSender,inEvent){		
		//close old panels	
		this.closeSecondaryPanels(3);		
		//create panel to create a new stack
		this.createComponent({ kind: "Stack", "uid": this.uid, "uri": inEvent.uri,"stack":inEvent  ,onSelectedStack: "StackInfo", onCreateRelationship:"Relationship",onBack: "closePanel4", container: this.$.panels }).render();
		this.$.panels.reflow();
		this.$.panels.setIndex(4);
	},
	StackInfo: function(inSender,inEvent){		
		//close old panels	
		this.closeSecondaryPanels(4);		
		//create panel to create a new stack
		this.createComponent({ kind: "StackInfo", "uid": this.uid, "info":inEvent  ,onBack: "closePanel5", container: this.$.panels }).render();
		this.$.panels.reflow();
		this.$.panels.setIndex(5);
	},
	
		Relationship: function(inSender,inEvent){		
		//close old panels			
		this.closeSecondaryPanels(4);
		//create panel to show stack detail
		this.createComponent({ kind: "Relationship","uid": this.uid, container: this.$.panels, onBack: "closePanel4" }).render();   //   'uri': inSender.data[inEvent.index].uri,
		this.$.panels.reflow();
		this.$.panels.setIndex(5);
	},
	

	accountDetail: function(inSender,inEvent){		
		//close old panels	
		this.closeSecondaryPanels(2);		
		//create panel to access account details
		this.createComponent({name:"accountDetails" ,kind: "AccountDetails", "uid": this.uid, "uri": inEvent.uri, "account": inEvent,onLost:"logout", onEditAcc:"editAccount", onBack: "refreshAccountList", onRemoveAccount:"removeAccount",onSelectMachine:"goToActivity",container: this.$.panels }).render();
		this.$.panels.reflow();
		this.$.panels.setIndex(3);
	},
	
	goToActivity:function(inSender,inEvent)
	{  
	//close old panels	
		this.closeSecondaryPanels(3);		
		//create panel to show selected activity		
		this.createComponent({ kind: "RecentActivityPanel", "uid": this.uid, 'url': inEvent.name,"num":inEvent.num ,onBack: "closePanel4", onRerun:"reRun", container: this.$.panels, n3pheleClient: n3phele }).render();
		this.$.panels.reflow();
		this.$.panels.setIndex(4);	
	
	  //console.log(sender);
	},
	removeAccount: function(inSender,inEvent)
	{
	//close old panels	
		this.closeSecondaryPanels(3);		
		//create panel to access account details
		this.createComponent({kind: "RemoveAccount", "uid": this.uid, "uri": inEvent.uri, "account": inEvent, onBack: "closePanel4", onDelete:"refreshAccountList",container: this.$.panels }).render();
		this.$.panels.reflow();
		this.$.panels.setIndex(4);
	},
	editAccount: function(inSender,inEvent){		
		//close old panels	
		this.closeSecondaryPanels(3);		
		//create panel to access account details
		this.createComponent({ kind: "EditAccount", "uid": this.uid, "account": inEvent ,"uri": inEvent.uri, "account": inEvent, onBack: "closePanel4",onEdit:"refreshAccountList" ,container: this.$.panels }).render();
		this.$.panels.reflow();
		this.$.panels.setIndex(4);
	},
	addFileInRepository: function(inSender,inEvent){	
		//close old panels	
		countOutput = inEvent.index;
		this.closeSecondaryPanels(2);		
		//create panel of files based on repository selected
		this.createComponent({ kind: "SelectRepository", "uid": this.uid, "uri" : inEvent.uri, onSelectRepository: "listOutputRepository", onBack: "fileSelected", container: this.$.panels }).render();
		this.$.panels.reflow();
		this.$.panels.setIndex(3);
	},
	listRepository: function(inSender,inEvent){	
		count = inEvent.event.index;
		
		//close old panels		
		this.closeSecondaryPanels(2);	
		//create panel of Repositories to select a file
		this.createComponent({ kind: "RepositoryList", "uid": this.uid, callBy: "selectFile",onLost:"logout" ,"uri": inEvent.uri, "closePanel": enyo.Panels, onSelectedItem : "fileRepository", onBack: "closeFilePanel",onBackCommand:"fileSelected", container: this.$.panels }).render();
		this.$.panels.reflow();
		this.$.panels.setIndex(3);
	},
		listRepository2: function(inSender,inEvent){	
		count = inEvent.event.index;
		
		//close old panels		
		this.closeSecondaryPanels(5);	
		//create panel of Repositories to select a file
		this.createComponent({ kind: "RepositoryList", "uid": this.uid, callBy: "selectFile",onLost:"logout" ,"uri": inEvent.uri, onSelectedItem : "fileRepository2", onBack: "closePanel4",onBackCommand:"fileSelected2", container: this.$.panels }).render();
		this.$.panels.reflow();
		this.$.panels.setIndex(6);
	},
	listOutputRepository: function(inSender,inEvent){		
		//close old panels		
		this.closeSecondaryPanels(2);	
		//create panel of Repositories to select a file
		this.createComponent({ kind: "RepositoryList", "uid": this.uid, callBy: "outputFile","outputfile":inEvent.name ,"uri": inEvent.uri, "closePanel": enyo.Panels,onSelectedRepository:"outputFileRepository", onBackCommand:"fileSelected" ,onSelectedItem : "fileRepository", onBack: "closeFilePanel", container: this.$.panels }).render();
		this.$.panels.reflow();
		this.$.panels.setIndex(3);
	},
	fileRepository: function(inSender,inEvent){				
		//close old panels	
		this.closeSecondaryPanels(4);

       		
		//create panel of files based on repository selected
		this.createComponent({ kind: "RepositoryFileList", "uid": this.uid, "uri" : inEvent.uri, callBy: "selectFile", "repositoryName" : inEvent.name  ,onSelectedItem : "fileSelected",onBack: "closePanel4", container: this.$.panels }).render();
		this.$.panels.reflow();
		this.$.panels.setIndex(5);
	},
	fileRepository2: function(inSender,inEvent){				
			this.closeSecondaryPanels(6);
		//create panel of files based on repository selected
		this.createComponent({ kind: "RepositoryFileList", "uid": this.uid, "uri" : inEvent.uri, callBy: "selectFile", "repositoryName" : inEvent.name  ,onSelectedItem : "fileSelected2",onBack: "closePanel7", container: this.$.panels }).render();
		this.$.panels.reflow();
		this.$.panels.setIndex(7);
	},
		outputFileRepository: function(inSender,inEvent){				
		//close old panels	
		this.closeSecondaryPanels(4);		
		//create panel of files based on repository selected
		this.createComponent({ kind: "RepositoryFileList", "uid": this.uid, "uri" : inEvent.info.uri,"outputfile":inEvent.name ,callBy: "outputFile","repositoryName" : inEvent.info.name  ,onSelectedRepository : "fileSelected", onBack: "closeFilePanel", container: this.$.panels }).render();
		this.$.panels.reflow();
		this.$.panels.setIndex(5);
	},
	fileSelected: function(inSender,inEvent){
		//close old panels		
		
		this.closeSecondaryPanels(5);
		this.closeSecondaryPanels(4);
		this.closeSecondaryPanels(3);
		this.closeSecondaryPanels(2);
      if(inEvent.type == "input")		
		{
		FilesList[count] = inEvent;
		}
		else
		{
		 OutputFilesList[countOutput] = inEvent;
		}
		
		//create panel of details by selected Command 
		this.createComponent({ kind: "CommandDetail", "uid": this.uid, 'icon': this.$.CommandData.icon, "files": FilesList, "outputFiles": OutputFilesList,onOutputFile: "addFileInRepository", onSelectedFile: "listRepository", container: this.$.panels, 'uri': this.$.CommandData.uri, onCommandCreated: "commandExecuted", onNewService:"newService" }).render();
		this.$.panels.reflow();
		this.$.panels.setIndex(4);
	},
	fileSelected2: function(inSender,inEvent){
		//close old panels		
				this.closeSecondaryPanels(4);//close old panels
      if(inEvent.type == "input")		
		{
		FilesList[count] = inEvent;
		}
		else
		{
		 OutputFilesList[countOutput] = inEvent;
		}
		
		//create panel of details by selected Command 
		this.createComponent({ kind: "StackDetails", "uid": this.uid, 'icon': this.$.CommandData.icon, "files": FilesList, "outputFiles": OutputFilesList, onOutputFile: "addFileInRepository", onSelectedFile: "listRepository2", container: this.$.panels, 'uri': this.$.CommandData.uri, onCommandCreated: "commandExecuted" , "stack":serviceaction,"id":id,onBack: "closePanel5" }).render();
		this.$.panels.reflow();
		this.$.panels.setIndex(5);
	},
	closeFilePanel:function(inSender,inEvent){
		this.closeSecondaryPanels(2);
		this.setPanelIndex(1);
	},
	refreshRepository:function(inSender,inEvent)
	{  this.closeSecondaryPanels(2);
	   this.setPanelIndex(1);
       if(this.$.panels.panelCreated)this.$.panels.destroyPanel(); //??
       this.$.imageIconPanel.destroyClientControls(); // clear second painel
       this.createComponent({
					kind: "RepositoryList", 
					'uid' : this.uid, 
					onSelectedItem : "repositorySelected",
					onNewRepository : "newRepository",
					onBack: "backMenu",
					onLost:"logout",
					callBy: "repositoryList",
					"closePanel": enyo.Panels,
					container: this.$.imageIconPanel
				});
				this.$.imageIconPanel.render();	
	},
	refreshAccountList:function(inSender,inEvent)
	{
	   	this.setPanelIndex(1);
	    var obj = new Object();
		obj.index = 3;
		this.mainMenuTap(obj,obj);
	},
		refreshCmd:function(inSender,inEvent)
	{   
	   	this.setPanelIndex(1);
	    var obj = new Object();
		obj.index = 1;
		this.mainMenuTap(obj,obj);
	},
		CancelActivity:function(inSender,inEvent)
	{   

		//close old panels	
		this.closeSecondaryPanels(4);

       		
		//create panel of files based on repository selected
		this.createComponent({ kind: "CancelActivity", "uid": inEvent.uid, "uri" : inEvent.url,  "name" : inEvent.name  ,onBack: "closePanel4",onRefresh:"refreshAct" ,container: this.$.panels }).render();
		this.$.panels.reflow();
		this.$.panels.setIndex(5);
	},
	
	DeleteService:function(inSender,inEvent)
	{   

		//close old panels	
		this.closeSecondaryPanels(4);

       		
		//create panel of files based on repository selected
		this.createComponent({ kind: "DeleteService", "uid": inEvent.uid, "uri" : inEvent.uri,  "name" : inEvent.name  ,onBack: "closePanel4",onRefresh:"refreshDelete" ,container: this.$.panels }).render();
		this.$.panels.reflow();
		this.$.panels.setIndex(5);
	},
	refreshAct:function(inSender,inEvent)
	{
	  	this.setPanelIndex(1);
	    var obj = new Object();
		obj.index = 2;
	  
		this.mainMenuTap(obj,obj);
			setTimeout(enyo.bind(this, this.refreshActivityMenu ),300);
	
	
	},
		refreshServiceList:function(inSender,inEvent)
	{   
	   	this.setPanelIndex(1);
	    var obj = new Object();
		obj.index = 4;
		
		this.mainMenuTap(obj,obj);
		 
	setTimeout(enyo.bind(this, this.refreshActivityMenu ),300);
		
		
	},
	refreshDelete:function(inSender,inEvent)
	{   
	   	
		 
	setTimeout(enyo.bind(this, this.refreshServiceList ),500);
		
		
	},
	
	refreshCommands:function(inSender,inEvent)
	{
	this.setPanelIndex(1);
	    var obj = new Object();
		obj.index = 1;
		this.mainMenuTap(obj,obj);
	},
	goBackAct:function(inSender,inEvent)
	{
	   	this.setPanelIndex(1);
	    var obj = new Object();
		obj.index = 2;
		this.mainMenuTap(obj,obj);
	},

	closePanel4:function(inSender,inEvent){
		this.closeSecondaryPanels(3);
		this.$.panels.setIndex(2);
	},
	closePanel5:function(inSender,inEvent){
		this.closeSecondaryPanels(4);
		this.$.panels.setIndex(3);
	},
	closePanel7:function(inSender,inEvent){
		this.closeSecondaryPanels(6);
		this.$.panels.setIndex(5);
     },
	reRun: function(inSender,inEvent){
	this.closeSecondaryPanels(3);
	this.createComponent({ kind: "CommandDetail", "uid": this.uid, 'icon':"assets/Script.png" , onSelectedFile: "listRepository", backContent: inEvent.backContent, onOutputFile: "addFileInRepository", container: this.$.panels, 'uri': inEvent.actionUrl, onCommandCreated: "commandExecuted",onBack:"closePanel4",onNewService:"newService" }).render();
	this.$.panels.reflow();                       
	this.$.panels.setIndex(4);
	},
	/** When an command icon is actioned It will be runned**/
	commandTap: function(inSender, inEvent) {
		//check if command information is set
		if( !( inEvent.index in inSender.data ) ){
			alert("There is not commands in the database!");
			return;
		}
		this.closeSecondaryPanels(2);//close old panels
		//create panel of details by selected Command 
		this.createComponent({ kind: "CommandDetail", "uid": this.uid, 'icon': inSender.commandsImages[inEvent.index], onSelectedFile: "listRepository" ,onOutputFile: "addFileInRepository", container: this.$.panels, 'uri': inSender.data[inEvent.index].uri, onCommandCreated: "commandExecuted",onNewService:"newService" }).render();
		this.$.panels.reflow();
		this.$.panels.setIndex(2);
		this.$.CommandData = inSender.data[inEvent.index];
		//inSender.scrollIntoView(inSender.$["commandItem"+inEvent.index], false);
	},
	stackTap: function(inSender, inEvent) {
		//check if command information is set
		if( !( inEvent.index in inSender.data ) ){
			alert("There is not commands in the database!");
			return;
		}
		this.closeSecondaryPanels(4);//close old panels
	
		serviceaction = inSender.uri;
		//create panel of details by selected Command 

		//this.createComponent({ kind: "StackDetails", "uid": this.uid, 'icon': inSender.data[inEvent.index].icon, onSelectedFile: "listRepository2", onOutputFile: "addFileInRepository", container: this.$.panels, 'uri': inSender.data[inEvent.index].uri, onCommandCreated: "commandExecuted","stack": inSender.uri,"id":id ,onBack: "closePanel5" }).render();
		this.createComponent({ kind: "CommandDetail", "uid": this.uid, 'icon': inSender.commandsImages[inEvent.index], onSelectedFile: "listRepository2" ,onOutputFile: "addFileInRepository", container: this.$.panels, 'uri': inSender.data[inEvent.uri].uri, onCommandCreated: "commandExecuted", "stack": inSender.uri,"id":id ,onBack: "closePanel5", "stackdetail":true,onNewService:"newService" }).render();
		
		this.$.panels.reflow();
		this.$.panels.setIndex(5);
		this.$.CommandData = inSender.data[inEvent.index];
		//inSender.scrollIntoView(inSender.$["commandItem"+inEvent.index], false);
	},
	/** Used to set the default command icon when the icon address doesn't exist**/
	replaceWrongIcons: function( wrongIcons ){
		for(var i in wrongIcons){//it will change the icons that doesn't have icon
			var imageIndex = wrongIcons[i];
			this.commandsImages[imageIndex] = "./assets/Script.png";
		}
	},
	/** Used to fix wrong information in the command icon url **/
	fixCommandIconUrl: function( iconUrl ){
		var url = iconUrl;
			url = url.substring( url.search("/")+1 );//removing https
			url = "http://"+ url;
		
		if( url.search("/icons/") < 0 ){ //correcting wrong url
			var aux = url.split("/");
			var filename = aux[ aux.length - 1 ];
			var filenameIndex =  url.search( filename );
			url = url.substring(0,filenameIndex-1) +"/icons/"+ filename;
		}
		return url;		
	},
	/** It will close painels that are not needed anymore **/
	closeSecondaryPanels: function(level){
		var panels = this.$.panels.getPanels();

		if( panels.length > level ){// Is there panels opened? close it
			
			for(var i=level; i < panels.length ;){
				panels[i].destroy();
			}
			
			this.$.panels.reflow();
		}	
	}
});