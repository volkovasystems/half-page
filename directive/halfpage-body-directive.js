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
				"halfpageBodyTemplate": staticBaseURL + "/half-page/template/halfpage-body-template",
				"halfpageBodyController": staticBaseURL + "/half-page/controller/halfpage-body-controller"
			}
		} );

		requirejs( [
				"pageDirective",
				"halfpageBodyTemplate",
				"halfpageBodyController"				
			],
			function construct( pageDirective, halfpageBodyTemplate, halfpageBodyController ){
				bindDOMFactory( "HalfPage" );
				safeApplyFactory( "HalfPage" );

				angular.module( "HalfPage" )
					.directive( "halfpageBody",
						[
							"bindDOM",
							"safeApply",
							function directive( bindDOM, safeApply ){
								return {
									"restrict": "A",
									"controller": halfpageBodyController,
									"template": halfpageBodyTemplate,
									"scope": true,
									"compile": function compile( element, attributes, transclude ){
										return {
											"pre": function preLink( scope, element, attributes ){
												safeApply( scope );
												scope.GUID = chance.guid( );
											},
											"post": function postLink( scope, element, attributes ){
												bindDOM( scope, element, attributes );
												component.attr( "halfpage-body", scope.GUID );
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
