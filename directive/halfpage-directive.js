define( "halfpageDirective",
	[
		"amplify",
		"angular",
		"arbiter",
		"chance",
		"jquery",
		"require"
	],
	function construct( amplify,
						angular,
						Arbiter,
						chance,
						$,
						requirejs )
	{
		requirejs.config( {
			"paths": {
				"halfpageTemplate": "/half-page/template/halfpage-template.js",
				"halfpageController": "/half-page/controller/halfpage-controller.js"
			}
		} );

		require( [
				"halfpageTemplate",
				"halfpageController"
			],
			function construct( halfpageTemplate, halfpageController ){
				angular.module( "HalfPage" )
					.directive( "halfpage",
						[ 
							function directive( ){
								return {
									"restrict": "A",
									"controller": halfpageController,
									"template": halfpageTemplate,
									"scope": true,
									"compile": function compile( element, attributes, transclude ){
										return {
											"pre": function preLink( scope, element, attributes ){
												scope.GUID = chance.guid( );
											},
											"post": function postLink( scope, element, attributes ){
												var component = $( element );
												component.attr( "halfpage", scope.GUID );
												scope.component = component;
												scope.attributes = attributes;
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
