enyo.kind({
	name: "newStack",
	kind: "FittableRows",	
	components: [
			{kind: "onyx.Toolbar", content: "New Stack", name: "title_1", style:"background:#b1c2d7;border:1px solid #375d8c;background-size:contain;color:#375d8c"},
				{kind: "onyx.InputDecorator",style: "width: 85%; margin:25px 0 25px 0;width:50%;border-radius:6px 6px", layoutKind: "FittableColumnsLayout", components: [
					{name: "searchInput", fit: true, kind: "onyx.Input", onchange: "search"},
					{kind: "Image", src: "http://nightly.enyojs.com/latest/sampler/assets/search-input-search.png", style: "width: 20px; height: 20px;"}
				]},
				{kind: "onyx.Button", content: "search", ontap: "search"},
				{name: "searchSpinner", kind: "Image", src: "http://nightly.enyojs.com/latest/sampler/assets/spinner.gif", showing: false},				
			{kind: "List", fit: true, touch: true,style:"border: 1px solid #375D8C", onSetupItem: "setupStacks", components: [		
				
			]}			
		//{kind: "FlickrSearch", onResults: "searchResults"}	
	],
});