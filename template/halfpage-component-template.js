define( "halfpageComponentTemplate",
	[
		"domo",
		"domoStringify"
	],
	function construct( ){
		return domoStringify( DIV( {
			"half-page": "",
			"auto-resize": "",
			"name": "half-page"
		} ) );
	} );