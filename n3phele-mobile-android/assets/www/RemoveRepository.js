/*
	This Kind represent the Remove Repository page
*/
enyo.kind({ 
	name:"RemoveRepository",
	kind: "FittableRows",
	fit: true,
	style: "padding: 0px; background:#fff",
	events: {
		onCreateAcc: "",
		onBack: "",
		onDelete:""
	},
	components:[

		//top toolbar that contains Title, back button and Ok button ***************************************************************
		{kind: "onyx.Toolbar",classes:"toolbar-style", components: [
			{kind: "onyx.Button",classes:"button-style-right",content: "OK", ontap: "deleteRepository"} , 
			{kind: "onyx.Button",classes:"button-style-left",style:"margin-right:-4px",  content: "Repository List", ontap: "back"},	
			{ name: "title", content:"Delete Repository"}, 
			{fit: true}
		]},

		// contains the string that is the confirmation of delete repository
		{style:"text-align:center;margin:3em auto", components:[		
			{kind: "FittableRows", name:"panel", fit: true, components: [
				{name:"name",content: "Repository"}, 
			]},
	    ]},
	],

	/*
		this function create the content of the text based on the name of the repository
	*/
	create: function() {
		this.inherited(arguments);

		this.$.name.setContent("Are you sure you want to delete " + this.repository.name + " ?");
	},

	/*
		this function delete the selected repository
	*/
	deleteRepository: function(sender, event){
		var ajaxComponent = n3phele.ajaxFactory.create({
			url: this.repository.originator.uri,
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
		//this.doBack(event);
		console.log(this.uid);
		console.log(this.repository.originator.uri);
		this.doDelete();
	},

	/*
		this function back to the repository list page
	*/
	back:function (sender,event){  
		this.doBack();
	}

});