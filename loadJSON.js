
var link = null;
var node = null;
var graph = null;

var width = 960,
    height = 500;

var force = d3.layout.force()
    .charge(-1200)
    .linkDistance(30)
    .size([width, height]);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

d3.json("data.json", function(error, data) {
  if (error) throw error;



	graph = data;

    for(var i = 0; i < graph.nodes.length; i++) {
    nbWalkerTot += graph.nodes[i].nbWalker;
  } 

  force
      .nodes(graph.nodes)
      .links(graph.links)
      .start();

  link = svg.selectAll(".link")
      .data(graph.links)
    .enter().append("line")
      .attr("class", "link")
      .style("stroke-width", function(d) { return Math.sqrt(d.value); });


  node = svg.selectAll(".node")
      .data(graph.nodes)
    .enter().append("circle")
      .attr("class", "node")
      .attr("r", 30)
      .attr("opacity", function(d) { return (d.nbWalker/nbWalkerTot)*0.9+0.1 })
			.style("fill", "black")			
      .call(force.drag);

  node.append("title")
    .text(function(d) { return d.nbWalker; })


  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  });
  
  //Matrix stuffs
  
 
  // Compute the adjency matrix
  graph.adjMat = function() {
        console.log("test1");
    var A = math.zeros(graph.nodes.length, graph.nodes.length);

    for(var i = 0; i < graph.links.length; i++) {
    
      var l = graph.links[i];
      
      A.subset(math.index(l.source.id, l.target.id), l.value);
      A.subset(math.index(l.target.id, l.source.id), l.value);
      console.log(A.subset(math.index(l.target.id, l.source.id)));

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
    
  
  graph.transitionMat = function() {
  
    var P = math.zeros(graph.nodes.length);
    
    P = math.multiply(graph.Dinv, graph.A);
    return P;  
  }
  
  graph.P = graph.transitionMat();
  
  graph.X0 = [];
  
  for(var i = 0; i < graph.nodes.length;i++) {
    graph.X0[i] = graph.nodes[i].nbWalker;
  }
  
});


