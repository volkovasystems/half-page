define( "halfpageBodyStyle",
	[
		"absurd",
		"jquery",
		"absurdCompiler"
	],
	function construct( ){
		var absurd = Absurd( );
		var halfpageBodyStyle = function halfpageBodyStyle( GUID ){
			var style = { };
			var selector =  "div[halfpage-body='" + GUID + "']";
			style[ selector ] = {
				"position": "absolute !important",
				"top": "50px !important",
				"left": "0px !important",
				"z-index": "2 !important",
				"height": Math.abs( window.innerHeight - 110 ) + "px",
				"width": window.innerWidth + "px"
			};
			absurd.add( style ).compile( absurdCompiler( "halfpage-body", GUID ) );
			return style[ selector ];
		};
		return halfpageBodyStyle;
	} );