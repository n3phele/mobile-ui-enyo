/*
	This Kind represent the Cancel Activity page
*/
enyo.kind({ 
	name:"DeleteService",
	kind: "FittableRows",
	fit: true,
	style: "padding: 0px;background:#fff",
	events: {
		onDelete: "",
		onBack: "",
		onRefresh:"",
	},
	//create components of interface 
	components:[

		//top toolbar that contains Title back button and Ok button ***************************************************************
		{kind: "onyx.Toolbar",classes:"toolbar-style", components: [
			{kind: "onyx.Button",classes:"button-style-right",content: "OK", ontap: "deleteService"} , 
			{kind: "onyx.Button", content: "Service Detail", classes:"button-style-left", ontap: "back"} ,
			{ name: "title", content:"Delete Service"}, 
			{fit: true}
		]},
		
		// contains the string that is the confirmation of cancel a activity ******************************
		{style:"text-align:center;margin:3em auto", components:[		
			{kind: "FittableRows", name:"panel", fit: true, components: [
				{name:"service",content: ""},				
			]},
	    ]},		
	],
  	
  	/*
		this function create the content of the text based on the name of the activity
	*/
	create: function() {
		this.inherited(arguments);
		this.$.service.setContent("Are you sure you want to delete " + this.name + "   ?");
	},

	/*
		this function cancel the selected activity
	*/
	deleteService: function(sender, event){
	    
	var ajaxComponent = n3phele.ajaxFactory.create({
			url: this.uri,
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
		
	this.doRefresh();
		
	},

	/*
		this function back to the activity page
	*/
	back:function (sender,event){  
		this.doBack();
	},

});