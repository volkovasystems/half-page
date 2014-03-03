define( "footerControlDirective",
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
				"footerControlStyle": staticBaseURL + "/half-page/style/footer-control-style",
				"footerControlController": staticBaseURL + "/half-page/controller/footer-control-controller"
			}
		} );

		requirejs( [
				"footerControlStyle",
				"footerControlController",
				"appDetermine"
			],
			function construct( footerControlStyle, 
								footerControlController )
			{
				appDetermine( "HalfPage" )
					.directive( "footerControl",
						[
							"bindDOM",
							"safeApply",
							function directive( bindDOM, safeApply ){
								return {
									"restrict": "A",
									"controller": footerControlController,
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
												footerControlStyle( scope.GUID );
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
				Arbiter.publish( "module-loaded:footer-control-directive", null, { "persist": true } );
			} );
	} );
