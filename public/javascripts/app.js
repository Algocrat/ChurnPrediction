var swami = angular.module('swami', ['ngRoute', 'ui.bootstrap', 'firebase', 'ngProgress', 'ngAnimate', 'ui.grid', 'ui.grid.edit']);

swami.config(['$routeProvider',function($routeProvider) {
$routeProvider
    .when('/', {
            controller: 'authCtrl',
            templateUrl: '/assets/partials/login.html'
          })
    .when('/data', {
            controller: 'dataCtrl',
            templateUrl: '/assets/partials/data.html'
          })
    .when('/process', {
            controller: 'processCtrl',
            templateUrl: '/assets/partials/process.html'
          })
    .when('/plot', {
        controller: 'plotCtrl',
        templateUrl: '/assets/partials/plot.html'
    })
    .otherwise({
            redirectTo: '/'
          });
}]);


var appNav = angular.module('appNav', ['$rootScope','$location', 'Auth'])
    .run(function ($scope, $rootScope, $location, Auth) {
      $rootScope.$on('$locationChangeStart', function (event, next, current) {
        console.log("location changing from:"+current +" to:" + next);
        Auth;
        if (!Auth.isLoggedIn()) {
          console.log('DENY');
          event.preventDefault();
          $location.path('/');
        }
        else {
          console.log('ALLOW');
          $location.path('/data');
        }
      })
    });

