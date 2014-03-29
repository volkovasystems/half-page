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
			"jquery",
			"moduleLoadNotifier"
		],
		function construct( async ){
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
					var halfpageApp = angular.module( "HalfPage", [ ] );
					var appNamespace = appDetermine( "HalfPage" ).name;
					
					safeApplyFactory( appNamespace );
					bindDOMFactory( appNamespace );
					autoResizeDirective( appNamespace );

					var HalfPage = function HalfPage( namespace, pageCount, pageViews ){
						this.namespace = namespace;
						this.pageCount = pageCount;
						this.pageViews = pageViews;
						this.pageList = { };
						this.pageGroupList = { };
					};

					//Constants used in the halfpage.
					//TODO: Make this used a special procedure for making things constant.
					HalfPage.HEADER_PREFIX = "halfpage-header-";
					HalfPage.FOOTER_PREFIX = "halfpage-footer-";
					HalfPage.PAGE_GROUP_PREFIX = "page-group-";
					HalfPage.HEADER_GROUP_PREFIX = HalfPage.HEADER_PREFIX + HalfPage.PAGE_GROUP_PREFIX;
					HalfPage.FOOTER_GROUP_PREFIX = HalfPage.FOOTER_PREFIX + HalfPage.PAGE_GROUP_PREFIX;
					HalfPage.HEADER_GROUP_PATTERN = new RegExp( "^" + HalfPage.HEADER_GROUP_PREFIX );
					HalfPage.FOOTER_GROUP_PATTERN = new RegExp( "^" + HalfPage.FOOTER_GROUP_PREFIX );

					HalfPage.find = function find( query ){

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
						halfpageComponent.data( "halfpage-object", self );
						
						componentObject.append( halfpageComponent );
						this.halfpageComponent = halfpageComponent;

						var self = this;
						halfpageComponent.ready( function onReady( ){
							if( appNamespace == "HalfPage" ){	
								appDetermine.bootstrap( componentObject, appNamespace );
							}
							componentObject.attr( "ng-bound-app", appNamespace );
							componentObject.addClass( "halfpage-attached" );
						} );

						this.cleanContainer( );
					};

					HalfPage.prototype.hasPageGroup = function hasPageGroup( ){
						return !_.isEmpty( this.pageGroupList );
					};

					HalfPage.prototype.ensureHeaderPageGroup = function ensureHeaderPageGroup( namespace, group ){
						namespace = namespace.toLowerCase( );
						var pageGroupGUID = group.GUID;
						var headerPageGroup;
						if( group.getSubPageGroupCount( ) >= 2 ){
							//Check if we already have a header page group
							var pageGroupList = _.keys( group.getSubPageGroupList( ) );
							/*
								We are doing this because page group and halfpage should reduce dependency
									and neither the two should support each other.
								PageGroup will only provide what it can provide and should not
									provide what others need.
							*/
							for( var index = 0; index < pageGroupList.length; index++ ){
								var pageGroupNamespace = pageGroupList[ index ];
								if( HalfPage.HEADER_GROUP_PATTERN.test( pageGroupNamespace ) ){
									headerPageGroup = group.getSubPageGroup( pageGroupNamespace );
								}
							}
							if( headerPageGroup.GUID != pageGroupGUID ){
								headerPageGroup = undefined;
							}
						}
						
						if( !( group.getSubPageGroupCount( ) >= 2 )
							|| !headerPageGroup )
						{
							headerPageGroup = headerPageGroup
								|| group.addSubPageGroup( HalfPage.HEADER_GROUP_PREFIX
									+ namespace, pageGroupGUID );
						}

						if( !headerPageGroup.checkIfAttached( ) ){
							headerPageGroup.attachComponent( this.getHeaderComponent( ) );	
						}

						return headerPageGroup;
					};

					HalfPage.prototype.ensureFooterPageGroup = function ensureFooterPageGroup( namespace, group ){
						namespace = namespace.toLowerCase( );
						var pageGroupGUID = group.GUID;
						var footerPageGroup;
						if( group.getSubPageGroupCount( ) >= 2 ){
							//Check if we already have a footer page group
							var pageGroupList = _.keys( group.getSubPageGroupList( ) );
							/*
								We are doing this because page group and halfpage should reduce dependency
									and neither the two should support each other.
								PageGroup will only provide what it can provide and should not
									provide what others need.
							*/
							for( var index = 0; index < pageGroupList.length; index++ ){
								var pageGroupNamespace = pageGroupList[ index ];
								if( HalfPage.FOOTER_GROUP_PATTERN.test( pageGroupNamespace ) ){
									footerPageGroup = group.getSubPageGroup( pageGroupNamespace );
								}
							}
							if( footerPageGroup.GUID != pageGroupGUID ){
								footerPageGroup = undefined;
							}
						}
						
						if( !( group.getSubPageGroupCount( ) >= 2 )
							|| !footerPageGroup )
						{
							footerPageGroup = footerPageGroup
								|| group.addSubPageGroup( HalfPage.FOOTER_GROUP_PREFIX 
									+ namespace, pageGroupGUID );
						}

						if( !footerPageGroup.checkIfAttached( ) ){
							footerPageGroup.attachComponent( this.getFooterComponent( ) );
						}

						return footerPageGroup;
					};

					HalfPage.prototype.ensurePageGroup = function ensurePageGroup( namespace, group ){
						namespace = namespace.toLowerCase( );

						//As much as possible try to identify if we already have the group.
						if( this.hasPageGroup( ) ){
							if( group === undefined ){
								group = _.last( _.values( this.pageGroupList ) );
							}else if( group instanceof PageGroup
								&& group.GUID in this.pageGroupList )
							{
								group = this.pageGroupList[ group.GUID ];
							}else if( typeof group == "string"
								&& group in this.pageGroupList )
							{
								//The group here is a guid already registered in this halfpage.
								group = this.pageGroupList[ group ];
							}else if( group instanceof PageGroup ){
								this.pageGroupList[ group.GUID ] = group;
							}else{
								group = undefined;
							}
						}

						//If everything fails, create a new group.
						if( !group ){
							var groupNamespace = HalfPage.PAGE_GROUP_PREFIX + namespace;
							group = new PageGroup( groupNamespace );
							group.overrideGUID( chance.guid( ).toLowerCase( ) );
							this.pageGroupList[ group.GUID ] = group;
						}

						if( !group.checkIfAttached( ) ){
							group.attachComponent( this.getBodyComponent( ) );
						}

						return group;
					};

					/*
						When you add a page, it will automatically
							creates a header and footer page for you.

						Basically, if there is no given group, it will
							automatically creates a complete package group.

						When you add a page, always expect that
							there will be a bounded header and footer page.
					*/
					HalfPage.prototype.addPage = function addPage( namespace, view, group ){
						namespace = namespace.toLowerCase( );
						
						if( namespace in this.pageList ){
							throw new Error( "page already registered" );
						}

						group = this.ensurePageGroup( namespace, group );
						var headerPageGroup = this.ensureHeaderPageGroup( namespace, group );
						var footerPageGroup = this.ensureFooterPageGroup( namespace, group );

						var newPage = new Page( namespace, view );
						var headerPage = new Page( HalfPage.HEADER_PREFIX + namespace );
						var footerPage = new Page( HalfPage.FOOTER_PREFIX + namespace );

						newPage.bindPage( headerPage );
						newPage.bindPage( footerPage );

						group.insertPage( page );
						headerPageGroup.insertPage( headerPage );
						footerPageGroup.insertPage( footerPage );

						newPage.setCurrentGroup( group );
						headerPage.setCurrentGroup( headerPageGroup );
						footerPage.setCurrentGroup( footerPageGroup );
						
						this.pageGroupList[ group.namespace ] = group;
						this.pageGroupList[ headerPageGroup.namespace ] = headerPageGroup;
						this.pageGroupList[ footerPageGroup.namespace ] = footerPageGroup;

						this.pageList[ page.namespace ] = newPage;
						this.pageList[ headerPage.namespace ] = headerPage;
						this.pageList[ footerPage.namespace ] = footerPage;
					};

					HalfPage.prototype.checkIfAttached = function checkIfAttached( ){
						return ( "halfpageContainer" in this )
							&& this.halfpageContainer.hasClass( "halfpage-attached" );
					};

					HalfPage.prototype.addPageGroup = function addPageGroup( namespace ){

					};

					HalfPage.prototype.removePage = function removePage( namespace ){

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

					/*
						This is the default layout method for retrieving
							the x distance for the halfpage.

						By attaching a layout calibration this can be changed.
					*/
					HalfPage.prototype.getX = function getX( ){
						return 0;
					};

					/*
						This is the default layout method for retrieving
							the y distance for the halfpage.

						By attaching a layout calibration this can be changed.
					*/
					HalfPage.prototype.getY = function getY( ){
						return 0;
					};

					/*
						The base default z-index for any element is 1. 

						We may be retrieving value as "auto" this is due
							to the fact that the position is not "absolute".

						Though this method will not check it any component
							belonging to the page component concept must be
							configured with "absolute" position.

						The default z-index now is the parent's z-index + 1.

						By attaching a layout calibration this can be changed.
					*/
					HalfPage.prototype.getZIndex = function getZIndex( ){
						var parentElement = this.scope.element.parent( );
						var zIndex = parentElement.css( "z-index" );
						if( zIndex === "auto" ){
							return 1;
						}else if( typeof zIndex == "string" ){
							zIndex = parseInt( zIndex );
						}
						if( isNaN( zIndex ) ){
							throw new Error( "invalid z-index value" );
						}
						return zIndex + 1;
					};

					/*
						This is the default dimension method for retrieving
							the height for the halfpage.

						By attaching a dimension calibration this can be changed.
					*/
					HalfPage.prototype.getHeight = function getHeight( ){
						var parentElement = this.scope.element.parent( );
						return parentElement.height( );
					};

					/*
						This is the default dimension method for retrieving
							the height for the halfpage.

						By attaching a dimension calibration this can be changed.
					*/
					HalfPage.prototype.getWidth = function getWidth( ){
						var parentElement = this.scope.element.parent( );
						return parentElement.width( );
					};

					base.HalfPage = HalfPage;
				}  );
			
			return moduleLoadNotifier( "halfpage-directive",
				"halfpage-header-directive",
				"halfpage-body-directive",
				"halfpage-footer-directive",
				pageModule,
				pageGroupModule );
		} );
} )( base );
