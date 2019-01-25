/**
 * @ngdoc service
 * @name swami.AuthService
 * @description
 * _Please update the description and dependencies._
 *
 * @requires $replace_me
 *
 * */


swami
    .service('Auth', function(){
        var user;

        return{
            setUser : function(aUser){
                user = aUser;
            },
            isLoggedIn : function(){
                return(user)? user : false;
            }
        }
    })