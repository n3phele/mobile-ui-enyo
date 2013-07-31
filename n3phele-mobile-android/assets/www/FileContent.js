enyo.kind({
	name : "FileContent",
	kind: "FittableRows",
	fit: true,
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
			{name: "divider", classes: "list-divider"},	
			{name: "content", content: this.content},
	]}
	],
	create: function(){
		this.inherited(arguments)
		this.$.fileName.setContent(this.name);
		
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
		}).error(this, function(){
		 if(inSender.xhrResponse.status == 0) console.log("error");
		});
	},
	backMenu: function( sender , event){
		this.doBack();
	}	
});