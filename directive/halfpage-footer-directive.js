define( "halfpageFooterDirective",
	[
		"amplify",
		"arbiter",
		"chance",
		"jquery",
		"requirejs",
		"angular",
		"moduleLoadNotifier"
	],
	function construct( ){
		requirejs.config( {
			"paths": {
				"halfpageFooterStyle": staticBaseURL + "/half-page/style/halfpage-footer-style",
				"halfpageFooterController": staticBaseURL + "/half-page/controller/halfpage-footer-controller"
			}
		} );

		requirejs( [
				"halfpageFooterStyle",
				"halfpageFooterController",
				"appDetermine",
				"onRender"
			],
			function construct( halfpageFooterStyle, 
								halfpageFooterController )
			{
				/*
					This is not exposed in the outside world because this is intended to
						be accessible via an interface.

					This class is designed like this so that the halfpage is the only
						object that can manipulate the halfpage body container.
				*/
				var HalfPageFooter = function HalfPageFooter( scope ){
					this.scope = scope;
					this.reconstructDOMID( );
				};

				HalfPageFooter.prototype.reconstructDOMID = function reconstructDOMID( ){
					var parent = this.scope.element.parent( );
					var parentDOMID = parent.attr( "domid" );
					this.DOMID = parentDOMID + "-halfpage-footer";
					this.scope.element.attr( "domid", this.DOMID );
					this.scope.DOMID = this.DOMID;
				};

				HalfPageFooter.prototype.getDOMID = function getDOMID( ){
					return this.DOMID;
				}

				HalfPageFooter.prototype.getX  = function getX( ){
					return 0;
				};

				HalfPageFooter.prototype.getY = function getY( ){
					return 0;
				};

				HalfPageFooter.prototype.getHeight = function getHeight( ){
					return 60;
				};

				HalfPageFooter.prototype.getWidth = function getWidth( ){
					return scope.element.parent( ).width( );
				};

				HalfPageFooter.prototype.getZIndex = function getZIndex( ){
					var parentElement = this.scope.element.parent( );
					var zIndex = parentElement.css( "z-index" );
					if( zIndex === "auto" ){
						return 1;
					}else if( typeof zIndex == "string" ){
						zIndex = parseInt( zIndex );
					}
					if( isNaN( zIndex ) ){
						throw new Error( "invalid z-index value" );
					}
					return zIndex + 1;
				};

				appDetermine( "HalfPage" )
					.directive( "halfpageFooter",
						[
							"bindDOM",
							"safeApply",
							function directive( bindDOM, safeApply ){
								return {
									"restrict": "A",
									"controller": "halfpageFooterController",
									"priority": 1,
									"scope": {
										"appName": "@",
										"name": "@"
									},
									"link": function link( scope, element, attribute ){
										safeApply( scope );
										bindDOM( scope, element, attribute );

										var halfpageFooterObject = new HalfPageFooter( scope );
										scope.element.data( "halfpage-footer-object", halfpageFooterObject );
										scope.halfpageFooterObject = halfpageFooterObject;

										onRender( element,
											function handler( ){
												scope.GUID = attribute.halfpageFooter;
												scope.namespace = scope.name + "-" + scope.appName.toLowerCase( );
												scope.container = scope.name;
												scope.safeApply( );

												scope.element.attr( "namespace", scope.namespace );
												halfpageFooterStyle( scope.GUID );
												
												Arbiter.subscribe( "on-resize:" + scope.namespace,
													"on-resize:" + scope.DOMID, 
													function handler( ){
														scope.element.css( {
															"position": "absolute !important",
															"bottom": scope.halfpageFooterObject.getY( ),
															"left": scope.halfpageFooterObject.getX( ),
															"z-index": scope.halfpageFooterObject.getZIndex( ),
															"height": scope.halfpageFooterObject.getHeight( ),
															"width": scope.halfpageFooterObject.getWidth( )
														} );
													} );
											} );
									}
								}
							}
						] );

				moduleLoadNotifier( "halfpage-footer-directive" ).notifyModuleLoaded( );
			} );
	} );