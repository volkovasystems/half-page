try{ var base = window; }catch( error ){ base = exports; }
( function module( base ){
	define( "halfpage", 
		[
			"async",
			"amplify",
			"arbiter",
			"requirejs",
			"underscore",
			"angular",
			"jquery"
		],
		function construct( async ){
			var moduleLoadHandler = Arbiter.create( );
			requirejs.config( {
				"paths": {
					"page": staticBaseURL + "/page/page",
					"pageGroup": staticBaseURL + "/page-group/page-group",
					"halfpageComponentTemplate": staticBaseURL + "/half-page/template/halfpage-component-template",
					"halfpageDirective": staticBaseURL + "/half-page/directive/halfpage-directive"
				}
			} );
			requirejs( [
					"page",
					"pageGroup",
					"halfpageComponentTemplate",
					"halfpageDirective",
					"bindDOMFactory",
					"safeApplyFactory",
					"autoResizeDirective",
					"appDetermine"
				],
				function construct( pageModule,
									pageGroupModule, 
									halfpageComponentTemplate )
				{
					pageModule( function onModuleLoad( ){
						moduleLoadHandler.publish( "module-loaded:page", null, { "persist": true } );
					} );

					pageGroupModule( onModuleLoad( ){
						moduleLoadHandler.publish( "module-loaded:page-group", null, { "persist": true } );
					} );

					var halfpageApp = angular.module( "HalfPage", [ ] );
					var appNamespace = appDetermine( "HalfPage" ).name;
					
					safeApplyFactory( appNamespace );
					bindDOMFactory( appNamespace );
					autoResizeDirective( appNamespace );

					var HalfPage = function HalfPage( namespace, pageCount, pageViews ){
						this.namespace = namespace;
						this.pageCount = pageCount;
						this.pageViews = pageViews;
						this.isAttached = false
					};

					HalfPage.prototype.overrideGUID = function overrideGUID( GUID ){
						/*
							Note that the GUID should be the same for the object
								and the component.

							This method should be called before attaching to the component.
						*/
						this.GUID = GUID;
					};

					HalfPage.prototype.cleanContainer = function cleanContainer( ){
						//TODO: This will remove all elements outside the halfpage component.
					};

					HalfPage.prototype.attachKeyListeners = function attachKeyListeners( ){
						if( this.keyListenersInitialized ){
							return;
						}
						this.keyListenersInitialized = true;

						/*
							Note that the reference ID is always the namespace 
								of the halfpage component ( and not the halfpage object )
								plus the GUID of the halfpage component.
						*/
						var referenceID = this.scope.namespace + "[" + this.scope.GUID + "]";
						this.scope.referenceID = referenceID;
						$( window ).keypress( function onKeyPress( event ){
							amplify.publish( "on-keypress:" + referenceID, event );
						} );

						$( window ).keydown( function onKeyDown( event ){
							amplify.publish( "on-keydown:" + referenceID, event );
						} );

						$( window ).keyup( function onKeyUp( event ){
							amplify.publish( "on-keyup:" + referenceID, event );
						} );
					};

					HalfPage.prototype.attachComponent = function attachComponent( component ){
						var componentObject;
						if( typeof component == "string" ){
							componentObject = $( component );	
						}else if( component instanceof $ ){
							componentObject = component;
						}else{
							throw new Error( "invalid component" );
						}

						if( componentObject.length > 1 ){
							throw new Error( "component refers to many elements" );
						}

						if( componentObject.length == 0 ){
							throw new Error( "component does not exists" );
						}

						if( componentObject.hasClass( "halfpage-attached" ) ){
							return;
						}

						this.halfpageContainer = componentObject;
						halfpageComponent = $( halfpageComponentTemplate );
						halfpageComponent.attr( "app-name", appNamespace );
						componentObject.append( halfpageComponent );
						this.halfpageComponent = halfpageComponent;

						var self = this;
						halfpageComponent.ready( function onReady( ){
							if( appNamespace == "HalfPage" ){	
								appDetermine.bootstrap( componentObject, appNamespace );
							}
							componentObject.attr( "ng-bound-app", appNamespace );
							componentObject.addClass( "halfpage-attached" );
							self.isAttached = true;
							halfpageComponent.data( "halfpage-object", self );
						} );

						this.cleanContainer( );
					};

					HalfPage.prototype.hasPageGroup = function hasPageGroup( ){
						return !_.isEmpty( this.pageGroupList );
					};

					HalfPage.prototype.ensureSubPageGroup = function ensureSubPageGroup( namespace, group ){
						var pageGroupGUID = group.GUID;
						var footerSubPageGroup;
						var headerSubPageGroup;
						if( group.getSubPageGroupCount( ) >= 2 ){
							//Check if we already have a footer and header page group
							var pageGroupList = _.keys( group.getSubPageGroupList( ) );
							/*
								We are doing this because page group and halfpage should reduce dependency
									and neither the two should support each other.
								PageGroup will only provide what it can provide and should not
									provide what others need.
							*/
							for( var index = 0; index < pageGroupList.length; index++ ){
								var pageGroupNamespace = pageGroupList[ index ];
								if( ( /halfpage-footer/ ).test( pageGroupNamespace ) ){
									footerSubPageGroup = group.getSubPageGroup( pageGroupNamespace );
								}
								if( ( /halfpage-header/ ).test( pageGroupNamespace ) ){
									headerSubPageGroup = group.getSubPageGroup( pageGroupNamespace );
								}
							}
							if( footerSubPageGroup.GUID != pageGroupGUID ){
								footerSubPageGroup = undefined;
							}
							if( headerSubPageGroup.GUID != pageGroupGUID ){
								headerSubPageGroup = undefined;
							}
						}
						
						if( !( group.getSubPageGroupCount( ) >= 2 )
							|| !footerSubPageGroup
							|| !headerSubPageGroup )
						{
							footerSubPageGroup = footerSubPageGroup
								|| group.addSubPageGroup( "halfpage-footer-page-group-" 
									+ namespace.toLowerCase( ), pageGroupGUID );
							headerSubPageGroup = headerSubPageGroup
								|| group.addSubPageGroup( "halfpage-header-page-group-" 
									+ namespace.toLowerCase( ), pageGroupGUID );
						}

						if( !footerSubPageGroup.checkIfAttached( ) ){
							footerSubPageGroup.attachComponent( this.getFooterComponent( ) );
						}

						if( !headerSubPageGroup.checkIfAttached( ) ){
							headerSubPageGroup.attachComponent( this.getFooterComponent( ) );	
						}

						return {
							"footerSubPageGroup": footerSubPageGroup,
							"headerSubPageGrou": headerSubPageGroup
						};
					};

					HalfPage.prototype.ensurePageGroup = function ensurePageGroup( namespace, group ){
						if( this.hasPageGroup( ) ){
							if( group === undefined ){
								group = _.values( this.pageGroupList )[ 0 ];
							}else if( group instanceof PageGroup
								&& group.GUID in this.pageGroupList )
							{
								group = this.pageGroupList[ group.GUID ];
							}else if( typeof group == "string"
								&& group in this.pageGroupList )
							{
								group = this.pageGroupList[ group ];
							}
						}else{
							var groupNamespace = "page-group-" + namespace.toLowerCase( );
							group = new PageGroup( groupNamespace );
							group.overrideGUID( chance.guid( ).toLowerCase( ) );
							this.pageGroupList[ group.GUID ] = group;
						}

						if( !group.checkIfAttached( ) ){
							group.attachComponent( this.getBodyComponent( ) );
						}
						return group;
					};

					HalfPage.prototype.addPage = function addPage( namespace, view, group ){
						group = this.ensurePageGroup( namespace, group );
						var subPageGroupList = this.ensureSubPageGroup( namespace, group );


					};

					HalfPage.prototype.addPageGroup = function addPageGroup( namespace ){

					};

					HalfPage.prototype.removePage = function removePage( ){

					};

					HalfPage.prototype.getHeaderComponent = function getHeaderComponent( ){
						return this.halfpageComponent.find( "> halfpage-header" );
					};

					HalfPage.prototype.getFooterComponent = function getFooterComponent( ){
						return this.halfpageComponent.find( "> halfpage-footer" );
					};

					HalfPage.prototype.getBodyComponent = function getBodyComponent( ){
						return this.halfpageComponent.find( "> halfpage-body" );
					};

					base.HalfPage = HalfPage;
				}  );
			
			return ( function onModuleLoad( handler ){
				async.parallel( [
						function handler( callback ){
							Arbiter.subscribe( "module-loaded:halfpage-directive", callback );
						},
						function handler( callback ){
							Arbiter.subscribe( "module-loaded:halfpage-header-directive", callback );	
						},
						function handler( callback ){
							Arbiter.subscribe( "module-loaded:halfpage-body-directive", callback );
						},
						function handler( callback ){
							Arbiter.subscribe( "module-loaded:halfpage-footer-directive", callback );
						},
						function handler( callback ){
							moduleLoadHandler.subscribe( "module-loaded:page", callback );
						},
						function handler( callback ){
							moduleLoadHandler.subscribe( "module-loaded:page-group", callback );
						}
					], handler );
			} );
		} );
} )( base );
