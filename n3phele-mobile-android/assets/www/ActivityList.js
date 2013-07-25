enyo.kind({ 
		name:"ActivityList",
		result: null,
		start:false,
		fit: true,
		listSize:null,
		events: {
		onBack: "",
		onClose: "",
		onSelectedActivity: ""
		},
		components:[
			{kind: "onyx.Toolbar", classes:"toolbar-style", name: "toolTop",components: [	{content: "Activity History"}, {fit: true} ]},
			{name: "list", kind: "List", fit: true, touch: true, onSetupItem: "setupItem", style:"height:93%", components:[
				{name: "item", style: "box-shadow: -4px 0px 9px #768BA7",  classes: "panels-sample-flickr-item enyo-border-box",  ontap: "itemTap", components:[
					{kind: "Image", name:"status", classes: "panels-sample-flickr-thumbnail" },
					{name: "activity", classes: "panels-sample-flickr-title"},
					{name: "icon2", kind: "onyx.IconButton",classes: "panels-sample-flickr-icon", src: "assets/next.png", ontap: "itemTap"}
				]},//end item
				{name: "more", style: "padding: 10px 0 10px 10px; margin:auto; border:1px solid rgb(200,200,200)",components: [
					{name:"buttonMore",kind: "onyx.Button", content: "More activities", classes: "button-style", ontap: "moreAct"},
						    	{name: "Spin",kind:"onyx.Spinner",classes: "onyx-light",style:"margin-left:45%"},

				]}//item item
			]}
		], //end components	
		getRecentActivities: function( uid ){
		this.$.Spin.show();
		this.$.buttonMore.hide();
		
	
			var ajaxParams = {
				url: serverAddress+"process",
				headers:{ 'authorization' : "Basic "+ uid},
				method: "GET",
				contentType: "application/x-www-form-urlencoded",
				sync: false, 
			};
			
			var ajaxComponent = n3phele.ajaxFactory.create(ajaxParams); //connection parameters
			
			ajaxComponent
			.go({'summary' : true, 'start' : 0, 'end' : listSize})
			.response( this, "processRecentActivities" )
			.error( this, function(){ console.log("Error to load recent activities!!"); });
		},
		processRecentActivities: function( request, response){		
			if(response.total == 0){
				this.$.divider.setContent("Without recent activities!");
				this.$.list.applyStyle("display", "none !important");
				this.reflow();
				return;
			}
			response.elements = fixArrayInformation(response.elements);
			this.results = response.elements;
			this.$.list.setCount(this.results.length);
			this.$.Spin.hide();
			if(listSize == this.results.length)  this.$.buttonMore.show();
			else if(listSize != this.results.length) this.$.more.hide();
            
			this.$.list.reset();
		if(this.start)this.$.list.scrollToBottom();
        this.start = true;
		
		},
		setupItem: function(inSender, inEvent){
			if(this.results == null ) return;
			var i = inEvent.index;
			var item = this.results[i];

			if(item.state == "COMPLETE"){
				this.$.status.setSrc("assets/activities.png");			
			}else if(item.state == "CANCELLED"){
				this.$.status.setSrc("assets/cancelled.png");				
			}else if(item.state == "FAILED"){
				this.$.status.setSrc("assets/failed.png");				
			}else if(item.state =="BLOCKED"){  
				this.$.status.setSrc("assets/blocked.png");					
			}else{
				this.$.status.setSrc("assets/spinner2.gif");
			}	
			this.$.activity.setContent(item.name);
			  
			 if( i % 2 == 1)
	   {
	   this.$.item.applyStyle("background-color", "#F7F7F7")
	   };
         if( i % 2 == 0)
	   {
	   this.$.item.applyStyle("background-color", "white")
	   };
	   this.$.more.canGenerate = !this.results[i+1];
			
		},
		create: function(){
			this.inherited(arguments);
			//console.log("tamanho de listSize:" + listSize);
			listSize = 15;
			var thisPanel = this;
            console.log(listSize);
			if (this.closePanel.isScreenNarrow()) {
				this.createComponent({kind: "onyx.Button", content: "Menu", classes:"button-style-left", ontap: "backMenu", container: this.$.toolTop}).render();		
			}
			this.getRecentActivities(this.uid);
		},
		backMenu: function (sender, event){
		   
			this.doBack();
		},
		closePanel: function (sender, event){
			this.doClose();
		},
		itemTap: function( sender, event){
			this.doSelectedActivity(this.results[event.index]);
		},
		moreAct:function() {
       	 listSize = listSize+5;
       	 this.getRecentActivities(this.uid);
		 
         //this.$.list.reset();
	
    	}
});