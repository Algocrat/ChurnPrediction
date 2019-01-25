/**
 * Created by algocrat on 12/15/14.
 */
swami.service('fileUpload', [ '$q', '$timeout', '$http', function ( $q, $timeout, $http) {
    this.uploadFileToUrl = function(file, uploadUrl, uID){
        //var deferred = $q.defer();
        try {
            var fd = new FormData();
            fd.append('picture', file);
            fd.append('uid',uID);
            $http.post(uploadUrl, fd,{
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined, 'enctype': 'multipart/form-data', 'name': 'picture'}
            })
                .success(function(data, status, headers, config) {
                    $scope.hello = data;
                })
                .error(function(data, status, headers, config) {
                });
        }catch(e){
            deferred.reject(e);
        }

        return deferred.promise;
    }
}]);