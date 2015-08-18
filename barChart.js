var margin = {top: 0, right: 0, bottom: 0, left: 0};
           
var newHeight = 0;    
           
       
     
function showEmptyBarChart(){
  
  margin.left = ((width - (width/(graph.nodes.length+1)+width/((graph.nodes.length+1)*(graph.nodes.length+1))) * (graph.nodes.length-1) - width/(graph.nodes.length+1))/2);
  margin.top = height * 10/100;
  margin.bottom = height*10/100;
            
  var finalNbWalkers =[];
     
  for(var i = 0; i < nbColor; i++) {
    finalNbWalkers[i] = [];
    for(var j = 0; j < graph.nodes.length; j++){
      var Xn = math.multiply(graph.X0[i], math.pow(graph.P, math.round(graph.maxTime)));
      finalNbWalkers[i][j] = Xn.subset(math.index(j));
    }
       
  }
  /* var nbWalkerMax = 0;
  for( var i = 0; i < graph.nodes.length; i++)
    nbWalkerMax = Math.max(sumLineArray2D(finalNbWalkers, i));*/
            
  g=svg2.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                   
                                
  d3.selectAll('.node').each(function(element){
    var currNode = element;
          
    g.append("rect")
      .attr({
        x: (width/(graph.nodes.length+1)+width/((graph.nodes.length+1)*(graph.nodes.length+1))) * (element.id) ,
        width: width/(graph.nodes.length+1),
        height: 0,
        y: height - margin.bottom - margin.top,
        class: "filled_bars",
        fill: "black"
      })
      .attr("id", function(d){  
        return element.id;
      })
      .on("mousedown", function(){
        showRepartition(currNode, d3.select(this));
      })
      .on("mouseup", function(){
        clearRepartition();
      });
     
                   
    g.append("rect")
      .attr({
        x: (width/(graph.nodes.length+1)+width/((graph.nodes.length+1)*(graph.nodes.length+1))) * (element.id) ,      
        width: width/(graph.nodes.length+1),
        height: (sumLineArray2D(finalNbWalkers, element.id)*height*(80/100)/nbWalkerTot),
        y:  height - margin.bottom - margin.top -(sumLineArray2D(finalNbWalkers, element.id)*height*(80/100)/nbWalkerTot),
        fill: "transparent",
        class: "empty_bars"
      })
      .attr("id", function(d){  
        return element.id;
      })        
      .style("stroke-width", 2)
      .style("stroke", "black");     
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
        d3.select(this).transition().duration(400).ease("elastic").attr("height", newHeight*height*(80/100)/nbWalkerTot)
          .attr("y",  height - margin.bottom - margin.top- newHeight*height*(80/100)/nbWalkerTot)
          .attr("fill", changeColorNode(n));
      } 
    });
  });
}
     
function showRepartition(element, bar){
  console.log("SHOW");
  //These three rectangles show the repartition of the colors in each node
  g.append("rect")
    .attr({
      id: "r",
      class: "repartition",
      fill: "red",
      x: bar.attr("x"),
      height: (element.nbWalkers[0])*height*(80/100)/nbWalkerTot,
      width: bar.attr("width"),
      y: height - margin.bottom - margin.top - (element.nbWalkers[0])*height*(80/100)/nbWalkerTot
    })
    .on("mouseup", function(){
      clearRepartition();
  });
    
  g.append("rect")
    .attr({
      id: "y",
      class: "repartition",
      fill: "yellow",
      x: bar.attr("x"),
      width: bar.attr("width"),
      height: (element.nbWalkers[1])*6*100/nbWalkerTot,
      y: height - margin.bottom - margin.top - (element.nbWalkers[0])*height*(80/100)/nbWalkerTot - (element.nbWalkers[1])*height*(80/100)/nbWalkerTot
    })
    .on("mouseup", function(){
      clearRepartition();
    });

  g.append("rect")
    .attr({
      id: "b",
      class: "repartition",
      fill: "blue",
      x: bar.attr("x"),
      height: (element.nbWalkers[2])*height*(80/100)/nbWalkerTot,
      width: bar.attr("width"),
      y: height - margin.bottom - margin.top- sumArray(element.nbWalkers)*height*(80/100)/nbWalkerTot
                                   
    })
    .on("mouseup", function(){
      clearRepartition();
    });            
}
     
function clearRepartition(){
  d3.selectAll('.repartition').remove();
}

       
