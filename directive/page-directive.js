define( "pageDirective",
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
				"pageStyle": staticBaseURL + "/half-page/style/page-style",
				"pageTemplate": staticBaseURL + "/half-page/template/page-template",
				"pageController": staticBaseURL + "/half-page/controller/page-controller",
				"headerControlDirective": staticBaseURL + "/half-page/directive/header-control-directive",
				"pageContentDirective": staticBaseURL + "/half-page/directive/page-content-directive",
				"footerControlDirective": staticBaseURL + "/half-page/directive/footer-control-directive"
			}
		} );

		requirejs( [
				"pageStyle",
				"pageTemplate",
				"pageController",
				"headerControlDirective",
				"pageContentDirective",
				"footerControlDirective",
				"appDetermine"
			],
			function construct( pageStyle,
								pageTemplate, 
								pageController )
			{
				appDetermine( "HalfPage" )
					.directive( "page",
						[
							"bindDOM",
							"safeApply",
							function directive( bindDOM, safeApply ){
								return {
									"restrict": "A",
									"controller": pageController,
									"template": pageTemplate,
									"priority": 1,
									"scope": {
										"appName": "@",
										"name": "@"
									},
									"compile": function compile( ){
										return {
											"pre": function preLink( scope, element, attribute ){
												safeApply( scope );
												scope.GUID = attribute.page;
												pageStyle( scope.GUID );
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
															"height": parentElement.height( ) + "px",
															"width": parentElement.width( ) + "px"
														} );
													} );
											}
										}
									}
								}
							}
						] );
				Arbiter.publish( "module-loaded:page-directive", null, { "persist": true } );
			} );
	} );
