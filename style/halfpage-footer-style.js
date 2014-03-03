define( "halfpageFooterStyle",
	[
		"absurd",
		"jquery",
		"absurdCompiler"
	],
	function construct( ){
		var absurd = Absurd( );
		var halfpageFooterStyle = function halfpageFooterStyle( GUID ){
			var style = { };
			var selector =  "div[halfpage-footer='" + GUID + "']";
			style[ selector ] = {
				"position": "absolute !important",
				"bottom": "0px !important",
				"left": "0px !important",
				"z-index": "2 !important",
				"height": "60px !important",
				"width": window.innerWidth + "px"
			};
			absurd.add( style ).compile( absurdCompiler( "halfpage-footer", GUID ) );
			return style[ selector ];
		};
		return halfpageFooterStyle;
	} );