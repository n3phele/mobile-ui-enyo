enyo.kind({ 
	name:"StackInfo",
	kind: "FittableRows",
	fit: true,
	stackdata:null,
	style: "padding: 0px;background:#fff",
	events: {
		onBack: "",
	
	},
		components:[
		{kind: "onyx.Toolbar",classes:"toolbar-style", components: [
				
				{kind: "onyx.Button", content: "VM List", classes:"button-style-left", ontap: "cancelAction"} ,
				{ name: "title", content:"Stack Info", }, {fit: true}]},
		{style:"text-align:center;margin:3em auto", components:[		
			{kind: "FittableRows", name:"panel", fit: true, components: [
				{name:"ip",content: "ip"},
   				
			]},
	    ]},		
	],
	create: function() {
		this.inherited(arguments);
		this.$.title.setContent(this.info.name);
		console.log(this.info.action);
		
			var ajaxComponent = n3phele.ajaxFactory.create({
			url: this.info.action,
			headers:{ 'authorization' : "Basic "+ this.uid},
			method: "GET",
			contentType: "application/x-www-form-urlencoded",
			sync: false, 
			}); 
				
		ajaxComponent.go()
		.response(this, function(sender, response){
		    console.log(response);
		
			this.stackdata = response;
		    
			
		this.$.ip.setContent("IP:" + this.stackdata.targetIP);
			
		
		})
		.error(this, function(){
			console.log("Error to load the detail of the command!");
			
		});	
		
		
	},
	

	cancelAction:function (sender,event)
	{  
		this.doBack();
	},

});