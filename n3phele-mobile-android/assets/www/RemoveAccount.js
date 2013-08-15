enyo.kind({ 
	name:"RemoveAccount",
	kind: "FittableRows",
	results: "",
	fit: true,
	style: "padding: 0px;background:#fff",
	events: {
		onDelete: "",
		onBack: "",
		onClickItem:""
	},
	components:[
		{kind: "onyx.Toolbar",classes:"toolbar-style", components: [
				{kind: "onyx.Button",classes:"button-style-right",content: "OK", ontap: "deleteAccount"} , 
				{kind: "onyx.Button", content: "Account Detail", classes:"button-style-left", ontap: "back"} ,
				{ name: "title", content:"Remove Account", }, {fit: true}
		]},

		{style:"text-align:center;margin:3em auto", components:[		
			{kind: "FittableRows", name:"panel", fit: true, components: [
				{name:"account",content: "Account"},				
			]},
	    ]},		
	],

	/*
		this function create the content of the text based on the name of the account
	*/
	create: function() {
		this.inherited(arguments);
		this.$.account.setContent("Are you sure you want to delete " + this.account.accountName + "   ?");
	},

	/*
		this function delete the selected account
	*/
	deleteAccount: function(sender, event){
		var ajaxComponent = n3phele.ajaxFactory.create({
			url: this.account.uriAccount,
			headers:{ 'authorization' : "Basic "+ this.uid},
			method: "DELETE",
			contentType: "application/x-www-form-urlencoded",
			sync: true, 
		}); 		
		
		ajaxComponent.go()
		.response()
		.error(this, function(){
			console.log("Error to delete the detail of the command!");
		});	
		
		this.doDelete();
	},

	/*
		this function back to the activity page
	*/
	back:function (sender,event){  
		this.doBack();
	}

});