/**
 * Created by algocrat on 2/9/15.
 */
swami.directive('plotter', function () {


        return {
            restrict: 'E',
            replace: false,
            link: function (scope, element, attrs) {

                scope.$watch('plotterData', function (newVal, oldVal) {

                    // clear the elements inside of the directive
                    //vis.selectAll('svg').remove();

                    // if 'val' is undefined, exit
                    if (!newVal) {
                        return;
                    }
                    //var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)*.75;
                    //var height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)*.75;


                    var width = $("svg").parent().width();
                    var height = $("svg").parent().width();

                    var  /*width = 1800,
                     height = 1200,*/
                        root;
                    var padding = 20;
                    var density = 50;

                    var force = d3.layout.force()
                        .linkDistance(60)
                        .charge(-120)
                        .gravity(.05)
                        .size([width, height])
                        .on("tick", tick);

                    var svg = d3.select("#chart").append("svg")
                        .attr("width", width)
                        .attr("height", height)
                        .attr("viewBox","-300,-200,600,400");


                    /*
                     .call(zoom.on("zoom",zooming))
                     .append("svg:g")
                     .attr("transform","translate(100,50)scale(.5,.5)");

                     var zoom = d3.behavior.zoom()
                     .translate(projection.translate())
                     .scale(projection.scale())
                     .scaleExtent([height, 8 * height])
                     .on("zoom", move);*/

                    var link = svg.selectAll(".link"),
                        node = svg.selectAll(".node");

                    function moveChildren(node) {
                        if(node.children) {
                            node.children.forEach(function(c) { moveChildren(c); });
                            node._children = node.children;
                            node.children = null;
                        }
                    }

                    var temp = {};
                    d3.json(temp, function(error, json) {
                        root = scope.plotterData;
                        update();

                        function toggleAll(d) {
                            if (d.children) {
                                d.children.forEach(toggleAll);
                                toggle(d);
                            }
                        }
                        // Initialize the display to show a few nodes.
                        root.children.forEach(toggleAll);


                        update(root);
                    });


                    function update() {
                        var nodes = flatten(root),
                            links = d3.layout.tree().links(nodes);

                        // Restart the force layout.
                        force
                            .nodes(nodes)
                            .links(links)
                            .start();

                        // Update links.
                        link = link.data(links, function(d) { return d.target.id; });

                        link.exit().remove();

                        link.enter().insert("line", ".node")
                            .attr("class", "link");

                        /*
                         link.enter().insert("line", ".node")
                         .attr("class", "link");
                         */

                        // Update nodes.
                        node = node.data(nodes, function(d) { return d.id; });

                        node.exit().remove();

                        var nodeEnter = node.enter().append("g")
                            .attr("class", "node")
                            .on("click", click)
                            .on("mouseover", mouseover)
                            .on("mousemove", mousemove)
                            .on("mouseout", mouseout)
                            .call(force.drag);

                        var infoColumns = ["parentId", "id", "name", "description","px", "py", "weight", "children","index","_children","fixed","x","y"];

                        nodeEnter.append("circle")
                            .attr("r", function(d) { return 8; }) /*d.total*/
                            /*.attr("data-content", function(d) { return "<div><p> Probability : "+d["0"]+"<p/></div>";})
                             .attr("data-content", function(d) { return "<h4>Node Description</h4><table class='table'><thead><tr><th>Bike Buyer</th><th>Cases</th><th>Node Prabability</th></tr></thead><tbody><tr><td>0</td><td>9184 / 18038</td><td>0.48</td></tr><tr><td>1</td><td>9484 / 18038</td><td>0.52</td></tr><tr><td>Missing</td><td>0 / 18038</td><td>0</td></tr></tbody></table>
                             ";})*/
                            .attr("data-content", function(d) { var popupstr =  "<h2>"+d.name+"</h2><br/><table class='table table-bordered'><thead><tr><th>Viewed</th><th>Frequency</th><th>%Share</th></tr></thead><tbody>";
                                Object.keys(d).forEach(function(k) {
                                    if(infoColumns.indexOf(k)<0 ) {
                                        //alert(JSON.stringify(Object.keys(d[k][0])));
                                        var nodestat = d[k][0];
                                        //density =  share(nodestat['Yes'],nodestat['Total'])
                                        var p = Object.keys(d[k][0]);
                                        for (var key in p) {
                                            if (p.hasOwnProperty(key)) {
                                                var col = p[key];
                                                var nodeshare = share(nodestat[p[key]],nodestat['Total'])
                                               // alert(col + " -> " + nodestat[col] );
                                                popupstr +="<tr><td>"+col+"</td><td>"+nodestat[col]+"</td><td>"+nodeshare+"</td></tr>"
                                            }
                                        };
                                        //popupstr +="<tr><td>"+k+"</td><td>"+d[k]+"</td><td>"+d["p_of_"+k]+"</td></tr>"
                                    }
                                });
                                return popupstr;})
                            .attr("class","my_circle")
                            .style("fill", function (d) {
                                //alert(d['distribution'][0]['Total']);
                                //alert(d['p_of_yes']);
                                return color(share(d['distribution'][0]['Yes'],d['distribution'][0]['Total']));
                            });

                        nodeEnter.filter(function(d) {if (d.children) {return false;} else if (d._children){return false;} else {return true;}})
                            .append("circle")
                            .attr("r", .5);

                        /*
                         nodeEnter.append("circle")
                         .attr("r", function(d) { return Math.floor(Math.random()*16); })
                         .attr("title",  function(d) {
                         return d.name})
                         .attr("data-content", function(d) { return "<div><p> Probability : "+d["0"]+"<p/></div>";})
                         .attr("class","my_circle")
                         .style("fill", function (d) { return color(Math.floor(Math.random()*101)); });
                         */
                        /*
                         nodeEnter.append("circle")
                         .attr("r", function(d) { return 10; })
                         .attr("title",  function(d) {
                         return d.name})
                         .attr("data-content", function(d) { return "<div><p> Probability : "+d["0"]+"<p/></div>";})
                         .attr("class","my_circle");
                         */
                        /*
                         nodeEnter.append("circle")
                         .attr("r", function(d) { return Math.sqrt(d.size) / 10 || 4.5; })
                         .attr("title",  function(d) {
                         return '&#8608; '+d.parent+' &#8594; '+d.name})
                         .attr("data-content", function(d) { return "<div><p> Probability : "+d.probability+"<p/></div>";})
                         .attr("class","my_circle");
                         */
                        /*node.select("circle")
                         .style("fill", color);*/

                    }

                    function tick() {
                        link.attr("x1", function(d) { return d.source.x; })
                            .attr("y1", function(d) { return d.source.y; })
                            .attr("x2", function(d) { return d.target.x; })
                            .attr("y2", function(d) { return d.target.y; });
                        /*
                         link.attr("d", function(d) {
                         var dx = d.target.x - d.source.x,
                         dy = d.target.y - d.source.y,
                         dr = Math.sqrt(dx * dx + dy * dy);
                         return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
                         });
                         */

                        node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
                    }

                    /*
                     function color(d) {
                     return d._children ? "#72341f" // collapsed package
                     : d.children ? "#809994" // expanded package
                     : "#665446"; // leaf node
                     }
                     */
                    var color = d3.scale.linear()
                        .domain([-100, 0, 100])
                        .range(["#006400", "white", "#006400"]);
                    
                    function share(part,total){
                       return ((total > 0) && (part > 0))?Math.round((part*100)/total):0;
                    };
                    
                    function removeUnderscore(s){
                        return  s.replace(/_/g," ");
                    }

                    function applyProperCase(s)
                    {
                        return s.toLowerCase().replace(/^(.)|\s(.)/g,
                            function($1) { return $1.toUpperCase(); });
                    }

                    // Toggle children on click.
                    function click(d) {
                        if (d3.event.defaultPrevented) return; // ignore drag
                        if (d.children) {
                            d._children = d.children;
                            d.children = null;
                        } else {
                            d.children = d._children;
                            d._children = null;
                        }
                        update();
                    }


                    function mouseover(d) {
                        $(".my_circle").popover({trigger:'hover',html: true,container: 'body',placement: 'auto'});
                        if (!d.children) {
                        }
                    };

                    function mousemove(d) {
                        if (typeof d.description !== 'undefined') {

                            //div
                            //.style("left", (d3.event.pageX) + "px")
                            //.style("top", (d3.event.pageY) + "px");
                        }
                    };

                    function mouseout(d) {
                        //div.transition()
                        //.duration(500)
                        //.style("opacity", 1e-6);
                    };

                    // Returns a list of all nodes under the root.
                    function flatten(root) {
                        var nodes = [], i = 0;

                        function recurse(node) {
                            if (node.children) node.children.forEach(recurse);
                            if (!node.id) node.id = ++i;
                            nodes.push(node);
                        }

                        recurse(root);
                        return nodes;
                    };
                    function toggle(d) {
                        if (d.children) {
                            d._children = d.children;
                            d.children = null;
                        } else {
                            d.children = d._children;
                            d._children = null;
                        }
                    };
                });

            }
        }
    });