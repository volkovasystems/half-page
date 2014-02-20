define( "halfpageDirective",
	[
		"amplify",
		"arbiter",
		"chance",
		"jquery",
		"requirejs",
		"angular",
		"bindDOM",
		"safeApply"
	],
	function construct( ){
		requirejs.config( {
			"paths": {
				"pageDirective": staticBaseURL + "/half-page/directive/page-directive",
				"halfpageStyle": staticBaseURL + "/half-page/style/halfpage-style",
				"halfpageHeaderTemplate": staticBaseURL + "/half-page/template/halfpage-header-template",
				"halfpageHeaderController": staticBaseURL + "/half-page/controller/halfpage-header-controller"
			}
		} );

		requirejs( [
				"pageDirective",
				"halfpageHeaderTemplate",
				"halfpageHeaderController"				
			],
			function construct( pageDirective, halfpageHeaderTemplate, halfpageHeaderController ){
				bindDOMFactory( "HalfPage" );
				safeApplyFactory( "HalfPage" );

				angular.module( "HalfPage" )
					.directive( "halfpageHeader",
						[
							"bindDOM",
							"safeApply",
							function directive( bindDOM, safeApply ){
								return {
									"restrict": "A",
									"controller": halfpageHeaderController,
									"template": halfpageHeaderTemplate,
									"scope": true,
									"compile": function compile( element, attributes, transclude ){
										return {
											"pre": function preLink( scope, element, attributes ){
												safeApply( scope );
												scope.GUID = chance.guid( );
											},
											"post": function postLink( scope, element, attributes ){
												bindDOM( scope, element, attributes );
												component.attr( "halfpage-header", scope.GUID );
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
