/**
 * Created by algocrat on 12/15/14.
 */
swami.controller('dataCtrl', ['$rootScope','$scope', '$http', 'fileUpload', 'fields',  '$location', 'ngProgress', function($rootScope,$scope, $http,fileUpload,fields,$location,  ngProgress){

    $rootScope.alert = {};
    $scope.triggerFileReader = function(){
        $('#filereader').trigger('click');
    };

    $('#filereader').change(function(e) {
        $scope.file = e.target.files[0];
    });

    $scope.showContent = function(){
        var file = $scope.file;
        console.log('file is ' + JSON.stringify(file.name));
        var uploadUrl = "/upload";
        var uID = "23";
        ngProgress.color('#718792');
        ngProgress.start();
        var fd = new FormData();
        fd.append('picture', file);
        fd.append('uid',uID);

        // Simple POST request example (passing data) :
        $http.defaults.useXDomain = true;
        $http.post(uploadUrl, fd,{
        transformRequest: angular.identity,
            headers: {'Content-Type': undefined, 'enctype': 'multipart/form-data', 'name': 'picture'}
        }).
            success(function(data, status, headers, config) {
                /*called for result & error because 200 status*/
                console.log('Result is ' + JSON.stringify(data));
                if (data){
                    ngProgress.complete();
                    $location.url('/process');
                    fields.setFieldNames(data.split(','));
                    fields.setFileName(file.name);
                } else if (data.error) {
                    //handle error here
                }
            }).
            error(function(data, status, headers, config) {
                ngProgress.reset();
                $rootScope.alert.class = 'danger';
                $rootScope.alert.message = 'Cannot upload file, please try again.';
            });

        /*
        fileUpload.uploadFileToUrl(file, uploadUrl, uID).then(function(result){
            ngProgress.complete();
            $location.url('/process');
        }, function(error){
            // exceptions in transformData, or saveToIndexDB
            // will result in this error callback being called.
            ngProgress.reset();
            $rootScope.alert.class = 'danger';
            $rootScope.alert.message = 'Cannot upload file, please try again.';
        });
        */
    };

    $scope.openfileDialog = function() {
        $("#fileLoader").click();
    };

}]);

