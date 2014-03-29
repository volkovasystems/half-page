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
										
										onRender( $timeout, element,
											function handler( ){
												scope.GUID = attribute.halfpageBody;
												scope.namespace = scope.name + "-" + scope.appName.toLowerCase( );
												scope.container = scope.name;
												scope.safeApply( );

												scope.element.attr( "namespace", scope.namespace );
												halfpageBodyStyle( scope.GUID );
												Arbiter.subscribe( "on-resize:" + scope.namespace,
													function handler( ){
														scope.element.css( {
															"position": "absolute !important",
															"top": "50px !important",
															"left": "0px !important",
															"z-index": "2 !important",
															"height": Math.abs( window.innerHeight - 110 ) + "px",
															"width": window.innerWidth + "px"
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
