
swami.controller('authCtrl', [
    '$scope', '$rootScope', '$firebaseAuth','$location', 'Auth', 'ngProgress', function($scope, $rootScope, $firebaseAuth, $location, Auth, ngProgress) {
        var ref = new Firebase('https//amber-fire-4769.firebaseapp.com/');
        $scope.email = 'tejas-patel@hotmail.com';
        $scope.password = 'Nasik11';
        $rootScope.auth = $firebaseAuth(ref);
        $rootScope.alert = {};

        $scope.signIn = function () {
            ngProgress.color('#718792');
            ngProgress.start();

            //Auth.setUser(user);
            ngProgress.complete();
            $location.url('/data');
         /*
            $rootScope.auth.$login('password', {
                email: $scope.email,
                password: $scope.password
            }).then(function(user) {
                //alert(user.id);
                //alert(user.firebaseAuthToken);
                //ngProgress.start();
                Auth.setUser(user);
                ngProgress.complete();
                $location.url('/data');
            }, function(error) {
                ngProgress.reset();
                if (error = 'INVALID_EMAIL') {
                    console.log('email invalid or not signed up — trying to sign you up!');
                    $scope.signUp();
                } else if (error = 'INVALID_PASSWORD') {
                    console.log('wrong password!');
                } else {
                    console.log(error);
                }
            });*/
        }

        $scope.signUp = function() {
            $rootScope.auth.$createUser($scope.email, $scope.password, function(error, user) {
                if (!error) {
                    $rootScope.alert.message = '';
                } else {
                    $rootScope.alert.class = 'danger';
                    $rootScope.alert.message = 'The username and password combination you entered is invalid.';
                }
            });
        }


        $scope.signOut = function () {
            ref.unauth();
        };
    }
]);

swami.controller('AlertCtrl', [
    '$scope', '$rootScope', function($scope, $rootScope) {
        $rootScope.alert = {};
    }
]);


/*

swami.run( ['$location', 'Auth', '$rootScope',
    function($scope, $location, $rootScope,Auth) {
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
    }]);

*/