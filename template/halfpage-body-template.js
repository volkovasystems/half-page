define( "halfpageBodyTemplate",
	[
		"domo"
	],
	function construct( ){
		return DIV( {
			"page": "{{ GUID }}",
		} ).outerHTML;
	} );