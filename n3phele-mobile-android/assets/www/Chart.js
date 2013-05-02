enyo.kind({
    name:"jquery.Flot",
    kind:"Control",
    published:{
        data:null
    },
    rendered:function() {
        if(!this.hasNode()) return;
        
        this.dataChanged();
    },
    dataChanged:function() {
        this.plot();
    },
    plot:function() {
        var n = this.hasNode();
        if(!n || !enyo.isArray(this.data)) return;
        
        jQuery.plot(jQuery(n), this.data);
    }
});

enyo.kind({
    name:"chart",
    kind:"Control",
    components:[
        {kind:"jquery.Flot", name:"flot", style:"width:600px;height:500px;"},
    ],
    create:function() {
        this.inherited(arguments);
      
        // a null signifies separate line segments
        var d1 = [[0, 12], [24, 10], [4,2] , [7, 2.5], [12, 14], [24, 50]];
        
        this.$.flot.setData([d3]);
    }
});
