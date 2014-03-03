define( "halfpageBodyTemplate",
	[
		"domo",
		"domoStringify"
	],
	function construct( ){
		return domoStringify( [
				DIV( {
					"page": "{{ GUID }}",
					"app-name": "{{ appName }}",
					"name": "body-page",
					"auto-resize": ""
				} ),
				DIV( {
					"ng-repeat": "pageData in pageList",
					"page-data": "pageData",
					"page": "{{ GUID }}",
					"app-name": "{{ appName }}",
					"name": "body-page",
					"auto-resize": ""
				} )
			] );
	} );