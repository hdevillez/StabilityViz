function initGraph(svg) {
  
  var graph = {
    nodes : [],
    links : [],
    vis : svg
  };
  
  

  graph.addNode = function (id) {
      graph.nodes.push({"id":id});
      graph.findNode(id).nbWalker = 0;  
      graph.findNode(id).color = "black";
      graph.findNode(id).nbWalkers = [];
      for(var i = 0; i < nbColor; i++) {
        graph.findNode(id).nbWalkers[i] = 0;
      }
      //refreshGraph(graph);
  };

  graph.removeNode = function (id) {
      var i = 0;
      var n = graph.findNode(id);
      while (i < graph.links.length) {
          if ((graph.links[i]['source'] == n)||(graph.links[i]['target'] == n))
          {
              graph.links.splice(i,1);
          }
          else i++;
      }
      graph.nodes.splice(graph.findNodeIndex(id),1);
      refreshGraph(graph);
  };

  graph.removeLink = function (source,target){
      for(var i=0;i<graph.links.length;i++)
      {
          if(graph.links[i].source.id == source && graph.links[i].target.id == target)
          {
              graph.links.splice(i,1);
              break;
          }
      }
      refreshGraph(graph);
  };

  graph.removeAllLinks = function(){
      graph.links.splice(0,graph.links.length);
      refreshGraph(graph);
  };

  graph.removeAllNodes = function(){
      graph.nodes.splice(0,graph.links.length);
      refreshGraph(graph);
  };

  graph.addLink = function (source, target, value) {
      graph.links.push({"source":graph.findNode(source),"target":graph.findNode(target),"value":value});
      //refreshGraph(graph);
  };

  graph.findNode = function(id) {
      for (var i in graph.nodes) {
          if (graph.nodes[i]["id"] === id) return graph.nodes[i];};
  };

  graph.findNodeIndex = function(id) {
      for (var i=0;i<graph.nodes.length;i++) {
          if (graph.nodes[i].id==id){
              return i;
          }
      }
  };
  
  graph.loadGraph = function(data) {

    for(var i = 0; i < data.nodes.length; i++) {
      graph.addNode(data.nodes[i].id);
    }
    
    for(var i = 0; i < data.links.length; i++) {
      graph.addLink(data.links[i].source, data.links[i].target, data.links[i].value);
    }
    
     initMatrices(graph);
  }
  
  graph.copyGraph = function(graphToCopy) {
    for(var i = 0; i < graphToCopy.nodes.length; i++) {
      graph.addNode(graphToCopy.nodes[i].id, graphToCopy.nodes[i].nbWalker, graphToCopy.nodes[i].color);
    }
    
    for(var i = 0; i < graphToCopy.links.length; i++) {
      graph.addLink(graphToCopy.links[i].source.id, graphToCopy.links[i].target.id, graphToCopy.links[i].value);
    }
  
    initMatrices(graph);
  }
 
  return graph;
}


      
function initMatrices(graph) {
  //Matrix stuffs

  // Compute the adjency matrix
  graph.adjMat = function() {

    var A = math.zeros(graph.nodes.length);


    //reset the matrix
    
    //for(var i =0; i < graph.nodes.length; i++) { A.set(i, i, 0)};

    for(var i = 0; i < graph.links.length; i++) {
      
      var l = graph.links[i];

      A.subset(math.index(l.source.id, l.target.id), l.value);
      A.subset(math.index(l.target.id, l.source.id), l.value);

    }
    
    
    return A;
  }
  graph.A = graph.adjMat();
    
    
  //Compute the degree matrix
  graph.degreeInvMat = function() {
    var Dinv = math.zeros(graph.nodes.length);
      
    for(var i = 0; i<  graph.nodes.length;i++) {
      var deg = 0;
      for(var j = 0; j<  graph.links.length; j++) {
        if(graph.links[j].target.id == graph.nodes[i].id || graph.links[j].source.id == graph.nodes[i].id) {
          deg+= graph.links[j].value;
        }
      }
      Dinv.subset(math.index(i,i), 1/deg);     
    }
      
    return Dinv;
  }
  
  graph.Dinv = graph.degreeInvMat();
      
  //Compute the transition matrix  
  graph.transitionMat = function() {
    
    var P = math.zeros(graph.nodes.length, graph.nodes.length);
      
    P = math.multiply(graph.Dinv, graph.A);
    return P;  
  }
    
  graph.P = graph.transitionMat();
  
  var numericP = numeric.identity(graph.nodes.length);
  for(var i = 0; i < graph.nodes.length; i++) {
    for(var j = 0; j < graph.nodes.length; j++) {
      numericP[i][j] = graph.P.subset(math.index(i, j));
      
    }
  }
  console.log(graph.P.toString());
  console.log(numericP);
  
  //Compute the spectral gap
  var lambda = numeric.eig(numericP).lambda.x;
  var secondMaxLambda = 0;
  var epsilon = math.pow(10, -10);
  
  for(var i = 0; i < graph.nodes.length; i++) {
  
    if(lambda[i] < 1-epsilon)
      secondMaxLambda = Math.max(secondMaxLambda, lambda[i]); 
      
     //console.log(lambda[i]); //Print the eigenvalues
  }
  //console.log(secondMaxLambda); //Print the second greatest eigenvalue

  //var maxTime = math.log(epsilon)/math.log(secondMaxLambda);
  graph.maxTime = 10/(1-secondMaxLambda);
  console.log(graph.maxTime);
  d3.select("#time").property("max", graph.maxTime);
  

  graph.X0 = [];
    
  for(var i = 0; i < nbColor; i++) {
    graph.X0[i] = [];
    for(var j = 0; j < graph.nodes.length; j++) {
      graph.X0[i][j] = 0;
    }
  }

}    


function refreshGraph(graph) {
 
  link = graph.vis.selectAll(".link").data(graph.links, function(d) {
            return d.source.id + "-" + d.target.id; 
            });
  
  node = graph.vis.selectAll("circle").data(graph.nodes, function(d) { 
            return d.id;
            });

 

    
  /*nodeEnter = node.enter().append("g")
    .attr("class", "node")
    .call(force.drag);*/
     
  link.enter()
    .append("line")
      .attr("class", "link")
      .style("stroke-width", function(d) { return Math.sqrt(d.value); });

  link.exit()
    .remove();
     
  node.enter()
    .append("svg:circle")
      .attr("class", "node")
      .attr("r", 15)
      .attr("title", function(d) { return d.nbWalkers[0] +"/"+d.nbWalkers[1] +"/"+d.nbWalkers[2] })
      .style("fill", "#ffffff")
      .style("stroke", "#000000")
      .style("stroke-width", "3")
      .on("click", mouseClick)
      .call(force.drag);
    
  node.exit()
     .remove()
     
  
    
  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
  });
    
    
  //The node clicked gets the 100 colored walkers at time = 0
  function mouseClick(element){
    if(!initialNodeisClicked){
      
      if(element.color == "black")
        nbWalkerTot+=100;  
      
      for(var i = 0; i < nbColor; i++) {
           element.nbWalkers[i] = 0;
           graph.X0[i][element.id] = 0;
      }
      
      switch(currColor) {
        case "#ff0000" :
           element.nbWalkers[0] = 100;
           graph.X0[0][element.id] = element.nbWalkers[0];
           break;
        case "#00ff00":
          element.nbWalkers[1] = 100;
          graph.X0[1][element.id] = element.nbWalkers[1];
          break;
        case "#0000ff" :
          element.nbWalkers[2] = 100;
          graph.X0[2][element.id] = element.nbWalkers[2];
          break;
        default : break;
      }
      
      element.color = currColor;        
      //update();
      //initialNodeisClicked=true;     
                                
      node.transition()
        .style("fill", changeColorNode);  

      //  update();                   
      //Reset the slider and the time
    
      d3.select("#time").property("value", 0);
      step = 0;
      d3.select("#time-value").text(step);

    }              
  }

  
}     
