try{ var base = window; }catch( error ){ base = exports; }
( function module( base ){
	define( "halfpage", 
		[
			"async",
			"amplify",
			"requirejs",
			"underscore",
			"angular",
			"jquery"
		],
		function construct( async ){
			requirejs.config( {
				"paths": {
					"halfpageComponentTemplate": staticBaseURL + "/half-page/template/halfpage-component-template",
					"halfpageDirective": staticBaseURL + "/half-page/directive/halfpage-directive"
				}
			} );
			requirejs( [ 
					"halfpageComponentTemplate",
					"halfpageDirective",
					"bindDOMFactory",
					"safeApplyFactory",
					"autoResizeDirective",
					"appDetermine"
				],
				function construct( halfpageComponentTemplate ){
					var halfpageApp = angular.module( "HalfPage", [ ] );
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

					HalfPage.prototype.attachKeyListeners = function attachKeyListeners( ){
						if( this.keyListenersInitialized ){
							return;
						}
						this.keyListenersInitialized = true;

						var referenceID = this.scope.namespace + "[" + this.scope.GUID + "]";
						this.scope.referenceID = referenceID;
						$( window ).keypress( function onKeyPress( event ){
							console.log( "window:keypress" );
							amplify.publish( "on-keypress:" + referenceID, event );
						} );

						$( window ).keydown( function onKeyDown( event ){
							amplify.publish( "on-keydown:" + referenceID, event );
						} );

						$( window ).keyup( function onKeyUp( event ){
							amplify.publish( "on-keyup:" + referenceID, event );
						} );
					};

					HalfPage.prototype.attachComponent = function attachComponent( component ){
						var componentObject;
						if( typeof component == "string" ){
							componentObject = $( "#" + component );	
						}else if( component instanceof $ ){
							componentObject = component;
						}else{
							throw new Error( "invalid component" );
						}

						var componentElement = componentObject[ 0 ];
						if( !componentElement ){
							throw new Error( "failed to attach halfpage component" );
						}

						if( componentObject.hasClass( "halfpage-attached" ) ){
							return;
						}

						this.halfpageContainer = componentObject;
						halfpageComponent = $( halfpageComponentTemplate );
						halfpageComponent.attr( "app-name", appNamespace );
						componentObject.append( halfpageComponent );

						var self = this;
						halfpageComponent.ready( function onReady( ){
							if( appNamespace == "HalfPage" ){	
								appDetermine.bootstrap( componentObject, appNamespace );
							}
							componentObject.attr( "ng-bound-app", appNamespace );
							componentObject.addClass( "halfpage-attached" );
							halfpageComponent.data( "halfpage-object", self );
						} );

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
						/*function handler( callback ){
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
						}*/
					], handler );
			} );
		} );
} )( base );
