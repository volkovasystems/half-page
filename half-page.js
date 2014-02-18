try{ var base = window; }catch( error ){ base = exports; }
( function module( base ){
	define( "half-page", 
		[
			"require",
			"underscore",
			"angular"
		],
		function construct( require, _ ){
			angular.module( "HalfPage", [ ] );

			requirejs.config( {
				"paths": {
					"halfPageDirective": "/half-page/directive/halfpage-directive.js"
				}
			} );

			requirejs( [ 
					"halfpageDirective"
				],
				function construct( halfpageDirective ){
					var HalfPage = function HalfPage( pageCount ){

					};

					HalfPage.prototype.attachComponent = function attachComponent( ){

					};

					base.HalfPage = HalfPage;
				}  );

			return HalfPage;
		} );
} )( base );
