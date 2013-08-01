enyo.kind({
	name : "FileContent",
	kind: "FittableRows",	
	style: "background-color: #fff",
	events: {
		onBack: "",
		onLost: "",
	},
	components:[
		{kind: "onyx.Toolbar", classes: "toolbar-style", components:[ { name: "title",  content:"File Content"},
			{kind: "onyx.Button", classes:"button-style-left", content: "Repository", ontap: "backMenu"}
		]},	
		
		{name: "panel", components:[
			{name:"fileName", style: "padding: 10px;"},
			{name: "divider", classes: "list-divider"}			
		]},
		
		{kind: "enyo.Scroller", fit: true, components: [	
			{name: "panel_three", fit:true, components:[
				{name: "Spin",kind:"onyx.Spinner",classes: "onyx-light",style:" margin-top:100px;margin-left:45%"},	
				{name: "content", style:"word-wrap:break-word; padding:10px"}				
			]},			
		]},		
	],
	create: function(){
		this.inherited(arguments)
		this.$.fileName.setContent(this.name);
		this.$.Spin.show();

		var ajaxParams = {
				url: this.uri,
				method: "GET",
				handleAs: "text"
		};
		var ajaxComponent = n3phele.ajaxFactory.create(ajaxParams); //connection parameters
		ajaxComponent
		.go()
		.response( this, function(inSender, inResponse){
			this.$.content.setContent(inResponse);
				this.$.Spin.hide();

		}).error(this, function(inSender, inResponse){
		 if(inSender.xhrResponse.status == 0) 
		 {
		 alert("Connection Lost");
		 this.doLost();
         }
		}); 
	},
	backMenu: function( sender , event){
		this.doBack();
	}	
});