function initGraph(data) {
  
  var graph = {
    nodes : [],
    links : []
  };

  graph.addNode = function (id, nbWalker) {
      graph.nodes.push({"id":id});
      findNode(id).nbWalker = nbWalker;
      refreshGraph(graph);
  };

  graph.removeNode = function (id) {
      var i = 0;
      var n = findNode(id);
      while (i < graph.links.length) {
          if ((graph.links[i]['source'] == n)||(graph.links[i]['target'] == n))
          {
              graph.links.splice(i,1);
          }
          else i++;
      }
      graph.nodes.splice(findNodeIndex(id),1);
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
      graph.links.push({"source":findNode(source),"target":findNode(target),"value":value});
      refreshGraph(graph);
  };

  var findNode = function(id) {
      for (var i in graph.nodes) {
          if (graph.nodes[i]["id"] === id) return graph.nodes[i];};
  };

  var findNodeIndex = function(id) {
      for (var i=0;i<graph.nodes.length;i++) {
          if (graph.nodes[i].id==id){
              return i;
          }
      }
  };
  
  for(var i = 0; i < data.nodes.length; i++) {
    graph.addNode(data.nodes[i].id, data.nodes[i].nbWalker);
  }
  
  for(var i = 0; i < data.links.length; i++) {
    graph.addLink(data.links[i].source, data.links[i].target, data.links[i].value);
  }
  
  initMatrices(graph);
  
  return graph;
}

      
function initMatrices(graph) {
  //Matrix stuffs

  // Compute the adjency matrix
  graph.adjMat = function() {

    var A = math.zeros(graph.nodes.length, graph.nodes.length);

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
    
  graph.X0 = [];
    
  for(var i = 0; i < graph.nodes.length;i++) {
    graph.X0[i] = graph.nodes[i].nbWalker;
  }

}    

function refreshGraph(graph) {
 
  node = svg.selectAll("circle").data(graph.nodes, function(d) { 
            return d.id;
            });
  link = svg.selectAll(".link").data(graph.links, function(d) {
            return d.source.id + "-" + d.target.id; 
            });
 

    
  nodeEnter = node.enter().append("g")
    .attr("class", "node")
    .call(force.drag);
     
  nodeEnter
    .append("svg:circle")
      .attr("class", "node")
      .attr("r", 30)
      .attr("opacity", function(d) { 
      var o = null;
      return (d.nbWalker/nbWalkerTot)*0.9+0.1 })
      .style("fill", "black")			
      .call(force.drag)
      .on("click", mouseClick);
    
  nodeEnter.append("title")
    .text( function(d){return d.nbWalker;}) ;
    
  node.exit()
     .remove()
     
  link.enter()
    .append("line")
      .attr("class", "link")
      .style("stroke-width", function(d) { return Math.sqrt(d.value); });

  link.exit()
    .remove();
    
    force.on("tick", function() {
      link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

      node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
    });
    
    
    //The node clicked gets the 100 walkers at time = 0
    function mouseClick(element){
      if(!initialNodeisClicked){
      
        element.nbWalker = 100;
        graph.X0[element.id] = element.nbWalker;
        update();
        initialNodeisClicked=true;     
                                
                                
        //Reset the slider and the time

        d3.select("#time").property("value", 0);
        step = 0;
        d3.select("#time-value").text(step);

        }              
    }

  
}
