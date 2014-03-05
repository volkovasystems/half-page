define( "halfpageController",
	[
		"angular",
		"appDetermine"
	],
	function construct( ){
		appDetermine( "HalfPage" )
			.controller( "halfpageController",
				[
					"$timeout",
					"$scope",
					function controller( $timeout, $scope ){
						$timeout( function onRender( ){
							if( $scope.keyEventsHandled ){
								return;
							}
							$scope.keyEventsHandled = true;

							/*
								Note on the following key command.

								[Left] - Go to the next page from right
								[Right] - Go to the next page from left.
								[Ctrl] + [Up] - Opens the menu.
								[Ctrl] + [Down] - Opens the control center.
							*/
							amplify.subscribe( "on-keypress:" + $scope.referenceID,
								function onKeyPress( event ){
									console.debug( "keypress: ", event );
								} );

							amplify.subscribe( "on-keydown:" + $scope.referenceID,
								function onKeyDown( event ){
									console.debug( "keydown: ", event );
								} );

							amplify.subscribe( "on-keyup:" + $scope.referenceID,
								function onKeyUp( event ){
									console.debug( "keyup: ", event );
								} );
						}, 0 );
					}
				] );
	} );