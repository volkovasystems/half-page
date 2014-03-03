define( "pageContentDirective",
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
				"pageContentStyle": staticBaseURL + "/half-page/style/page-content-style",
				"pageContentController": staticBaseURL + "/half-page/controller/page-content-controller"
			}
		} );
		requirejs( [
				"pageContentStyle",
				"pageContentController",
				"appDetermine"
			],
			function construct( pageContentStyle, 
								pageContentController )
			{
				appDetermine( "HalfPage" )
					.directive( "pageContent",
						[
							"bindDOM",
							"safeApply",
							function directive( bindDOM, safeApply ){
								return {
									"restrict": "A",
									"controller": pageContentController,
									"priority": 1,
									"scope": {
										"appName": "@",
										"name": "@",
										"container": "@" 
									},
									"compile": function compile( ){
										return {
											"pre": function preLink( scope, element, attribute ){
												safeApply( scope );
												scope.GUID = attribute.page;
												pageContentStyle( scope.GUID );
												scope.namespace = scope.name + "-" + scope.appName.toLowerCase( );
												scope.safeApply( );
											},
											"post": function postLink( scope, element, attribute ){
												bindDOM( scope, element, attribute );
												scope.element.attr( "namespace", scope.namespace );
												Arbiter.subscribe( "on-resize:" + scope.namespace,
													function handler( ){
														var parentElement = scope.element.parent( );
														var parentZIndex = parentElement.css( "z-index" );
														scope.element.css( {
															"position": "absolute !important",
															"top": "0px !important",
															"left": "0px !important",
															//"z-index": " !important",
															//"height": parentElement.height( ) + "px",
															//"width": parentElement.width( ) + "px"
														} );
													} );
											}
										}
									}
								}
							}
						] );
				Arbiter.publish( "module-loaded:page-content-directive", null, { "persist": true } );
			} );
	} );
