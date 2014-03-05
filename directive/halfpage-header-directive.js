define( "halfpageHeaderDirective",
	[
		"amplify",
		"arbiter",
		"chance",
		"jquery",
		"requirejs",
		"angular"
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
				appDetermine( "HalfPage" )
					.directive( "halfpageHeader",
						[
							"bindDOM",
							"safeApply",
							"$timeout",
							function directive( bindDOM, safeApply, $timeout ){
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
										
										onRender( $timeout, element,
											function handler( ){
												scope.GUID = attribute.halfpageHeader;
												scope.namespace = scope.name + "-" + scope.appName.toLowerCase( );
												scope.container = scope.name;
												scope.safeApply( );
												
												scope.element.attr( "namespace", scope.namespace );
												halfpageHeaderStyle( scope.GUID );
												Arbiter.subscribe( "on-resize:" + scope.namespace,
													function handler( ){
														scope.element.css( {
															"position": "absolute !important",
															"top": "0px !important",
															"left": "0px !important",
															"z-index": "2 !important",
															"height": "50px !important",
															"width": window.innerWidth + "px"
														} );
													} );
											} );
									}
								}
							}
						] );
				Arbiter.publish( "module-loaded:halfpage-header-directive", null, { "persist": true } );
			} );
	} );
