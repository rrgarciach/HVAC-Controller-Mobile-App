// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var app = angular.module('starter', ['ionic', 
									 'starter.controllers', 
									 'ionic.utils',
									 'ngCordova.plugins.bluetoothSerial',
									])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

    .state('app.scouts', {
      url: "/scouts",
      views: {
        'menuContent': {
          templateUrl: "templates/scouts.html",
          controller: 'ScoutsCtrl'
        }
      }
    })
  
  .state('app.scout', {
    url: "/scout/:scoutId",
    views: {
      'menuContent': {
        templateUrl: "templates/scout.html",
        controller: 'ScoutCtrl'
      }
    }
  })

  .state('app.groups', {
    url: "/groups",
    views: {
      'menuContent': {
        templateUrl: "templates/groups.html",
        controller: 'GroupsCtrl'
      }
    }
  })

  .state('app.group', {
    url: "/group/:groupId",
    views: {
      'menuContent': {
        templateUrl: "templates/group.html",
        controller: 'GroupCtrl'
      }
    }
  })
  
    .state('app.settings', {
        url: "/settings",
        views: {
          'menuContent': {
            templateUrl: "templates/settings.html"
          }
        }
    })
  
    .state('app.sync', {
        url: "/sync",
        views: {
          'menuContent': {
            templateUrl: "templates/sync.html",
              controller: "SyncCtrl"
          }
        }
    })
  
    .state('app.welcome', {
        url: "/welcome",
        views: {
          'menuContent': {
            templateUrl: "templates/welcome.html",
//              controller: "WelcomeCtrl"
          }
        }
    })
  
    .state('app.connect', {
        url: "/connect",
        views: {
          'menuContent': {
            templateUrl: "templates/connect.html",
              controller: "ConnectCtrl"
          }
        }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/welcome');
})

app.service('scoutService', function() {
    var scouts = [
                    {
                        id:1,
                        groupId:1,
                        password:'1234',
                        automatic:true,
                        name:'Zone A',
                        temperature:24,
                        maxTemperature:24,
                        power:false,
                        quiet:false,
                        delayTime:900,
                    },
                    {
                        id:2,
                        groupId:1,
                        password:'1234',
                        automatic:false,
                        name:'Zone B',
                        temperature:21,
                        maxTemperature:24,
                        power:true,
                        quiet:true,
                        delayTime:900,
                    },
                    ];
    
    var addScout = function(scout) {
        for (var i=0 ; i < scouts.length ; i++) {
            if (scouts[i].id == scout.id) {
                return false;
            }
        }
        scouts.push(scout)
        return true;
    }
    var setScouts = function(scouts) {
        scouts = scouts
    }
    var setScout = function(scout) {
        for (var i=0 ; i < scouts.length ; i++) {
            if (scouts[i].id == scout.id) {
                scouts[i] = scout
                return true
            }
        }
        return false
    }
    var getScouts = function() {
        return scouts
    }
    var getScout = function(id) {
        for (var i=0 ; i < scouts.length ; i++) {
            if (scouts[i].id == id) {
                return scouts[i]
            }
        }
        return false
    }
    return {
        addScout: addScout,
        setScouts: setScouts,
        setScout: setScout,
        getScouts: getScouts,
        getScout: getScout
    };
});

app.service('groupsService', function() {
    var groups = [
                        {
                            id: 1,
                            name: 'Group 1',
                        },
                        {
                            id: 2,
                            name: 'Group 2',
                        },
                        {
                            id: 3,
                            name: 'Group 3',
                        },
                        {
                            id: 4,
                            name: 'Group 4',
                        },
                    ];
    
    var addGroup = function(group) {
        for (var i=0 ; i < groups.length ; i++) {
            if (groups[i].id == group.id) {
                return false;
            }
        }
        groups.push(group)
        return true;
    }
    var setGroups = function(objArray) {
        groups = objArray
    }
    var setGroup = function(group) {
        for (var i=0 ; i < groups.length ; i++) {
            if (groups[i].id == group.id) {
                groups[i] = group
                return true
            }
        }
        return false
    }
    var getGroups = function() {
        return groups
    }
    var getGroup = function(id) {
        for (var i=0 ; i < groups.length ; i++) {
            if (groups[i].id == id) {
                return groups[i]
            }
        }
        return false
    }
    return {
        addGroup: addGroup,
        setGroups: setGroups,
        setGroup: setGroup,
        getGroups: getGroups,
        getGroup: getGroup
    };
});

//app.factory('myService', function() {
// var savedData = {}
// function set(data) {
//   savedData = data;
// }
// function get() {
//  return savedData;
// }
//
// return {
//  set: set,
//  get: get
// }
//
//});