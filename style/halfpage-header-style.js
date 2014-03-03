define( "halfpageHeaderStyle",
	[
		"absurd",
		"jquery",
		"absurdCompiler"
	],
	function construct( ){
		var absurd = Absurd( );
		var halfpageHeaderStyle = function halfpageHeaderStyle( GUID ){
			var style = { };
			var selector =  "div[halfpage-header='" + GUID + "']";
			style[ selector ] = {
				"position": "absolute !important",
				"top": "0px !important",
				"left": "0px !important",
				"z-index": "2 !important",
				"height": "50px !important",
				"width": window.innerWidth + "px"
			};
			absurd.add( style ).compile( absurdCompiler( "halfpage-header", GUID ) );
			return style[ selector ];
		};
		return halfpageHeaderStyle;
	} );