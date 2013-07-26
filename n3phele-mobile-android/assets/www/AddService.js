var results;
var i = 0;
enyo.kind({ 
	name:"AddService",
	kind: "FittableRows",
	fit: true,
	myuri:null,
	send:null,
	uri:null,
	zone:null,
	clouds:null,
   uris:null,
   zones:null,
	account:null,
	style: "padding: 0px;background:#fff",
	events: {
		onCreateAcc: "",
		onBack: "",
		onClickItem:""
	},
	components:[
		{kind: "onyx.Toolbar", classes: "toolbar-style",components: [  {kind: "onyx.Button",classes:"button-style-right",content: "Done", ontap: "newService"}, 
		{kind: "onyx.Button" ,content: "Services", classes:"button-style-left", ontap: "cancelAction"},
		{name: "title", content:"New Service", style:"padding-left:20px" }, {fit: true}]},        
		{kind: "FittableRows", name:"panel", fit: true, components: [
		  {tag: "br"},
		{name: "Msg", style: "color:#FF4500; text-align:center"},
   		 
				{style:"text-align:center;margin:2em auto", components:[							
					{kind: "onyx.InputDecorator",style:"border:1px solid #9A9A9A;width:90%;margin-bottom:10px", components: [
							{kind: "onyx.Input", name: "name",style:"float:left", placeholder: "Service name"}
					]},
					
				]},	
{content : "Select your account:", name : "account", style : "margin:5px 0 0 60px; font-weight: bold;"},
				
					{name:"checkBox",kind: "Group", classes: "onyx-sample-tools group", highlander: true,components:[		]},				
		]}		
	],
	 create: function()
	 {    this.clouds = new Array();
            this.uris = new Array();
			this.zones = new Array();
	 	this.inherited(arguments);
		this.myuri = "https://n3phele-dev.appspot.com/resources/command/1360001"
	  var ajaxComponent = n3phele.ajaxFactory.create({
			 url:this.myuri,
			 headers:{ 'authorization' : "Basic "+ this.uid},
			 method: "GET",
			 contentType: "application/x-www-form-urlencoded",
			 sync: false, 
			 }); 
				
		 ajaxComponent.go()
	.response(this, function(sender, response){
        response = fixArrayInformation(response.cloudAccounts);
		accounts = new Array();
		accounts = response;		
		this.setDynamicData(accounts);
 	        
		 })
		 .error(this, function(){
			 console.log("Error to load the detail of the command!");
		 });	
	 },
	
	setDynamicData: function( data ){    
			for( var i in data ){           
				this.$.checkBox.createComponent(
				{name: data[i].accountName, kind: "serviceLine", data: data[i] }
				);
				
				
			this.clouds[i] = eval("this.$.checkBox.$."+data[i].accountName);
			this.uris[i] = data[i].accountUri;
			this.zones[i] = data[i].implementation;
		 this.render();
			
			
			}

	},
	
	
	selectedAccount: function(sender, event){
		this.doClickItem(results[event.index]);
	},
	closePanel: function(inSender, inEvent){
			var panel = inSender.parent.parent.parent;
			
			panel.setIndex(2);				
			panel.getActive().destroy();					
			panel.panelCreated = false;
			
			if (enyo.Panels.isScreenNarrow()) {
				panel.setIndex(1);
			}
			else {
				panel.setIndex(0);
			}		
			
			panel.reflow();		
			panel.owner.$.IconGallery.deselectLastItem();			
	},
	newService: function(sender, event){	   
		for(var i in this.clouds){
			var c = this.clouds[i].$.execCheck.getValue();			
			if(c==true){
			
				this.uri = this.uris[i];
				this.zone = this.zones[i];
                var  name = this.$.name.getValue();
				var parameters = '{"Variable":[{"name":"notify", "type":"Boolean", "value":["false"]},{"name":"account", "type":"Object", "value":["'+this.uri+'"]}]}';
			    var ajaxComponent = n3phele.ajaxFactory.create({
				url: serverAddress+"process/exec?action=StackService&name="+name+"&arg=NShell+"+encodeURIComponent(this.myuri+"#"+this.zone) + "&parent=",
				headers:{ 'authorization' : "Basic "+ this.uid},
				method: "POST",
				contentType: "application/json",
				postBody: parameters,
				sync: false, 
				}); 
			
		ajaxComponent.go()
		.response( this, function(inSender, inResponse){
		this.doBack();		
		}).error( this, function(inSender, inResponse){
		});				
			}
		}
	 if(this.zone == null) { 
		this.$.Msg.setContent("Select your account!");
                    }	 
 
	},
	
	cancelAction:function (sender,event)
	{  
		this.doBack();
	},

	activate: function(sender, event){
		this.doClickItem();
	}
});
enyo.kind({
	name: "serviceLine",
	classes: "commandFilesLine",
	style:"padding: 1px;", 
	components:[
		{classes: "onyx-sample-tools", style:"width:"+execCloudName+"%", components: [
				{kind:"onyx.Checkbox", name: "execCheck",style:"margin:5px 0 0 60px; font-weight: bold"}, {name: "execCloud",  style: "display:inline-block;"}
		]},
	],
	create: function(){
		this.inherited(arguments);
		this.$.execCheck.setValue(false);
		this.$.execCloud.setContent(this.data.accountName);
	}	
});