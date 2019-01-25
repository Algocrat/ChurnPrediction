/**
 * @ngdoc controller
 * @name swami.controller:MainCtrl
 *
 * @description
 * _Please update the description and dependencies._
 *
 * @requires $scope
 * */


swami
    .controller('mainCtrl', ['$scope', '$location', 'Auth', function ($scope, $location, Auth) {

        $scope.$watch(Auth.isLoggedIn, function (value, oldValue) {

            if (!value && oldValue) {
                console.log("Disconnect");
                $location.path('/');
            }

            if (value) {
                console.log("Allow Connection");
                //Do something when the user is connected
                $location.path('/data');
            }

        }, true);


    }
   ]);



