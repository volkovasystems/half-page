define( "footerControlTemplate",
	[
		"domo"
	],
	function construct( ){
		return DIV( {
			"page": "{{ GUID }}",
		} ).outerHTML;
	} );