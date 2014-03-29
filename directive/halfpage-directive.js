define( "halfpageDirective",
	[
		"async",
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
				"halfpageStyle": staticBaseURL + "/half-page/style/halfpage-style",
				"halfpageHeaderDirective": staticBaseURL + "/half-page/directive/halfpage-header-directive",
				"halfpageBodyDirective": staticBaseURL + "/half-page/directive/halfpage-body-directive",
				"halfpageFooterDirective": staticBaseURL + "/half-page/directive/halfpage-footer-directive",
				"halfpageTemplate": staticBaseURL + "/half-page/template/halfpage-template",
				"halfpageController": staticBaseURL + "/half-page/controller/halfpage-controller"
			}
		} );
		requirejs( [
				"halfpageStyle",
				"halfpageTemplate",
				"halfpageController",
				"halfpageHeaderDirective",
				"halfpageBodyDirective",
				"halfpageFooterDirective",
				"appDetermine"
			],
			function construct( halfpageStyle,
								halfpageTemplate, 
								halfpageController )
			{
				appDetermine( "HalfPage" )
					.directive( "halfPage",
						[
							"bindDOM",
							"safeApply",
							function construct( bindDOM, safeApply ){
								return {
									"restrict": "A",
									"controller": "halfpageController",
									"template": halfpageTemplate,
									"priority": 1,
									"scope": {
										"appName": "@",
										"name": "@"
									},
									"link": function link( scope, element, attribute ){
										safeApply( scope );
										bindDOM( scope, element, attribute );
										
										//This will bind the halfpage object to the halfpage directive.
										var halfpageObject = scope.element.data( "halfpage-object" );
										scope.halfpageObject = halfpageObject;
										halfpageObject.scope = scope;

										/*
											We use the halfpage object as a unique
												DOM ID for every element.

											Note on IDs:

												GUID is used to refer both the object and the DOM
													include anything that is under the hierarchy
													and scope of the DOM.

													In case of halfpage, the GUID is attached to
													the main DOM followed by its header, body and footer.

												DOMID is the namespace used by the object but may refer
													to the DOM specifically.

													This may be used to refer specifically to the DOM when
													using the object to manipulate it.

												The namespace of the DOM refers to the category of what
													kind of DOM it is and what application it belongs.
	
													This can be used to manipulate the entire
													category of DOM.
										*/
										scope.DOMID = halfpageObject.namespace;
										scope.element.attr( "domid", scope.DOMID );

										scope.GUID = halfpageObject.GUID || chance.guid( ).toLowerCase( );
										scope.namespace = scope.name + "-" + scope.appName.toLowerCase( );
										scope.safeApply( );

										scope.element.attr( "half-page", scope.GUID );
										scope.element.attr( "namespace", scope.namespace );
										halfpageStyle( scope.GUID );

										Arbiter.subscribe( "on-resize:" + scope.namespace,
											"on-resize:" + scope.DOMID, 
											function handler( ){
												scope.element.css( {
													"position": "absolute !important",
													"top": "0px !important",
													"left": "0px !important",
													"z-index": "0 !important",
													"width": window.innerWidth + "px",
													"height": window.innerHeight + "px"
												} );
											} );

										halfpageObject.attachKeyListeners( );
									}
								}
							}
						] );

				moduleLoadNotifier( "halfpage-directive" ).notifyModuleLoaded( );
			} );
	} );