define( "halfpageTemplate",
	[
		"domo",
		"domoStringify"
	],
	function construct( ){
		return domoStringify( [
				DIV( {
					"halfpage-header": "{{ GUID }}",
					"auto-resize": "",
					"name": "halfpage-header",
					"app-name": "{{ appName }}"
				} ),
				DIV( {
					"halfpage-body": "{{ GUID }}",
					"auto-resize": "",
					"name": "halfpage-body",
					"app-name": "{{ appName }}"
				} ),
				DIV( {
					"halfpage-footer": "{{ GUID }}",
					"auto-resize": "",
					"name": "halfpage-footer",
					"app-name": "{{ appName }}"
				} )
			] );
	} );