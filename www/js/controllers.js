angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
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

.controller('ConnectCtrl', function($scope, $cordovaBluetoothSerial, $localstorage) {
	var promise = $cordovaBluetoothSerial.list();
	promise.then(function(data){
		$scope.devices = data;
	}, function(error) {
		console.log(error);
	});
	$scope.selectDevice = function(deviceId) {
		$localstorage.set('deviceId',deviceId);
		console.log($localstorage.get('deviceId'));
	}
})

.controller('SyncCtrl', function($scope, $state, $cordovaBluetoothSerial, $localstorage) {
	$scope.status = "Connecting with Master Device...";
	var deviceId = $localstorage.get('deviceId');
	var promise = $cordovaBluetoothSerial.connect(deviceId);
	promise.then(function(){
		$scope.status = "Retrieving data...";
		$scope.getHvacScouts();
	}, function(error) {
		console.log(error);
	});
	
	$scope.onConnect = function() {
		$scope.status = "Syncing...";
//		var p = $cordovaBluetoothSerial.subscribe("\n");
		var p = $cordovaBluetoothSerial.read();
//		var p = $cordovaBluetoothSerial.subscribeRawData();
		p.then(function(data){
			console.log('reading');
			$scope.onData(data);
		}, function(error) {
			console.log(error);
		});
	}
	$scope.onData = function(data) {
		console.log('Received data: ' + data);
		$scope.scouts = angular.fromJson(data);
		console.log('parsed');
		$localstorage.setObject('scouts',$scope.scouts);
		$scope.status = "Done.";
		setTimeout(function(){ $state.go('app.scouts') },1500);
	}
	$scope.getHvacScouts = function() {
//		$cordovaBluetoothSerial.write('setNewHvacScout;mi scoutcito,0;');
		setInterval(function() {
			$cordovaBluetoothSerial.write('getHvacScouts;');
			console.log('running getHvacScouts');
			console.log('scouts: ' + angular.fromJson($scope.scouts));
		}, 5000);
		var wPromise = $cordovaBluetoothSerial.write('getHvacScouts;');
		wPromise.then(function(){
			setTimeout(function(){$scope.onConnect()},5000);
			console.log('OK');
		}, function(error) {
			console.log(error);
		});
	}
})

.controller('ScoutsCtrl', function($scope, $localstorage, groupsService) {
//    $scope.scouts = scoutService.getScouts()
    $scope.scouts = $localstorage.getObject('scouts');
	console.log('scouts: ' + $scope.scouts);
    $scope.groups = groupsService.getGroups();
})

.controller('ScoutCtrl', function($scope, $stateParams, scoutService, groupsService) {
//    $scope.scout = angular.fromJson($stateParams.scout)
    $scope.scout = scoutService.getScout($stateParams.scoutId);
    $scope.groups = groupsService.getGroups();
    $scope.group = groupsService.getGroup($scope.scout.groupId);
})

.controller('GroupsCtrl', function($scope, groupsService) {
    $scope.groups = groupsService.getGroups();
})

.controller('GroupCtrl', function($scope, $stateParams, groupsService, $ionicModal) {
    $scope.group = groupsService.getGroup($stateParams.groupId);
    
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
        groupsService.setGroup($scope.group);
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
