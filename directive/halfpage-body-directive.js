define( "halfpageBodyDirective",
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
				"halfpageBodyStyle": staticBaseURL + "/half-page/style/halfpage-body-style",
				"halfpageBodyController": staticBaseURL + "/half-page/controller/halfpage-body-controller"
			}
		} );
		requirejs( [
				"halfpageBodyStyle",
				"halfpageBodyController",
				"appDetermine",
				"onRender"
			],
			function construct( halfpageBodyStyle,
								halfpageBodyController )
			{
				/*
					This is not exposed in the outside world because this is intended to
						be accessible via an interface.

					This class is designed like this so that the halfpage is the only
						object that can manipulate the halfpage body container.
				*/
				var HalfPageBody = function HalfPageBody( scope ){
					this.scope = scope;
					this.reconstructDOMID( );
				};

				HalfPageBody.prototype.reconstructDOMID = function reconstructDOMID( ){
					var parent = this.scope.element.parent( );
					var parentDOMID = parent.attr( "domid" );
					this.DOMID = parentDOMID + "-halfpage-body";
					this.scope.element.attr( "domid", this.DOMID );
					this.scope.DOMID = this.DOMID;
				};

				HalfPageBody.prototype.getDOMID = function getDOMID( ){
					return this.DOMID;
				}

				HalfPageBody.prototype.getX  = function getX( ){
					return 0;
				};

				HalfPageBody.prototype.getY = function getY( ){
					return 50;
				};

				HalfPageBody.prototype.getHeight = function getHeight( ){
					var parentHeight = scope.element.parent( ).height( );
					return Math.abs( parentHeight - 110 );
				};

				HalfPageBody.prototype.getWidth = function getWidth( ){
					return scope.element.parent( ).width( );
				};

				HalfPageBody.prototype.getZIndex = function getZIndex( ){
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
					.directive( "halfpageBody",
						[
							"bindDOM",
							"safeApply",
							"$timeout",
							function directive( bindDOM, safeApply, $timeout ){
								return {
									"restrict": "A",
									"controller": "halfpageBodyController",
									"priority": 1,
									"scope": {
										"appName": "@",
										"name": "@" 
									},
									"link": function link( scope, element, attribute ){
										safeApply( scope );
										bindDOM( scope, element, attribute );

										var halfpageBodyObject = new HalfPageBody( scope );
										scope.element.data( "halfpage-body-object", halfpageBodyObject );
										scope.halfpageBodyObject = halfpageBodyObject;
										
										onRender( $timeout, element,
											function handler( ){
												scope.GUID = attribute.halfpageBody;
												scope.namespace = scope.name + "-" + scope.appName.toLowerCase( );
												scope.container = scope.name;
												scope.safeApply( );

												scope.element.attr( "namespace", scope.namespace );
												halfpageBodyStyle( scope.GUID );
												Arbiter.subscribe( "on-resize:" + scope.namespace,
													"on-resize:" + scope.DOMID,
													function handler( ){
														scope.element.css( {
															"position": "absolute !important",
															"top": scope.halfpageBodyObject.getY( ),
															"left": scope.halfpageBodyObject.getX( ),
															"z-index": scope.halfpageBodyObject.getZIndex( ),
															"height": scope.halfpageBodyObject.getHeight( ),
															"width": scope.halfpageBodyObject.getWidth( )
														} );
													} );
											} );
									}
								}
							}
						] );

				moduleLoadNotifier( "halfpage-body-directive" ).notifyModuleLoaded( );
			} );
	} );
