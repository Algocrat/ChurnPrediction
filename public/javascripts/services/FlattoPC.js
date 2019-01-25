/**
 * Created by algocrat on 2/9/15.
 */




swami.service('flattoPC', function(){
            this.getParentChildHierarchy = function(flatHierarchy){
                var refinedData = flatHierarchy.map(
                    function(d) {
                        return {
                            id: d[0].id,
                            parentid: d[0].parentid,
                            name: d[0].name,
                            distribution:d[0].distribution
                        };
                    }
                );

                function getChildren(id) {
                    return refinedData.filter(
                        function(d) {
                            return d.parentid === id;
                        }
                    ) .map(
                        function(d) {
                            return {
                                id: d.id,
                                name: d.name,
                                distribution: d.distribution,
                                children: getChildren(d.id)
                            };
                        }
                    );
                };

                return getChildren('-')[0];
            }
        });