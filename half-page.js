try{ var base = window; }catch( error ){ base = exports; }
( function module( base ){
	define( "halfpage", 
		[
			"async",
			"requirejs",
			"underscore",
			"angular",
			"jquery"
		],
		function construct( async ){
			requirejs.config( {
				"paths": {
					"halfpageDirective": staticBaseURL + "/half-page/directive/halfpage-directive"
				}
			} );
			requirejs( [ 
					"halfpageDirective",
					"bindDOMFactory",
					"safeApplyFactory",
					"autoResizeDirective",
					"appDetermine"
				],
				function construct( ){
					var halfPageApp = angular.module( "HalfPage", [ ] );
					var appNamespace = appDetermine( "HalfPage" ).name;
					
					safeApplyFactory( appNamespace );
					bindDOMFactory( appNamespace );
					autoResizeDirective( appNamespace );

					var HalfPage = function HalfPage( namespace, pageCount, pageViews ){
						this.namespace = namespace;
						this.pageCount = pageCount;
						this.pageViews = pageViews;
					};

					HalfPage.prototype.cleanContainer = function cleanContainer( ){
						//TODO: This will remove all elements outside the halfpage component.
					};

					HalfPage.prototype.attachComponent = function attachComponent( componentID ){
						var componentObject = $( "#" + componentID );
						var componentElement = componentObject[ 0 ];
						if( !componentElement ){
							throw new Error( "failed to attach halfpage component" );
						}
						if( appNamespace == "HalfPage" ){	
							appDetermine.bootstrap( componentObject, appNamespace );
						}else{
							componentObject.attr( "ng-bound-app", appNamespace );
						}
						this.cleanContainer( );
					};

					HalfPage.prototype.addPage = function addPage( ){

					};

					HalfPage.prototype.removePage = function removePage( ){

					};

					base.HalfPage = HalfPage;
				}  );
			
			return ( function onModuleLoad( handler ){
				async.parallel( [
						function handler( callback ){
							Arbiter.subscribe( "module-loaded:halfpage-directive", callback );
						},
						function handler( callback ){
							Arbiter.subscribe( "module-loaded:halfpage-header-directive", callback );	
						},
						function handler( callback ){
							Arbiter.subscribe( "module-loaded:halfpage-body-directive", callback );
						},
						function handler( callback ){
							Arbiter.subscribe( "module-loaded:halfpage-footer-directive", callback );
						},
						
						//TODO: Page should be as a separate componenet not part of the halfpage.
						function handler( callback ){
							Arbiter.subscribe( "module-loaded:page-directive", callback );
						},
						function handler( callback ){
							Arbiter.subscribe( "module-loaded:page-content-directive", callback );
						},
						function handler( callback ){
							Arbiter.subscribe( "module-loaded:footer-control-directive", callback );
						},
						function handler( callback ){
							Arbiter.subscribe( "module-loaded:header-control-directive", callback );
						}
					], handler );
			} );
		} );
} )( base );
