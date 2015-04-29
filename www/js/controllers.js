angular.module('starter.controllers', [])

.controller('AppCtrl', function($rootScope, $scope, $ionicModal, $timeout, $ionicPlatform, $cordovaBluetoothSerial) {
	$ionicPlatform.on('pause', function() {
//		$cordovaBluetoothSerial.clear();
//		console.log("Bluetooth buffer cleared.");
//		var promise = $cordovaBluetoothSerial.disconnect();
//		promise.then(function(){
//			clearInterval($rootScope.getHvacScoutsInterval);
//			console.log("Bluetooth disconnected.");
//		}, function(error) {
//			console.log(error);
//		});
	});
	$ionicPlatform.on('resume', function() {
//		$cordovaBluetoothSerial.clear();
//		console.log("Bluetooth buffer cleared.");
	});
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
    
    $ionicModal.fromTemplateUrl('templates/settings.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.settingsModal = modal;
    });
    $scope.openSettingsModal = function() {
        $scope.settingsModal.show();
    };
    $scope.closeSettingsModal = function() {
        $scope.settingsModal.hide();
    };
})

.controller('WelcomeCtrl', function($scope, $state, $ionicHistory, $localstorage, $cordovaBluetoothSerial, 
$ionicPlatform) {
//	$scope.$on('$ionicView.beforeEnter', function(state) {
	$ionicPlatform.on('deviceready', function() {
		$scope.enableBuetooth = function() {
			var promise = $cordovaBluetoothSerial.isEnabled();
			promise.then(function() {
				$cordovaBluetoothSerial.disconnect();
//				$cordovaBluetoothSerial.clear();
				console.log("Bluetooth is already enabled.");
				$state.go('app.connect');
			}, function() {
				console.log("Bluetooth is not enabled.");
				var promise = $cordovaBluetoothSerial.enable();
				promise.then(function() {
					console.log("Requesting to enable Bluetooth.");
					if (typeof $localstorage.get('deviceId') === 'undefined') {
						$state.go('app.connect');
						$ionicHistory.nextViewOptions({
							disableBack: true,
							historyRoot: true
						});
					} else {
						$state.go('app.sync');
						$ionicHistory.nextViewOptions({
							disableAnimate: true,
							disableBack: true,
							historyRoot: true
						});
					}
				}, function() {
					console.log("Failed to enable Bluetooth.");
				});
			});
		}
		
		$scope.enableBuetooth();
	});
})

.controller('ConnectCtrl', function($scope, $cordovaBluetoothSerial, $localstorage) {
	var promise = $cordovaBluetoothSerial.list();
	promise.then(function(data) {
		$scope.devices = data;
	}, function(error) {
		console.log(error);
	});
	$scope.selectDevice = function(deviceId) {
		$localstorage.set('deviceId',deviceId);
		console.log("Stored Master Device ID is: " + $localstorage.get('deviceId'));
	}
})

.controller('SyncCtrl', function($rootScope, 
								  $scope, 
								  $state, 
								  $ionicHistory, 
								  $cordovaBluetoothSerial, 
								  $localstorage, 
								  ScoutService,
								 GroupsService) {
	$scope.status = "Connecting with Master Device...";
	var deviceId = $localstorage.get('deviceId');
	
	var promise = $cordovaBluetoothSerial.connect(deviceId);
	promise.then(function(){
		$scope.status = "Retrieving data...";
		$scope.getFullState();
//		$scope.getHvacScouts();
//		$scope.getHvacScoutsGroups();
		$rootScope.getgetFullStateInterval = setInterval(function() {
			$scope.getFullState();
		}, 5000);
	}, function(error) {
		console.log(error);
	});
	
	$scope.getHvacScouts = function() {
//		$cordovaBluetoothSerial.write('setNewHvacScout;mi scoutcito,0;');
		console.log('Requesting HVAC Scouts.');
//			$cordovaBluetoothSerial.write('getHvacScouts;');
//		$cordovaBluetoothSerial.clear();
		var promise = $cordovaBluetoothSerial.write('getHvacScouts;');
		promise.then(function(){
			setTimeout(function(){ $scope.onRequestedData() },5000);
		}, function(error) {
			console.log(error);
		});
	};
	
	$scope.getFullState = function() {
		console.log('Requesting Full State.');
		var promise = $cordovaBluetoothSerial.write('getFullState;');
		promise.then(function(){
			setTimeout(function(){ $scope.onRequestedData() },5000);
		}, function(error) {
			console.log(error);
		});
	};
	
	$scope.onRequestedData = function() {
		$scope.status = "Syncing...";
//		var promise = $cordovaBluetoothSerial.subscribe('\n');
//		var promise = $cordovaBluetoothSerial.readUntil('\n');
//		var promise = $cordovaBluetoothSerial.subscribeRawData();
		var promise = $cordovaBluetoothSerial.read();
		promise.then(function(data){
//			console.log('Reading for data.');
			console.log('Received data: ' + data);
			$scope.onData(data);
		}, function(error) {
			console.log(error);
		});
	}
	$scope.onData = function(data) {
		var index = data.indexOf('\r');
		// Remove repeated JSON strings:
		if (index < 0) {
			result = data;
		} else {
			console.log('Repeated JSON; substring removed.');
			result = data.substr(0, index);
		}
		// Check if string is correct:
		if (result.length == 0) {
			console.log('Empty string received.');
//		} else if ( result.charAt(0) !== '{' || result.charAt(result.length-2) !== '}' ) {
//			console.log('JSON string object wrong format.');
		} else {
			var object = JSON.parse(result);
			var scouts = object.scouts;
			console.log('JSON string parsed into Scouts object.');
			ScoutService.setScouts(scouts);
//			console.log('Scouts set: ' + angular.toJson(ScoutService.getScouts()) );

			var groups = object.groups;
			console.log('JSON string parsed into Groups object.');
			GroupsService.setGroups(groups);

			$scope.status = "Done.";
			$state.go('app.scouts');
			$ionicHistory.nextViewOptions({
							disableBack: true,
							historyRoot: true
						});
		}
	}
})

.controller('ScoutsCtrl', function($scope, ScoutService, GroupsService, $cordovaBluetoothSerial) {
	$scope.averageTemperature = 0;
    $scope.scouts = ScoutService.getScouts();
	$scope.scoutsCtrlInterval = setInterval(function() {
		$scope.scouts = ScoutService.getScouts();
		console.log('RECEIVED ' + $scope.scouts.length + ' SCOUTS.');
		console.log('Scouts: ' + angular.toJson($scope.scouts) );
		$scope.averageTemperature = 0;
		angular.forEach($scope.scouts, function(value, key) {
			$scope.averageTemperature += value.temperature;
		});
		$scope.averageTemperature /= $scope.scouts.length;
	}, 1000);
//	$cordovaBluetoothSerial.write('setValueForScoutFromHS;0,changeDelayTime;5;');
	$cordovaBluetoothSerial.write('setValScoutFHS;0,changeDelayTime;900;');
    $scope.groups = GroupsService.getGroups();
})

.controller('ScoutCtrl', function($scope, $stateParams, ScoutService, GroupsService) {
    var scoutId = angular.fromJson($stateParams.scoutId);
    $scope.scout = angular.fromJson(ScoutService.getScout(scoutId));
//    $scope.scout = scoutService.getScout($stateParams.scoutId);
    $scope.groups = GroupsService.getGroups();
    $scope.group = GroupsService.getGroup($scope.scout.groupId);
})

.controller('GroupsCtrl', function($scope, GroupsService) {
    $scope.groups = GroupsService.getGroups();
})

.controller('GroupCtrl', function($scope, $stateParams, GroupsService, $ionicModal) {
    $scope.group = GroupsService.getGroup($stateParams.groupId);
    
    $ionicModal.fromTemplateUrl('templates/group-name-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.groupNameModal = modal;
    });
    $scope.openGroupNameModal = function() {
        $scope.form = {name: $scope.group.name}
        $scope.groupNameModal.show();
    };
    $scope.closeGroupNameModal = function() {
        $scope.groupNameModal.hide();
    };
    $scope.saveGroup = function() {
        $scope.group.name = $scope.form.name;
        GroupsService.setGroup($scope.group);
        $scope.closeGroupNameModal();
    };
})

angular.module('ionic.utils', [])

.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}]);
