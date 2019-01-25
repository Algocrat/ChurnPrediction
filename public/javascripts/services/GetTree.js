/**
 * Created by algocrat on 12/16/14.
 */
swami.service('getTree', [ '$q', '$timeout', '$http', function ( $q, $timeout, $http) {
    this.getTreeFromUrl = function(uploadUrl,fileNameVal, renamedString, excludeString, predictString){
        var deferred = $q.defer();
        try {
            $http.get(uploadUrl, {
                params: {
                    fileName: fileNameVal,
                    renamed: renamedString,
                    exclude: excludeString,
                    predict: predictString
                    }
                })
                .success(function(data, status, headers, config) {
                    deferred.resolve(data);
                    console.log('status: ', status, ' data: ', data);

                })
                .error(function(data, status, headers, config) {
                    deferred.reject(status);
                    console.log('status: ', status);
                });
        }catch(e){
            deferred.reject(e);
        }

        return deferred.promise;
    }
}]);