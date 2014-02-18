define( "halfpageDirective",
	[
		"amplify",
		"arbiter",
		"chance",
		"jquery",
		"requirejs",
		"angular"
	],
	function construct( amplify,
						Arbiter,
						chance,
						$,
						requirejs,
						angular )
	{
		requirejs.config( {
			"paths": {
				"halfpageTemplate": staticBaseUrl + "/half-page/template/halfpage-template",
				"halfpageController": staticBaseUrl + "/half-page/controller/halfpage-controller"
			}
		} );

		requirejs( [
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
