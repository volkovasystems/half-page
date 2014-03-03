define( "halfpageFooterTemplate",
	[
		"domo",
		"domoStringify"
	],
	function construct( ){
		return domoStringify( DIV( {
			"page": "{{ GUID }}",
			"app-name": "{{ appName }}",
			"name": "footer-page",
			"auto-resize": ""
		} ) );
	} );