define( "halfpageStyle",
	[
		"absurd",
		"jquery",
		"absurdCompiler"
	],
	function construct( ){
		var absurd = Absurd( );
		var halfpageStyle = function halfpageStyle( GUID ){
			var style = { };
			var selector =  "div[half-page='" + GUID + "']";
			style[ selector ] = {
				"position": "absolute !important",
				"top": "0px !important",
				"left": "0px !important",
				"z-index": "1 !important",
				"width": window.innerWidth + "px",
				"height": window.innerHeight + "px"
			};
			absurd.add( style ).compile( absurdCompiler( "half-page", GUID ) );
			return style[ selector ];
		};
		return halfpageStyle;
	} );