define( "headerControlTemplate",
	[
		"domo"
	],
	function construct( ){
		return DIV( {
			"page": "{{ GUID }}",
		} ).outerHTML;
	} );