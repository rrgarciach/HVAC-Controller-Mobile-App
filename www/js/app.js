// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

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

//  .state('app.single', {
//    url: "/playlists/:playlistId",
//    views: {
//      'menuContent': {
//        templateUrl: "templates/playlist.html",
//        controller: 'PlaylistCtrl'
//      }
//    }
//  })
  .state('app.scout', {
    url: "/scout/:scoutId",
    views: {
      'menuContent': {
        templateUrl: "templates/scout.html",
        controller: 'ScoutCtrl'
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

    .state('app.scouts', {
      url: "/scouts",
      views: {
        'menuContent': {
          templateUrl: "templates/scouts.html",
          controller: 'ScoutsCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/scouts');
})

.service('scoutService', function() {
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