define( "halfpageStyle",
	[
		"absurd",
		"jquery",
		"absurdCompiler"
	],
	function construct( ){
		var absurd = Absurd( );
		var setHalfpageStyle = function setHalfpageStyle( GUID ){
			var style = { };
			var selector =  "div[half-page='" + GUID + "'']";
			style[ selector ] = {
				
			};
			absurd.add( style ).compile( absurdCompiler( "half-page", GUID ) );
		};
	} );