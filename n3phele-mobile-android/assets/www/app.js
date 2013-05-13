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
var count = 0;
/*Main painels*/
enyo.kind({
	name: "com.N3phele",
	kind: "FittableRows",
	classes: "onyx enyo-fit",
	menu:["Files","Commands","Activity History","Accounts","Services"],	
	menuImages:["./assets/files.png","./assets/commands.png","./assets/activityHistory.png","./assets/accounts.png","./assets/service.png"],
	commands: null,
	commandsImages : null,
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
		{name:"N3pheleCommands", style: "display:none"},
		{kind: "Panels", style: "background-color: #eef2f5", panelCreated : false, fit: true, touch: true, classes: "panels-sample-sliding-panels", arrangerKind: "CollapsingArranger", wrap: false, components: [
			{name: "left", components: [
				{kind: "Scroller", classes: "enyo-fit", touch: true, components: [					
					{kind: "onyx.Toolbar", components: [ {content: "N3phele"}, {fit: true} ]}, //Panel Title
					{name: "mainMenuPanel", style:"width:90%;margin:auto", components:[//div to align content
					    {kind:"Image", src:"assets/cloud-theme.gif", fit: true, style:  "padding-left:30px; padding-top: 30px;"},
						{classes: "onyx-sample-divider", content: "Main Menu", style: "color: #375d8c"},					
						{kind: "List", name: "list", fit: true, touch:true, count:5, style: "height:"+(5*65)+"px", onSetupItem: "setupItemMenu", components: [
							{name: "menu_item",	classes: "panels-sample-flickr-item", ontap: "mainMenuTap", style: "box-shadow: -4px 0px 4px rgba(0,0,0,0.3);", components: [
								{name:"menu_image", kind:"Image"},
								{name: "menu_option",kind:"Image"}]},
						]}
					]}// end mainMenuPanel
				]}//end scroller
			]},
			{name: "imageIconPanel", kind:"FittableRows", fit:true, components:[
				{name: "imageIcon",kind: "enyo.Scroller"},				
			]}			
		]}
	],	
	/** It's called when the king is instanciated **/
	create: function() {
		this.inherited(arguments);
		var popup = new spinnerPopup();
		popup.show();
		if (!enyo.Panels.isScreenNarrow())
			this.$.mainMenuPanel.createComponent({ kind: "RecentActivityList", 'uid' : this.uid});
	
		//setting connection parameters
		var ajaxComponent = new enyo.Ajax({
			url: serverAddress+"command",
			headers:{ 'authorization' : "Basic "+ this.uid},
			method: "GET",
			contentType: "application/x-www-form-urlencoded",
			sync: false, 
		});
		
		//Requesting service reply
		ajaxComponent
		.go({'summary' : true, 'start' : 0, 'end' : 16, 'preferred' :true})
		.response( this, function( sender, response ){
			if(response.total == 0){alert("There is no recent activities!");return;}
			
			this.commandsData = response.elements;//get the response
			this.commandsData = fixArrayInformation(this.commandsData);
			this.commands = new Array();
			this.commandsImages = new Array();
			
			var waiting = 0;
			var errorIndex = new Array();// array containing the index of the icons that did exists 
			for( var i in this.commandsData ){//set comand list information
				this.commands.push( this.commandsData[i].name ); //set name
				
				var iconUrl = this.commandsData[i].icon; //get icon url
					iconUrl = this.fixCommandIconUrl( iconUrl );//fix icon url 
				
			this.commandsData[i].icon = iconUrl;
				this.commandsImages.push( iconUrl ); //set icon url fixed

				//checking if icon exists
				waiting++;
				var test = new enyo.Ajax({ url : iconUrl, handleAs: "text", index: i });
	
		test.go().response(this,function(sender, response){
					waiting--;
					if(waiting == 0) this.replaceWrongIcons(errorIndex);
					popup.delete();
				}).error(this,function(sender, response){
					waiting--;
					errorIndex.push( sender.index );//adding icon with error
				if(waiting == 0) this.replaceWrongIcons(errorIndex);	
					popup.delete();
				});
			}// end for( var i in response.elements )
		})
		.error( this, function(){ console.log("Error to load the list of commands!!"); popup.delete();});
		this.createCommandList();
		this.$.panels.render();
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
	
		//Checking if the device has a small screen and adjust if necessa
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
					callBy: "repositoryList",
					"closePanel": enyo.Panels,
					container: this.$.imageIconPanel
				});
				this.$.imageIconPanel.render();
			break;
			case 1:
				//Command Menu
				this.closeSecondaryPanels(2);
				this.createCommandList();
			break;
			case 2:
				//Activity History
				this.closeSecondaryPanels(2);
				this.$.imageIconPanel.createComponent({
					kind: "ActivityList", 'uid' : this.uid, onBack: "backMenu", "closePanel": enyo.Panels
				});
				this.$.imageIconPanel.render();	
			break;
			case 3:
				//Accounts
				this.closeSecondaryPanels(2);
				this.createComponent({
					kind: "AccountList", 'uid' : this.uid, onCreateAcc: "newAccount", onClickItem: "accountDetail", "closePanel": enyo.Panels, onBack: "backMenu", container: this.$.imageIconPanel
				});
				this.$.imageIconPanel.render();	
			break;
			case 4:
				//Services
				this.closeSecondaryPanels(2);
				this.createComponent({
					kind: "ServiceList", 'uid' : this.uid, onCreateService: "newService", onRemoveService: "removeService", "closePanel": enyo.Panels, onBack: "backMenu", onClickService: "serviceDetail", container: this.$.imageIconPanel
				});
				this.$.imageIconPanel.render();	
			break;
		}//end switch
	},	
	
	backMenu: function(){
		this.$.panels.setIndex(0);
	},
	setPanelIndex: function(index) {
		if (enyo.Panels.isScreenNarrow()) {
			this.$.panels.setIndex(index);
		}
		else {
			this.$.panels.setIndex(index-1);
		}
	},
	repositorySelected: function(inSender,inEvent){	
		//close old panels	
		this.closeSecondaryPanels(2);		
		//create panel of files based on repository selected
		this.createComponent({ kind: "RepositoryFileList", "uid": this.uid, "uri" : inEvent.uri, callBy: "repositoryList", "repositoryName" : inEvent.name , onBack: "closeFilePanel", container: this.$.panels }).render();
		this.$.panels.reflow();
		this.$.panels.setIndex(3);
	},
	
	newRepository: function(inSender,inEvent){	
		//close old panels	
		this.closeSecondaryPanels(2);		
		//create panel to create a new repository of files
		this.createComponent({ kind: "NewRepository", "uid": this.uid, "uri": inEvent.uri, onBack: "closeFilePanel", container: this.$.panels }).render();
		this.$.panels.reflow();
		this.$.panels.setIndex(2);
	},
	newAccount: function(inSender,inEvent){		
		//close old panels	
		this.closeSecondaryPanels(2);		
		//create panel to create a new account
		this.createComponent({ kind: "CreateAccount", "uid": this.uid, "uri": inEvent.uri, onBack: "closeFilePanel", container: this.$.panels }).render();
		this.$.panels.reflow();
		this.$.panels.setIndex(2);
	},
	newService: function(inSender,inEvent){		
		//close old panels	
		this.closeSecondaryPanels(2);		
		//create panel to create a new account
		this.createComponent({ kind: "AddService", "uid": this.uid, "uri": inEvent.uri, onBack: "closeFilePanel", container: this.$.panels }).render();
		this.$.panels.reflow();
		this.$.panels.setIndex(2);
	},
	removeService: function(inSender,inEvent){		
		//close old panels	
		this.closeSecondaryPanels(2);
        console.log(inEvent);		
		//create panel to create a new account
		this.createComponent({ kind: "RemoveService", "uid": this.uid,"service":inEvent ,"uri": inEvent.uri, onBack: "closeFilePanel", container: this.$.panels }).render();
		this.$.panels.reflow();
		this.$.panels.setIndex(2);
	},	
	serviceDetail: function(inSender,inEvent){		
		//close old panels	
		this.closeSecondaryPanels(2);		
		//create panel to access account details
		this.createComponent({ kind: "ServiceDetails", "uid": this.uid, "uri": inEvent.uri, "account": inEvent, onCreateStack: "newStack", onBack: "closeFilePanel", container: this.$.panels }).render();
		this.$.panels.reflow();
		this.$.panels.setIndex(2);
	},
	newStack: function(inSender,inEvent){		
		//close old panels	
		this.closeSecondaryPanels(2);		
		//create panel to create a new stack
		this.createComponent({ kind: "NewStack", "uid": this.uid, "uri": inEvent.uri, onSelectedStack: "stackDetail", onBack: "closeFilePanel", container: this.$.panels }).render();
		this.$.panels.reflow();
		this.$.panels.setIndex(3);
	},
	stackDetail: function(inSender,inEvent){		
		//close old panels	
		this.closeSecondaryPanels(3);		
		//create panel to show stack detail
		this.createComponent({ kind: "StackDetails", "uid": this.uid, "uri": inEvent.uri, "stack": inEvent, onBack: "closeFilePanel", container: this.$.panels }).render();
		this.$.panels.reflow();
		this.$.panels.setIndex(4);
	},
	accountDetail: function(inSender,inEvent){		
		//close old panels	
		this.closeSecondaryPanels(2);		
		//create panel to access account details
		this.createComponent({ kind: "AccountDetails", "uid": this.uid, "uri": inEvent.uri, "account": inEvent, onEditAcc:"editAccount", onBack: "closeFilePanel", container: this.$.panels }).render();
		this.$.panels.reflow();
		this.$.panels.setIndex(2);
	},
	editAccount: function(inSender,inEvent){		
		//close old panels	
		this.closeSecondaryPanels(2);		
		//create panel to access account details
		this.createComponent({ kind: "EditAccount", "uid": this.uid, "account": inEvent ,"uri": inEvent.uri, "account": inEvent, onBack: "closeFilePanel", container: this.$.panels }).render();
		this.$.panels.reflow();
		this.$.panels.setIndex(3);
	},
	listRepository: function(inSender,inEvent){	
		//close old panels		
		this.closeSecondaryPanels(2);	
		//create panel of Repositories to select a file
		this.createComponent({ kind: "RepositoryList", "uid": this.uid, callBy: "selectFile", "uri": inEvent.uri, "closePanel": enyo.Panels, onSelectedItem : "fileRepository", onBack: "closeFilePanel", container: this.$.panels }).render();
		this.$.panels.reflow();
		this.$.panels.setIndex(3);
	},
	fileRepository: function(inSender,inEvent){				
		//close old panels	
		this.closeSecondaryPanels(4);		
		//create panel of files based on repository selected
		this.createComponent({ kind: "RepositoryFileList", "uid": this.uid, "uri" : inEvent.uri, callBy: "selectFile", "repositoryName" : inEvent.name , onSelectedItem : "fileSelected", onBack: "closeFilePanel", container: this.$.panels }).render();
		this.$.panels.reflow();
		this.$.panels.setIndex(5);
	},
	fileSelected: function(inSender,inEvent){
		//close old panels		
		this.closeSecondaryPanels(5);
		this.closeSecondaryPanels(4);
		this.closeSecondaryPanels(3);
		this.closeSecondaryPanels(2);	
		FilesList[count] = inEvent;
		count++;
		//create panel of details by selected Command 
		this.createComponent({ kind: "CommandDetail", "uid": this.uid, 'icon': this.$.CommandData.icon, "files": FilesList, onSelectedFile: "listRepository", container: this.$.panels, 'uri': this.$.CommandData.uri }).render();
		this.$.panels.reflow();
		this.$.panels.setIndex(4);
	},
	closeFilePanel:function(inSender,inEvent){
		this.closeSecondaryPanels(2);
		this.setPanelIndex(1);
	},
	createCommandList: function() {	
		this.createComponent({name:"toolComm", kind: "onyx.Toolbar", container: this.$.imageIconPanel,components: [
							{content: "Commands"},
							{fit: true}]}
			);		
		
		//create icons for the list of commands 
		this.createComponent({
			name: "IconGallery",
			kind: "IconList",
			container: this.$.imageIconPanel,
			onDeselectedItems: "commandDeselect",
			onSelectedItem: "commandTap", 
			commands: this.commands,
			commandsImages: this.commandsImages,
			retrieveContentData: function(){
				this.data = createCommandItems(this.commands, this.commandsImages); } 
			} 
		);		
		
		if (enyo.Panels.isScreenNarrow()) {
			this.createComponent({kind: "onyx.Toolbar",container: this.$.imageIconPanel, components: [
				{kind: "onyx.Button", content: "Close", ontap: "backMenu"}
			]});
		}
		else{
			this.createComponent({kind: "onyx.Toolbar",container: this.$.imageIconPanel});
		}
        this.$.imageIconPanel.render();
    },

	/** When an command icon is actioned It will be runned**/
	commandTap: function(inSender, inEvent) {
		//check if command information is set
		if( !( inEvent.index in this.commandsData ) ){
			alert("There is not commands in the database!");
			return;
		}
		this.closeSecondaryPanels(2);//close old panels
		
		//create panel of details by selected Command 
		this.createComponent({ kind: "CommandDetail", "uid": this.uid, 'icon': this.commandsData[inEvent.index].icon, onSelectedFile: "listRepository", container: this.$.panels, 'uri': this.commandsData[inEvent.index].uri }).render();
		this.$.panels.reflow();
		this.$.panels.setIndex(2);
		this.$.CommandData = this.commandsData[inEvent.index];
		inSender.scrollIntoView(inSender.$["commandItem"+inEvent.index], false);
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