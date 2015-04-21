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

.controller('ScoutsCtrl', function($scope, scoutService, groupsService) {
    $scope.scouts = scoutService.getScouts()
    $scope.groups = groupsService.getGroups()
})

.controller('ScoutCtrl', function($scope, $stateParams, scoutService, groupsService) {
//    $scope.scout = angular.fromJson($stateParams.scout)
    $scope.scout = scoutService.getScout($stateParams.scoutId)
    $scope.group = groupsService.getGroup($scope.scout.groupId)
})

.controller('GroupsCtrl', function($scope, groupsService) {
    $scope.groups = groupsService.getGroups()
})

.controller('GroupCtrl', function($scope, $stateParams, groupsService, $ionicModal) {
    $scope.group = groupsService.getGroup($stateParams.groupId)
    
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
        $scope.group.name = $scope.form.name
        groupsService.setGroup($scope.group)
        $scope.closeGroupNameModal()
    };
})
