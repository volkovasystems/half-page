define( "halfpageFooterTemplate",
	[
		"domo"
	],
	function construct( ){
		return DIV( {
			"page": "{{ GUID }}",
		} ).outerHTML;
	} );