/*
	This Kind represent the Remove Service page
*/
enyo.kind({ 
	name:"RemoveService",
	kind: "FittableRows",
	fit: true,
	style: "padding: 0px;background:#fff",
	events: {
		onCreateAcc: "",
		onBack: "",
		onClickItem:""
	},
	//create components of interface 
	components:[

		//top toolbar that contains Title back button and Ok button ***************************************************************
		{kind: "onyx.Toolbar",classes:"toolbar-style", components: [
				{kind: "onyx.Button",classes:"button-style-right",content: "OK", ontap: "deleteService"} , 
				{kind: "onyx.Button", content: "Service Detail", classes:"button-style-left", ontap: "back"} ,
				{ name: "title", content:"Remove Service"},
				{fit: true}
		]},

		// contains the string that is the confirmation of cancel a activity *****************************
		{style:"text-align:center;margin:3em auto", components:[		
			{kind: "FittableRows", name:"panel", fit: true, components: [
				{name:"service",content: "Service "},				
			]},
	    ]},		
	],

	/*
		this function create the content of the text based on the name of the service
	*/
	create: function() {
		this.inherited(arguments);
		this.$.service.setContent("Are you sure you want to delete " + this.service.name + "   ?");
	},

	/*
		this function remove the selected service
	*/
	deleteService: function(sender, event){
		this.doCreateAcc();
	},

	/*
		this function back to the Service list page
	*/
	back:function (sender,event){  
		this.doBack();
	}

});