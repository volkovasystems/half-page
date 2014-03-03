define( "halfpageHeaderTemplate",
	[
		"domo",
		"domoStringify"
	],
	function construct( ){
		return domoStringify( DIV( {
			"page": "{{ GUID }}",
			"app-name": "{{ appName }}",
			"container": "{{ container }}",
			"name": "header-page",
			"auto-resize": ""
		} ) );
	} );