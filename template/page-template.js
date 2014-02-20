define( "pageTemplate",
	[
		"domo"
	],
	function construct( ){
		return DIV( {
			"header-control": "{{ GUID }}",
		} ).outerHTML + 
		DIV( {
			"page-content": "{{ GUID }}",
		} ).outerHTML + 
		DIV( {
			"footer-control": "{{ GUID }}",
		} ).outerHTML;
	} );