( function module( base ){
	define( "half-page", 
		[
			"require",
			"angular",
			"underscore"
		],
		function construct( require, angular, _ ){
			angular.moduel( "HalfPage", [ ] );

			requirejs.config( {
				"paths": {
					"halfPageDirective": "/half-page/directive/halfpage-directive.js"
				}
			} );

			requirejs( [ 
					"halfpageDirective" 
				],
				function construct( halfpageDirective ){
					var HalfPage = function HalfPage( ){

					};

					base.HalfPage = HalfPage;
				}  );

			return HalfPage;
		} );
} )( base );
