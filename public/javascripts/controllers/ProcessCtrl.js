/**
 * Created by algocrat on 12/15/14.
 */
swami.controller('processCtrl',  ['$rootScope','$scope', 'getTree', 'fields', 'flattoPC', 'plotData', '$location', 'ngProgress', '$http', function($rootScope,$scope, getTree, fields, flattoPC, plotData, $location,  ngProgress, $http){

    $scope.output = {};
    $scope.refinedOutput = {};
    $scope.processData = function(){
        ngProgress.color('#718792');
        ngProgress.start();
        var getTreeUrl = "/treeGenerator";
        //var fileNameVal = "Members.csv";
        var fileNameVal = fields.getFileName();
        var renamedString = "";
        var predictString = $scope.getPredict();
        var excludeString = "drops <- c("+$scope.getExlude()+")";
        getTree.getTreeFromUrl(getTreeUrl,fileNameVal, renamedString, excludeString, predictString).then(function(result){
            $scope.output =  result;
            //console.log($scope.output);
        }, function(error){
            // exceptions in transformData, or saveToIndexDB
            // will result in this error callback being called.
            ngProgress.reset();
            $rootScope.alert.class = 'danger';
            $rootScope.alert.message = 'Cannot process model, please try again.';
        }).then(function(){
            plotData.pdata =  flattoPC.getParentChildHierarchy($scope.output);
            //plotData.pdata = flattoPC.getParentChildHierarchy(JSON.parse('[[{"id":"1","name":"All","parentid":"-","distribution":[{"No":"807615","Yes":"130332","Total":"937947"}]}],[{"id":"11","name":"YearlyIncome > 180000","parentid":"1","distribution":[{"No":"36500","Yes":"37053","Total":"73554"}]}],[{"id":"111","name":"NumberofCars > 3","parentid":"11","distribution":[{"No":"3134","Yes":"23596","Total":"26730"}]}],[{"id":"1111","name":"EyeColor in [{Black,Grey}]}]","parentid":"111","distribution":[{"No":"737","Yes":"20094","Total":"20831"}]}],[{"id":"1112","name":"EyeColor in [{Blue,Brown,Hazel}]}]","parentid":"111","distribution":[{"No":"2396","Yes":"3503","Total":"5899"}]}],[{"id":"11121","name":"NumberofKids = 0","parentid":"1112","distribution":[{"No":"184","Yes":"2950","Total":"3134"}]}],[{"id":"11122","name":"NumberofKids > 0","parentid":"1112","distribution":[{"No":"2212","Yes":"553","Total":"2765"}]}],[{"id":"112","name":"NumberofCars <= 3","parentid":"11","distribution":[{"No":"33366","Yes":"13457","Total":"46824"}]}],[{"id":"1121","name":"Education in [{Graduate Degree,Bachelors}]}]","parentid":"112","distribution":[{"No":"31339","Yes":"10876","Total":"42215"}]}],[{"id":"11211","name":"Ethinicity in [{Asian,East Indian,Hispanic,Other,Pacific Islander}]}]","parentid":"1121","distribution":[{"No":"29864","Yes":"8296","Total":"38159"}]}],[{"id":"112111","name":"Religion not in in [{Catholic Christian,Hindu,Jewish,Other}]}]","parentid":"11211","distribution":[{"No":"26730","Yes":"4609","Total":"31339"}]}],[{"id":"112112","name":"Religion in [{Catholic Christian,Hindu,Jewish,Other}]}]","parentid":"11211","distribution":[{"No":"3134","Yes":"3687","Total":"6821"}]}],[{"id":"1121121","name":"Exercise = Everyday","parentid":"112112","distribution":[{"No":"184","Yes":"2765","Total":"2950"}]}],[{"id":"1121122","name":"Exercise <> Everyday","parentid":"112112","distribution":[{"No":"2950","Yes":"922","Total":"3871"}]}],[{"id":"11212","name":"Ethinicity not in [{Asian,East Indian,Hispanic,Other,Pacific Islander}]}]","parentid":"1121","distribution":[{"No":"1475","Yes":"2581","Total":"4056"}]}],[{"id":"112121","name":"EyeColor in [{Black,Blue,Green,Hazel}]}]","parentid":"11212","distribution":[{"No":"922","Yes":"0","Total":"922"}]}],[{"id":"112122","name":"EyeColor not in  in [{Black,Blue,Green,Hazel}]}]","parentid":"11212","distribution":[{"No":"553","Yes":"2581","Total":"3134"}]}],[{"id":"1121221","name":"Smoker in [{ Yes, Ocassionally}]}]","parentid":"112122","distribution":[{"No":"553","Yes":"184","Total":"737"}]}],[{"id":"1121222","name":"Smoker not in [{ Yes, Occasionally}]}]","parentid":"112122","distribution":[{"No":"0","Yes":"2396","Total":"2396"}]}],[{"id":"1122","name":"Education not in [{Graduate Degree,Bachelors}]}]","parentid":"112","distribution":[{"No":"2028","Yes":"2581","Total":"4609"}]}],[{"id":"11221","name":"YearlyIncome > 130000","parentid":"1122","distribution":[{"No":"0","Yes":"1106","Total":"1106"}]}],[{"id":"11222","name":"YearlyIncome <= 130000","parentid":"1122","distribution":[{"No":"2028","Yes":"1475","Total":"3503"}]}],[{"id":"112221","name":"Region in [{MidWest,NorthEast,NorthWest}]}]","parentid":"11222","distribution":[{"No":"0","Yes":"922","Total":"922"}]}],[{"id":"112222","name":"Region not in [{MidWest,NorthEast,NorthWest}]}]","parentid":"11222","distribution":[{"No":"2028","Yes":"553","Total":"2581"}]}],[{"id":"1122221","name":"HouseOwner = Yes","parentid":"112222","distribution":[{"No":"2028","Yes":"184","Total":"2212"}]}],[{"id":"1122222","name":"HouseOwner = No","parentid":"112222","distribution":[{"No":"0","Yes":"369","Total":"369"}]}],[{"id":"12","name":"YearlyIncome <= 180000","parentid":"1","distribution":[{"No":"754893","Yes":"93279","Total":"848171"}]}],[{"id":"121","name":"NumberofKids > 3","parentid":"12","distribution":[{"No":"703461","Yes":"49957","Total":"753418"}]}],[{"id":"1211","name":"HouseOwner = Yes","parentid":"121","distribution":[{"No":"43137","Yes":"24334","Total":"67470"}]}],[{"id":"12111","name":"RelationshipStatus in [{Divorced,Married,Separated,Widow/Widower}]}]","parentid":"1211","distribution":[{"No":"0","Yes":"12535","Total":"12535"}]}],[{"id":"12112","name":"RelationshipStatus = Never Married","parentid":"1211","distribution":[{"No":"43137","Yes":"11798","Total":"54935"}]}],[{"id":"121121","name":"Gender = F","parentid":"12112","distribution":[{"No":"43137","Yes":"922","Total":"44058"}]}],[{"id":"121122","name":"Gender = M","parentid":"12112","distribution":[{"No":"0","Yes":"10876","Total":"10876"}]}],[{"id":"1212","name":"HouseOwner = No","parentid":"121","distribution":[{"No":"660324","Yes":"25624","Total":"685948"}]}],[{"id":"12121","name":"HairColor in [{Auburn Red,Black}]}]","parentid":"1212","distribution":[{"No":"590273","Yes":"15854","Total":"606126"}]}],[{"id":"12122","name":"HairColor in [{Blond,DarkBlond,Silver}]}]","parentid":"1212","distribution":[{"No":"70051","Yes":"9770","Total":"79821"}]}],[{"id":"121221","name":"BodyType in [{Athletic,AverageCurvy}]}]","parentid":"12122","distribution":[{"No":"68023","Yes":"4056","Total":"72079"}]}],[{"id":"121222","name":"BodyType not  in [{Athletic,AverageCurvy}]}]","parentid":"12122","distribution":[{"No":"2028","Yes":"5715","Total":"7742"}]}],[{"id":"1212221","name":"SearchDistance < = 8","parentid":"121222","distribution":[{"No":"553","Yes":"5715","Total":"6268"}]}],[{"id":"1212222","name":"SearchDistance > 8","parentid":"121222","distribution":[{"No":"1475","Yes":"0","Total":"1475"}]}],[{"id":"122","name":"NumberofKids <= 3","parentid":"12","distribution":[{"No":"51432","Yes":"43321","Total":"94753"}]}],[{"id":"1221","name":"Age > 42","parentid":"122","distribution":[{"No":"20831","Yes":"1475","Total":"22306"}]}],[{"id":"1222","name":"Age <= 42","parentid":"122","distribution":[{"No":"30601","Yes":"41846","Total":"72448"}]}],[{"id":"12221","name":"HairColor in [{Auburn Red,Dark Brown,Light Brown}]}]","parentid":"1222","distribution":[{"No":"24702","Yes":"11614","Total":"36316"}]}],[{"id":"122211","name":"Age <= 33","parentid":"12221","distribution":[{"No":"21753","Yes":"3687","Total":"25440"}]}],[{"id":"1222111","name":"Membership Length <= 9","parentid":"122211","distribution":[{"No":"19725","Yes":"2028","Total":"21753"}]}],[{"id":"1222112","name":"Membership Length > 9","parentid":"122211","distribution":[{"No":"2028","Yes":"1659","Total":"3687"}]}],[{"id":"12221121","name":"HouseOwner = Yes","parentid":"1222112","distribution":[{"No":"0","Yes":"1106","Total":"1106"}]}],[{"id":"12221122","name":"HouseOwner = No","parentid":"1222112","distribution":[{"No":"2028","Yes":"553","Total":"2581"}]}],[{"id":"122212","name":"Age > 33","parentid":"12221","distribution":[{"No":"2950","Yes":"7927","Total":"10876"}]}],[{"id":"1222121","name":"NumberofCars = 0","parentid":"122212","distribution":[{"No":"0","Yes":"4977","Total":"4977"}]}],[{"id":"1222122","name":"NumberofCars > 0","parentid":"122212","distribution":[{"No":"2950","Yes":"2950","Total":"5899"}]}],[{"id":"12221221","name":"Education in [{Graduate Degree,Bachelors}]}]","parentid":"1222122","distribution":[{"No":"2396","Yes":"0","Total":"2396"}]}],[{"id":"12221222","name":"Education not in [{Graduate Degree,Bachelors}]}]","parentid":"1222122","distribution":[{"No":"553","Yes":"2950","Total":"3503"}]}],[{"id":"122212221","name":"NumberofKids = 0","parentid":"12221222","distribution":[{"No":"369","Yes":"0","Total":"369"}]}],[{"id":"122212222","name":"NumberofKids > 0","parentid":"12221222","distribution":[{"No":"184","Yes":"2950","Total":"3134"}]}],[{"id":"12222","name":"HairColor not in [{Auburn Red,Dark Brown,Light Brown}]}]","parentid":"1222","distribution":[{"No":"5899","Yes":"30233","Total":"36132"}]}],[{"id":"122221","name":"PoliticalBelief = Conservative","parentid":"12222","distribution":[{"No":"553","Yes":"20462","Total":"21015"}]}],[{"id":"122222","name":"PoliticalBelief <> Conservative","parentid":"12222","distribution":[{"No":"5346","Yes":"9770","Total":"15116"}]}],[{"id":"1222221","name":"EyeColor in [{Black,Grey}]}]","parentid":"122222","distribution":[{"No":"4609","Yes":"2396","Total":"7005"}]}],[{"id":"12222211","name":"Ethinicity in [{Asian,East Indian,Hispanic,Other,Pacific Islander}]}]","parentid":"1222221","distribution":[{"No":"3503","Yes":"184","Total":"3687"}]}],[{"id":"12222212","name":"Ethinicity not in [{Asian,East Indian,Hispanic,Other,Pacific Islander}]}]","parentid":"1222221","distribution":[{"No":"1106","Yes":"2212","Total":"3318"}]}],[{"id":"1222222","name":"EyeColor in [{Blue,Brown,Hazel}]}]","parentid":"122222","distribution":[{"No":"737","Yes":"7374","Total":"8111"}]}],[{"id":"12222221","name":"Gender = F","parentid":"1222222","distribution":[{"No":"0","Yes":"6636","Total":"6636"}]}],[{"id":"12222222","name":"Gender = M","parentid":"1222222","distribution":[{"No":"737","Yes":"737","Total":"1475"}]}],[{"id":"122222221","name":"BodyType in [{Athletic,AverageCurvy}]}]","parentid":"12222222","distribution":[{"No":"737","Yes":"0","Total":"737"}]}],[{"id":"122222222","name":"BodyType not  in [{Athletic,AverageCurvy}]}]","parentid":"12222222","distribution":[{"No":"0","Yes":"737","Total":"737"}]}]]'));
            //console.log(plotData.pdata);
            ngProgress.complete();
            $location.url('/plot');
        }, function(error){
            // exceptions in transformData, or saveToIndexDB
            // will result in this error callback being called.
            ngProgress.reset();
            $rootScope.alert.class = 'danger';
            $rootScope.alert.message = 'Cannot process model, please try again.';
        });
    };

    $scope.usageTypes = [{
        ID: 1,
        type: 'Input'
    }, {
        ID: 2,
        type: 'Predict'
    }, {
        ID: 3,
        type: 'Exclude'
    }];


    $scope.gridOptions = {
        enableSorting: true,
        enableCellEditOnFocus: true,
        columnDefs: [{
            field: 'feature'
        }, {
            field: 'usage',
            editType: 'dropdown',
            enableCellEdit: true,
            editableCellTemplate: 'ui-grid/dropdownEditor',
            editDropdownOptionsArray: $scope.usageTypes,
            editDropdownIdLabel: 'type',
            editDropdownValueLabel: 'type'
        }],data : fields.getFieldNames(),
        onRegisterApi: function(gridApi) {
            grid = gridApi.grid;
        }
    };


    $scope.getPredict = function() {
        var predict = ' ';
        angular.forEach($scope.gridOptions.data, function(col) {
            if (col.usage == 'Predict') {
                predict += '"'+col.feature+'",';
            }
        });
        return predict.substring(0, predict.length - 1);
    };


    $scope.getExlude = function() {
        var exclude = ' ';
        angular.forEach($scope.gridOptions.data, function(col) {
            if ((col.usage == 'Exclude')||(col.usage == 'Predict')) {
                exclude += '"'+col.feature+'",';
            }
        });
        return exclude.substring(0, exclude.length - 1);
    };

}]);

