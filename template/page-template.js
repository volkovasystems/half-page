define( "pageTemplate",
	[
		"domo",
		"domoStringify"
	],
	function construct( ){
		return domoStringify( [
				DIV( {
					"header-control": "{{ GUID }}",
					"container": "{{ container }}",
					"auto-resize": ""
				} ),
				DIV( {
					"page-content": "{{ GUID }}",
					"container": "{{ container }}",
					"auto-resize": ""
				} ),
				DIV( {
					"footer-control": "{{ GUID }}",
					"container": "{{ container }}",
					"auto-resize": ""
				} )
			] );
	} );