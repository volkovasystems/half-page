try{ var base = window; }catch( error ){ base = exports; }
( function module( base ){
	define( "half-page", 
		[
			"requirejs",
			"underscore",
			"angular",
			"jquery"
		],
		function construct( ){
			angular.module( "HalfPage", [ ] );

			requirejs.config( {
				"paths": {
					"halfpageDirective": staticBaseURL + "/half-page/directive/halfpage-directive"
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
		} );
} )( base );
