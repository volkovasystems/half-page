define( "halfpageHeaderTemplate",
	[
		"domo"
	],
	function construct( ){
		return DIV( {
			"page": "{{ GUID }}",
		} ).outerHTML;
	} );