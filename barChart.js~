var margin = {top: 50, right: 20, bottom: 30, left: 30};
   
       
var newHeight = 0;     
       
   
 
function showEmptyBarChart(){

        initSlideShow();

        var finalNbWalkers =[];
 
        for(var i = 0; i < nbColor; i++) {
                finalNbWalkers[i] = [];
                for(var j = 0; j < graph.nodes.length; j++){
                        var Xn = math.multiply(graph.X0[i], math.pow(graph.P, math.round(graph.maxTime)));
                        finalNbWalkers[i][j] = Xn.subset(math.index(j));
                }
 
        }
        g=svg2.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
       
        d3.selectAll('.node').each(function(element){
             
               
                g.append("rect")
                        .attr({
                                x: (width/(graph.nodes.length+2)+5) * (element.id ),
                                width: width/(graph.nodes.length+2),
                                height: 0,
                                y: 350,
                                class: "filled_bars",
                                fill: "black"
                        })
                        .attr("id", function(d){  
                return element.id;
                        })

               
                g.append("rect")
                .attr({
                        x: (width/(graph.nodes.length+2)+5) * (element.id ),
                        width: width/(graph.nodes.length+2),
                        height: sumLineArray2D(finalNbWalkers, element.id)*6,
                        y: 350-sumLineArray2D(finalNbWalkers, element.id)*6,
                        fill: "transparent",
                        class: "empty_bars"
                })
                .attr("id", function(d){  
                return element.id;
         })        
                .style("stroke-width", 2)
                .style("stroke", "black")
                .on("mouseover", function(){
                        d3.select(this).style("stroke", "blue");
                })
                .on("mouseout", function(){
                        d3.select(this).style("stroke", "black");
                });
               
               
                });
                fillBarChart();
        }
       
       
 
 
function clearBarChart(){
        d3.selectAll('.empty_bars').remove();
        d3.selectAll('.filled_bars').remove();
}
 
function fillBarChart(){
        d3.selectAll('.node').each(function(n){
 
                d3.selectAll(".filled_bars").each(function(element){
                       
                        if(parseInt(d3.select(this).attr("id")) === n.id){
                                console.log("test3");
                                newHeight=sumArray(n.nbWalkers);
                                d3.select(this).transition().duration(400).ease("elastic").attr("height", newHeight*6)
                                                           .attr("y", 350- newHeight*6)
                                                           .attr("fill", changeColorNode(n));
                        }
                });
        });
}
