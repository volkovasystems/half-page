try{ var base = window; }catch( error ){ base = exports; }
( function module( base ){
	define( "halfpage", 
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
					var HalfPage = function HalfPage( namespace, pageCount, pageViews ){
						this.namespace = namespace;
						this.pageCount = pageCount;
						this.pageViews = pageViews;
					};

					HalfPage.prototype.attachComponent = function attachComponent( componentID ){
						var componentObject = $( "#" + componentID );
						var componentElement = componentObject[ 0 ];
						if( !componentElement ){
							throw new Error( "failed to attach halfpage component" );
						}
						angular.bootstrap( componentElement, [ "HalfPage" ] );
						componentObject.addClass( "bootstrapped" );
						componentObject.attr( "ng-bound-app", "HalfPage" );
					};

					base.HalfPage = HalfPage;
				}  );
		} );
} )( base );
