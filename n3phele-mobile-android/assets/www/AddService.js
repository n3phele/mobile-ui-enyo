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
	account:null,
	style: "padding: 0px;background:#fff",
	events: {
		onCreateAcc: "",
		onBack: "",
		onClickItem:"",
		onBackCmd:""
	},
	components:[
		{kind: "onyx.Toolbar", classes: "toolbar-style",components: [  {kind: "onyx.Button",classes:"button-style-right",content: "Done", ontap: "newService"}, 
		{kind: "onyx.Button" ,content: "Services", classes:"button-style-left", ontap: "cancelAction"},
		{name: "title", content:"New Service", style:"padding-left:20px" }, {fit: true}]},        
		{kind: "FittableRows", name:"panel", fit: true, components: [
			{tag: "br"},
			{name: "Msg", style: "color:#FF4500; text-align:center"},
   		 		{style:"text-align:center;margin:1em auto", components:[							
					{kind: "onyx.InputDecorator",style:"border:1px solid #9A9A9A;width:90%;margin-bottom:10px", components: [
						{kind: "onyx.Input", name: "Servicename",style:"float:left", placeholder: "Service name"}
					]},
				]},	
			{content : "Select your account:", name : "account", style : "margin:5px 0 0 30px; font-weight: bold"},
			{name:"checkBox",kind: "Group", classes: "onyx-sample-tools group", highlander: true,components:[		]},				
		]}		
	],
	 create: function(){   

		this.clouds = new Array();
        this.uris = new Array();
		this.zones = new Array();
	 	this.inherited(arguments);
		
	  var ajaxComponent = n3phele.ajaxFactory.create({
			 url:serverAddress+"account/",
			 headers:{ 'authorization' : "Basic "+ this.uid},
			 method: "GET",
			 contentType: "application/x-www-form-urlencoded",
			 sync: false, 
			 }); 
				
		 ajaxComponent.go()
	.response(this, function(sender, response){
       
		
			
		this.setDynamicData(response.elements);
 	        
		 })
		 .error(this, function(){
			 console.log("Error to load the detail of the command!");
		 });	
	 },
	
	setDynamicData: function( data ){    
			for( var i in data ){  
				var str="this.$.checkBox.$."+data[i].name;
				var accountName = data[i].name;
				var n = str.replace("-","_");
				var nameAccount =  accountName.replace("-","_");
				
				this.$.checkBox.createComponent(
					{name: nameAccount, style:"width:170% !important", kind: "serviceLine", data: data[i] }
				);
				
			this.clouds[i] = eval(n);
			this.uris[i] = data[i].uri;
			this.render();

			}
	},
	
	
	selectedAccount: function(sender, event){
		this.doClickItem(results[event.index]);
	},
	
	newService: function(sender, event){	   
		for(var i in this.clouds){
			var c = this.clouds[i].$.execCheck.getValue();
			if(c==true){	
				
				this.uri = this.uris[i];
                var  name = this.$.Servicename.getValue();
				
				var parameters = '{"Variable":[{"name":"notify", "type":"Boolean", "value":["false"]},{"name":"account", "type":"Object", "value":["'+this.uri+'"]}]}';
			}
		}
		
		var ajaxComponent = n3phele.ajaxFactory.create({
				url: serverAddress+"process/exec?action=StackService&name="+name+"&arg=&parent=",
				headers:{ 'authorization' : "Basic "+ this.uid},
				method: "POST",
				contentType: "application/json",
				postBody: parameters,
				sync: false, 
				}); 
			
		ajaxComponent.go()
		.response( this, function(inSender, inResponse){
			if(this.service != undefined){ 
				this.doBackCmd();
			}else
				this.doBack();		
		})
		.error( this, function(inSender, inResponse){
			if(this.uri == null) { 
				this.$.Msg.setContent("Select your account!");
			}	
		});		
	},
	
	cancelAction:function (sender,event)
	{    if(this.service != undefined)
	      { 
		  	
		  this.doBackCmd();
		  }
		else
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
				{kind:"onyx.Checkbox", name: "execCheck",style:"margin:5px 0 0 30px; font-weight: bold"}, {name: "execCloud",  style: "display:inline-block;"}
		]},
	],
	create: function(){
		this.inherited(arguments);
		this.$.execCheck.setValue(false);
		this.$.execCloud.setContent(this.data.name);
	}	
});