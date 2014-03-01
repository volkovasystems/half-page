define( "halfpageDirective",
	[
		"amplify",
		"arbiter",
		"chance",
		"jquery",
		"requirejs",
		"angular",
		"bindDOMFactory",
		"safeApplyFactory"
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
				"halfpageHeaderDirective",
				"halfpageBodyDirective",
				"halfpageFooterDirective",
				"halfpageTemplate",
				"halfpageController"
			],
			function construct( halfpageTemplate, halfpageController ){
				bindDOMFactory( "HalfPage" );
				safeApplyFactory( "HalfPage" );
				angular.module( "HalfPage" )
					.directive( "halfpage",
						[
							"bindDOM",
							"safeApply",
							function directive( bindDOM, safeApply ){
								return {
									"restrict": "A",
									"controller": halfpageController,
									"template": halfpageTemplate,
									"scope": true,
									"compile": function compile( element, attributes, transclude ){
										return {
											"pre": function preLink( scope, element, attributes ){
												safeApply( scope );
												scope.GUID = chance.guid( );
											},
											"post": function postLink( scope, element, attributes ){
												bindDOM( scope, element, attributes );
												component.attr( "halfpage", scope.GUID );
											}
										}
									}
								}
							}
						] );
			} );
	} );