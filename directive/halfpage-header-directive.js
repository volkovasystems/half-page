define( "halfpageHeaderDirective",
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
				"halfpageHeaderStyle": staticBaseURL + "/half-page/style/halfpage-header-style",
				"halfpageHeaderController": staticBaseURL + "/half-page/controller/halfpage-header-controller"
			}
		} );

		requirejs( [
				"halfpageHeaderStyle",
				"halfpageHeaderController",
				"appDetermine",
				"onRender"
			],
			function construct( halfpageHeaderStyle,
								halfpageHeaderController )
			{
				/*
					This is not exposed in the outside world because this is intended to
						be accessible via an interface.

					This class is designed like this so that the halfpage is the only
						object that can manipulate the halfpage body container.
				*/
				var HalfPageHeader = function HalfPageHeader( scope ){
					this.scope = scope;
					this.reconstructDOMID( );
				};

				HalfPageHeader.prototype.reconstructDOMID = function reconstructDOMID( ){
					var parent = this.scope.element.parent( );
					var parentDOMID = parent.attr( "domid" );
					this.DOMID = parentDOMID + "-halfpage-header";
					this.scope.element.attr( "domid", this.DOMID );
					this.scope.DOMID = this.DOMID;
				};

				HalfPageHeader.prototype.getDOMID = function getDOMID( ){
					return this.DOMID;
				}

				HalfPageHeader.prototype.getX  = function getX( ){
					return 0;
				};

				HalfPageHeader.prototype.getY = function getY( ){
					return 0;
				};

				HalfPageHeader.prototype.getHeight = function getHeight( ){
					return 50;
				};

				HalfPageHeader.prototype.getWidth = function getWidth( ){
					return scope.element.parent( ).width( );
				};

				HalfPageHeader.prototype.getZIndex = function getZIndex( ){
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
					.directive( "halfpageHeader",
						[
							"bindDOM",
							"safeApply",
							function directive( bindDOM, safeApply ){
								return {
									"restrict": "A",
									"controller": "halfpageHeaderController",
									"priority": 1,
									"scope": {
										"appName": "@",
										"name": "@"
									},
									"link": function link( scope, element, attribute ){
										safeApply( scope );
										bindDOM( scope, element, attribute );

										var halfpageHeaderObject = new HalfPageHeader( scope );
										scope.element.data( "halfpage-header-object", halfpageHeaderObject );
										scope.halfpageHeaderObject = halfpageHeaderObject;
										
										onRender( element,
											function handler( ){
												scope.GUID = attribute.halfpageHeader;
												scope.namespace = scope.name + "-" + scope.appName.toLowerCase( );
												scope.container = scope.name;
												scope.safeApply( );
												
												scope.element.attr( "namespace", scope.namespace );
												halfpageHeaderStyle( scope.GUID );

												Arbiter.subscribe( "on-resize:" + scope.namespace,
													"on-resize:" + scope.DOMID, 
													function handler( ){
														scope.element.css( {
															"position": "absolute !important",
															"top": scope.halfpageHeaderObject.getY( ),
															"left": scope.halfpageHeaderObject.getX( ),
															"z-index": scope.halfpageHeaderObject.getZIndex( ),
															"height": scope.halfpageHeaderObject.getHeight( ),
															"width": scope.halfpageHeaderObject.getWidth( )
														} );
													} );
											} );
									}
								}
							}
						] );

				moduleLoadNotifier( "halfpage-header-directive" ).notifyModuleLoaded( );
			} );
	} );
