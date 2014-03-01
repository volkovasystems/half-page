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
				"pageDirective": staticBaseURL + "/half-page/directive/page-directive",
				"halfpageFooterTemplate": staticBaseURL + "/half-page/template/halfpage-footer-template",
				"halfpageFooterController": staticBaseURL + "/half-page/controller/halfpage-footer-controller"
			}
		} );

		requirejs( [
				"pageDirective",
				"halfpageFooterTemplate",
				"halfpageFooterController"				
			],
			function construct( pageDirective, halfpageFooterTemplate, halfpageFooterController ){
				bindDOMFactory( "HalfPage" );
				safeApplyFactory( "HalfPage" );

				angular.module( "HalfPage" )
					.directive( "halfpageFooter",
						[
							"bindDOM",
							"safeApply",
							function directive( bindDOM, safeApply ){
								return {
									"restrict": "A",
									"controller": halfpageFooterController,
									"template": halfpageFooterTemplate,
									"scope": true,
									"compile": function compile( element, attributes, transclude ){
										return {
											"pre": function preLink( scope, element, attributes ){
												safeApply( scope );
												scope.GUID = chance.guid( );
											},
											"post": function postLink( scope, element, attributes ){
												bindDOM( scope, element, attributes );
												component.attr( "halfpage-footer", scope.GUID );
											}
										}
									},
									"link": function link( scope, element, attributes ){

									}
								}
							}
						] );
			} );
	} );