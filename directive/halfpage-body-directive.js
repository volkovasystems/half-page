define( "halfpageBodyDirective",
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
				"pageDirective": staticBaseURL + "/half-page/directive/page-directive",
				"halfpageBodyStyle": staticBaseURL + "/half-page/style/halfpage-body-style",
				"halfpageBodyTemplate": staticBaseURL + "/half-page/template/halfpage-body-template",
				"halfpageBodyController": staticBaseURL + "/half-page/controller/halfpage-body-controller"
			}
		} );
		requirejs( [
				"halfpageBodyStyle",
				"halfpageBodyTemplate",
				"halfpageBodyController",
				"pageDirective",
				"appDetermine"
			],
			function construct( halfpageBodyStyle,
								halfpageBodyTemplate,
								halfpageBodyController )
			{
				appDetermine( "HalfPage" )
					.directive( "halfpageBody",
						[
							"bindDOM",
							"safeApply",
							function directive( bindDOM, safeApply ){
								return {
									"restrict": "A",
									"controller": halfpageBodyController,
									"template": halfpageBodyTemplate,
									"priority": 1,
									"scope": {
										"appName": "@",
										"name": "@" 
									},
									"link": function link( scope, element, attribute ){
										safeApply( scope );
										bindDOM( scope, element, attribute );
										
										scope.GUID = attribute.halfpageBody;
										scope.namespace = scope.name + "-" + scope.appName.toLowerCase( );
										scope.container = scope.name;
										scope.safeApply( );

										scope.element.attr( "namespace", scope.namespace );
										halfpageBodyStyle( scope.GUID );
										Arbiter.subscribe( "on-resize:" + scope.namespace,
											function handler( ){
												scope.element.css( {
													"position": "absolute !important",
													"top": "50px !important",
													"left": "0px !important",
													"z-index": "2 !important",
													"height": Math.abs( window.innerHeight - 110 ) + "px",
													"width": window.innerWidth + "px"
												} );
											} );
									}
								}
							}
						] );
				Arbiter.publish( "module-loaded:halfpage-body-directive", null, { "persist": true } );
			} );
	} );
