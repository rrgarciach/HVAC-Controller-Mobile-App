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
})

.controller('MainScreenCtrl', function($scope,$ionicModal) {
    $scope.scouts = [
                    {
                        id:1,
                        name:'Zone A',
                        temperature:24,
                        power:false,
                        quiet:false,
                        delayTime:900,
                    },
                    {
                        id:2,
                        name:'Zone A',
                        temperature:24,
                        power:false,
                        quiet:false,
                        delayTime:900,
                    },
                    ]
    
    $ionicModal.fromTemplateUrl('templates/scoutModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.scoutModal = modal;
    });
    $scope.openScoutModal = function(modal) {
        $scope.scoutModal.show();
    };
    $scope.closeScoutModal = function() {
        $scope.scoutModal.hide();
    };
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
