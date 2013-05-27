enyo.kind({
	name: "NewRepository",
	classes: "onyx onyx-sample",
	fit: true,
	style: "padding: 0px",
	events: {
		onBack: ""
	},
	components: [
	{kind:"Scroller",classes: "scroller-sample-scroller enyo-fit", style: "background: white", components: [    
		{kind: "onyx.Toolbar", classes: "toolbar-style", components: [ 
			{ name: "title", content:"New Repository" }, 
			{kind:"onyx.Button", content: "Done", classes: "button-style-right", ontap:"save"},
			{kind:"onyx.Button", content: "Repository List", ontap:"cancel", classes: "button-style-left"}
		]},		
		{tag: "br"},
		{name: "Msg", style: "color:#FF4500;"},
		{tag: "br"},		
	{style:"text-align:center", components:[		
			{kind: "onyx.InputDecorator",classes: "inputs", components: [
				{kind: "onyx.Input", name: "name",style:"float:left;padding:7px 0 0 10px", placeholder: "Enter name here"}
			]},
		{components: [			
			{kind: "onyx.InputDecorator",classes: "inputs", components: [
				{kind: "onyx.Input", name: "description",style:"float:left;padding:7px 0 0 10px", placeholder: "Enter description here"}
			]}]},
		{components: [			
			{kind: "onyx.InputDecorator",classes: "inputs", components: [
				{kind: "onyx.Input", name: "URL",style:"float:left;padding:7px 0 0 10px", placeholder: "Enter URL here"}
			]}]},
		{components: [	
		{tag:"select", classes:"styled-select", style:"-webkit-appearance:none !important;outline:none;margin-bottom:10px",components:[             /* <<<<--------------------- */
			{tag:"option", content:"aaaaaaaa"}						                                                             /* <<<<--------------------- */
		]}	
		//{style:"width: 87%",fit:true,components:[ 
			/* {kind: "onyx.MenuDecorator", onSelect: "itemSelected",fit:true, components: [  //{kind: "onyx.MenuDecorator", onSelect: "itemSelected", components: [
				{kind: "onyx.InputDecorator",style:"border:1px solid;margin-bottom:10px;width:76%", components: [  //{kind: "onyx.InputDecorator",style:"border:1px solid;width:76%;margin-bottom:10px;min-width:245px", components: [
					{kind: "onyx.Input", name: "kind", disabled: true, placeholder: "",style:"-webkit-text-fill-color: #000000"}  //{kind: "onyx.Input", name: "kind", disabled: true, placeholder: "",style:"-webkit-text-fill-color: #000000"}
				]},
				{content: "v", allowHtml:true, classes:"button-combobox-style"},
				{kind: "onyx.Menu", style:"background:#B9B9BD;color:#000;margin-bottom:10px", components: [  //{kind: "onyx.Menu", style:"background:#B9B9BD;color:#000;width:90%;margin-bottom:10px", components: [
					{content: "S3"},
					{content: "Swift"}
				]}
			]} */
		//]} 
		]},
		{components: [			
			{kind: "onyx.InputDecorator",classes: "inputs",components: [
				{kind: "onyx.Input", name: "path",style:"float:left;padding:7px 0 0 10px", placeholder: "Enter Base Path here"}
			]}]},
		{components: [			
			{kind: "onyx.InputDecorator",classes: "inputs", components: [
				{kind: "onyx.Input", name: "id",style:"float:left;padding:7px 0 0 10px", placeholder: "Enter Id here"}
			]}]},
		{components: [			
			{kind: "onyx.InputDecorator",classes: "inputs", components: [
				{kind: "onyx.Input", name: "password",style:"float:left;padding:7px 0 0 10px", type: "password", placeholder: "Enter Password here"}
			]}]},			
		{components: [			
			{content: "Accessible to all n3phele user?"}, 
			{kind: "onyx.ToggleButton", onContent: "Yes", offContent: "No", onChange: "buttonToggle",style: "background-color: #35A8EE;"}, 
		]},			
	]}
	]}

	],
	create: function() {
		this.inherited(arguments);
	},
	
	itemSelected: function(inSender, inEvent) {
		//Menu selected item
		if (inEvent.originator.content){
			this.$.kind.setPlaceholder(inEvent.originator.content);
		}
	},
	save: function(sender, event){
		//obtain form data
		var  name = sender.parent.owner.$.name.getValue();
 		var  path = sender.parent.owner.$.path.getValue();
		var url = sender.parent.owner.$.URL.getValue();
		var kind = sender.parent.owner.$.kind.getPlaceholder();
		var  id = sender.parent.owner.$.id.getValue();
		var  password = sender.parent.owner.$.password.getValue();
		var  access =  this.$.toggleButton.getValue();
		console.log(kind.length);
		//validate form
		if( name.length == 0 || url.length == 0 || kind.length == 0 || path.length == 0 || id.length == 0 || password.length == 0){
			sender.parent.owner.$.Msg.setContent("Please, fill the form!");
			return;
		}

		
		// Processing Popup
		var popup = new spinnerPopup();
		popup.show();
		
		//request
		var ajaxParams = {
				url: serverAddress+"repository",
				headers:{ 'authorization' : "Basic "+ this.uid},
				method: "POST",
				contentType: "application/x-www-form-urlencoded",
				sync: false, 
			};
		var ajaxComponent = new enyo.Ajax(ajaxParams); //connection parameters
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
	cancel: function(sender , event){
		this.doBack(event);
	}
});
