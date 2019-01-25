/**
 * Created by algocrat on 5/10/15.
 *

 function mySandwich(param1, param2, callback) {
    alert('Started eating my sandwich.\n\nIt has: ' + param1 + ', ' + param2);
    callback();
    }

 mySandwich('ham', 'cheese', function() {
    alert('Finished eating my sandwich.');
    });

 */
swami
    .service('fields', function(){
        this.names = [];
        this.fileName = '';

        this.setFieldNames = function(fieldNames) {
            this.names = [];
            for(var i = 0; i < fieldNames.length-1; i++) {
                this.names.push({feature: fieldNames[i], usage: 'Input'});
            };
            this.names.push({feature: fieldNames[fieldNames.length-1], usage: 'Predict'});
        };

        this.getFieldNames = function() {
            return this.names;
        };

        this.setFileName = function(fileName) {
            this.fileName = fileName;
        };

        this.getFileName= function() {
            return this.fileName;
        };


    })