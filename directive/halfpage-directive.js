define( "halfpageDirective",
	[
		"async",
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
				"halfpageTemplate",
				"halfpageController",
				"halfpageHeaderDirective",
				"halfpageBodyDirective",
				"halfpageFooterDirective",
				"appDetermine"
			],
			function construct( halfpageStyle,
								halfpageTemplate, 
								halfpageController )
			{
				appDetermine( "HalfPage" )
					.directive( "halfPage",
						[
							"bindDOM",
							"safeApply",
							function construct( bindDOM, safeApply ){
								return {
									"restrict": "A",
									"controller": "halfpageController",
									"template": halfpageTemplate,
									"priority": 1,
									"scope": {
										"appName": "@",
										"name": "@"
									},
									"link": function link( scope, element, attribute ){
										safeApply( scope );
										bindDOM( scope, element, attribute );
										
										scope.GUID = chance.guid( ).toLowerCase( );
										scope.namespace = scope.name + "-" + scope.appName.toLowerCase( );
										scope.safeApply( );
										
										scope.element.attr( "half-page", scope.GUID );
										scope.element.attr( "namespace", scope.namespace );
										halfpageStyle( scope.GUID );
										Arbiter.subscribe( "on-resize:" + scope.namespace,
											function handler( ){
												scope.element.css( {
													"position": "absolute !important",
													"top": "0px !important",
													"left": "0px !important",
													"z-index": "0 !important",
													"width": window.innerWidth + "px",
													"height": window.innerHeight + "px"
												} );
											} );

										//This will bind the halfpage object to the halfpage directive.
										var halfpageObject = scope.element.data( "halfpage-object" );
										scope.halfpageObject = halfpageObject;
										halfpageObject.scope = scope;
										scope.safeApply( );

										halfpageObject.attachKeyListeners( );
									}
								}
							}
						] );
				Arbiter.publish( "module-loaded:halfpage-directive", null, { "persist": true } );
			} );
	} );