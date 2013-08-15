/*
	This Kind represent the activity list page
*/
enyo.kind({ 
	name:"CreateFolder",
	kind: "FittableRows",
	fit: true,
	style: "padding: 0px;background:#fff",
	events: {
		onCreateAcc: "",
		onBack: "",
		onClickItem:""
	},


	components:[
		{kind: "onyx.Toolbar", classes: "toolbar-style",components: [
			{kind: "onyx.Button",classes:"button-style-right",content: "Done", ontap: "newFolder"}, 
			{kind: "onyx.Button" ,content: "Repository", classes:"button-style-left", ontap: "back"},
			{ name: "title", content:"Create Folder" }, {fit: true}
		]},

		{style:"text-align:center;padding-top: 3%;",components:[	
			{kind: "onyx.InputDecorator",classes: "inputs", components: [
				{kind: "onyx.Input", name: "name", style:"float:left;padding:7px 0 0 10px",  placeholder: "Folder name"}
			]} //End Name1 
		]}  
	],
	
	newFolder: function(sender, event){
		var ajaxParams = {
				url: this.uri+"/list",
				headers:{ 'authorization' : "Basic "+ this.uid},
				method: "POST",
				contentType: "application/x-www-form-urlencoded",
				sync: false, 
			};
		
		var ajaxComponent = n3phele.ajaxFactory.create(ajaxParams); //connection parameters
		ajaxComponent.go({})
		.response( this, function(inSender, inResponse){}).
		error( this, function(inSender, inResponse){});
	
	},
	

	back:function (sender,event){  
		this.doBack();
	},

});
