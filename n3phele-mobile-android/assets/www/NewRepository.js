/*
	This Kind represent the Create Repository page
*/
enyo.kind({
	name: "NewRepository",
	classes: "onyx onyx-sample",
	fit: true,
	style: "padding: 0px",
	events: {
		onBack: ""
	},
	// create components of interface
	components: [
		{kind:"Scroller",classes: "scroller-sample-scroller enyo-fit", style: "background: white", components: [    
			
			//top toolbar that contains Title back button and Done button *************************************************************** 
			{kind: "onyx.Toolbar", classes: "toolbar-style", components: [ 
				{name: "title", content:"New Repository" }, 
				{kind:"onyx.Button", content: "Done", classes: "button-style-right", ontap:"save", style:"margin-left:-4px !important;margin-right:-2px !important"},
				{kind:"onyx.Button", content: "Repositories", ontap:"back", classes: "button-style-left"}
			]},		

			{tag: "br"},
			{name: "Msg", style: "color:#FF4500; text-align:center"},
			{tag: "br"},

			//this container contains the form of create repository***************************************************************
			{style:"text-align:center", components:[	

				//Name input ***********************************************************************************************************************	
				{kind: "onyx.InputDecorator",classes: "inputs", components: [
					{kind: "onyx.Input", name: "name",style:"float:left;padding-left:10px", placeholder: "Repository name"}
				]},

				//Description input ***********************************************************************************************************************
				{kind: "onyx.InputDecorator",classes: "inputs", components: [
					{kind: "onyx.Input", name: "description",style:"float:left;padding-left:10px", placeholder: "Repsoitory description"}
				]},

				//URL input ***********************************************************************************************************************
				{kind: "onyx.InputDecorator",classes: "inputs", components: [
					{kind: "onyx.Input", name: "URL",style:"float:left;padding-left:10px", placeholder: "Location URL"}
				]},

				//Repository type select ***********************************************************************************************************************
				{name:"select", kind: "Select", classes:"styled-select", style:"-webkit-appearance:none !important;outline:none;margin-bottom:10px;padding-left:5px",components:[            
					{content:"S3", value:"S3"},
					{content:"Swift", content:"Swift"}						                                                           
				]},			
				
				//Path input ***********************************************************************************************************************
				{kind: "onyx.InputDecorator",classes: "inputs",components: [
					{kind: "onyx.Input", name: "path",style:"float:left;padding-left:10px", placeholder: "Base Path"}
				]},	
	
				//ID input ***********************************************************************************************************************
				{kind: "onyx.InputDecorator",classes: "inputs", components: [
					{kind: "onyx.Input", name: "id",style:"float:left;padding-left:10px", placeholder: "Authentication Id"}
				]},
				
				//Password input ***********************************************************************************************************************	
				{kind: "onyx.InputDecorator",classes: "inputs", components: [
					{kind: "onyx.Input", name: "password",style:"float:left;padding-left:10px", type: "password", placeholder: "New password"}
				]},
				
				//Toggle for accessible to all n3phele users ***********************************************************************************************************************
				{content: "Accessible to all n3phele user?"}, 
				{kind: "onyx.ToggleButton", onContent: "Yes", offContent: "No", onChange: "buttonToggle",style: "background-color: #35A8EE;"} 		
			]}
		]}
	],

	/*
		this function create a new Repository
	*/
	save: function(sender, event){
		
		//obtain form data *******************************************************
		var  name = sender.parent.owner.$.name.getValue();
 		var  path = sender.parent.owner.$.path.getValue();
		var url = sender.parent.owner.$.URL.getValue();
		var kind = sender.parent.owner.$.select.getValue();
		var  id = sender.parent.owner.$.id.getValue();
		var  password = sender.parent.owner.$.password.getValue();
		var  access =  this.$.toggleButton.getValue();
		
		//validate form ************************************************************************************************************
		if( name.length == 0 || url.length == 0 || kind.length == 0 || path.length == 0 || id.length == 0 || password.length == 0){
			sender.parent.owner.$.Msg.setContent("Please, fill the form!");
			return;
		}

		
		// Processing Popup ***************************************
		var popup = new spinnerPopup();
		popup.show();
		
		//request *************************************************************************
		var ajaxParams = {
				url: serverAddress+"repository",
				headers:{ 'authorization' : "Basic "+ this.uid},
				method: "POST",
				contentType: "application/x-www-form-urlencoded",
				sync: false, 
			};
		var ajaxComponent = n3phele.ajaxFactory.create(ajaxParams); //connection parameters
		ajaxComponent
		.go({
			name:name,
			target:url,
			kind:kind,
			root:path,
			isPublic:access,
			repositoryId:id,
			secret:password
		})
		.response( this, function(inSender, inResponse){
			this.doBack(event);
		}).error( this, function(inSender, inResponse){
			sender.parent.owner.$.Msg.setContent("Error");
			popup.delete();
		});
			
	},

	/*
		this function back to the account page
	*/
	back: function(sender , event){
		this.doBack(event);
	}
});
