define( "halfpageTemplate",
	[
		"domo"
	],
	function construct( domo ){
		return DIV( {
			"halfpage-header": "{{ GUID }}",
		} ).outerHTML +
		DIV( {
			"halfpage-body": "{{ GUID }}",
		} ).outerHTML + 
		DIV( {
			"halfpage-footer": "{{ GUID }}",
		} ).outerHTML;
	} );