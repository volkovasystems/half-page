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

										onRender( element,
											function handler( ){
												scope.GUID = attribute.halfpageFooter;
												scope.namespace = scope.name + "-" + scope.appName.toLowerCase( );
												scope.container = scope.name;
												scope.safeApply( );

												scope.element.attr( "namespace", scope.namespace );
												halfpageFooterStyle( scope.GUID );
												Arbiter.subscribe( "on-resize:" + scope.namespace,
													function handler( ){
														scope.element.css( {
															"position": "absolute !important",
															"bottom": "0px !important",
															"left": "0px !important",
															"z-index": "2 !important",
															"height": "60px !important",
															"width": window.innerWidth + "px"
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