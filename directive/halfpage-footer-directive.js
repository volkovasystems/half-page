define( "halfpageFooterDirective",
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
				"halfpageFooterStyle": staticBaseURL + "/half-page/style/halfpage-footer-style",
				"halfpageFooterTemplate": staticBaseURL + "/half-page/template/halfpage-footer-template",
				"halfpageFooterController": staticBaseURL + "/half-page/controller/halfpage-footer-controller"
			}
		} );

		requirejs( [
				"halfpageFooterStyle",
				"halfpageFooterTemplate",
				"halfpageFooterController",
				"pageDirective",
				"appDetermine"
			],
			function construct( halfpageFooterStyle, 
								halfpageFooterTemplate, 
								halfpageFooterController )
			{
				appDetermine( "HalfPage" )
					.directive( "halfpageFooter",
						[
							"bindDOM",
							"safeApply",
							function directive( bindDOM, safeApply ){
								return {
									"restrict": "A",
									"controller": halfpageFooterController,
									"template": halfpageFooterTemplate,
									"priority": 1,
									"scope": {
										"appName": "@",
										"name": "@"
									},
									"link": function link( scope, element, attribute ){
										safeApply( scope );
										bindDOM( scope, element, attribute );

										scope.GUID = attribute.halfpageFooter;
										scope.namespace = scope.name + "-" + scope.appName.toLowerCase( );
										scope.container = scope.name;
										scope.safeApply( );

										scope.element.attr( "namespace", scope.namespace );
										halfpageFooterStyle( scope.GUID );
										Arbiter.subscribe( "on-resize:" + scope.namespace,
											function handler( ){
												scope.element.css( {
													"position": "absolute !important",
													"bottom": "0px !important",
													"left": "0px !important",
													"z-index": "2 !important",
													"height": "60px !important",
													"width": window.innerWidth + "px"
												} );
											} );
									}
								}
							}
						] );
				Arbiter.publish( "module-loaded:halfpage-footer-directive", null, { "persist": true } );
			} );
	} );