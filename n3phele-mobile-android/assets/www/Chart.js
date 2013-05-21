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
        {kind:"jquery.Flot", name:"flot", style:"width:600px;height:500px"},
    ],
    create:function() {
        this.inherited(arguments);
        // a null signifies separate line segments
        //var d1 = [[0, 4], [2, 2], [4,6] ,[4, 5], [6, 4], [7,10]]; //var d1 = [[0, 12], [24, 10], [4,2] , [7, 2.5], [12, 14], [24, 50]];
		var chartData = [];
        
		for(var i = 0; i < this.data.length; i++){
			chartData[i] = [i, parseFloat(this.data[i])];
		}

        if (this.type == "Cumulative Cost") {
            for (var i = 1; i < chartData.length; i++) {
                chartData[i][1] = chartData[i][1] + chartData[i - 1][1];
            }
        }
		
        console.log(chartData);

        this.$.flot.setData([chartData]);
		
    }
});
