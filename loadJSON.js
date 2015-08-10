
var circles = null;
var lines = null;
var graph = null;

var width = 600,
    height = 500;

var force = d3.layout.force()
    .charge(-1000)
    .linkDistance(75)
    .size([width, height]);

var svg = d3.select("#completeGraph").append("svg")
    .attr("width", width)
    .attr("height", height);
    
var svg2 = d3.select("#partitionGraph").append("svg")
    .attr("width", width)
    .attr("height", height);

var dataIsLoaded = true;

function loadD3(file) {
  if(dataIsLoaded){
    
    dataIsLoaded =false;
    d3.json(file, function(error, data) {
      
      if (error) return alert("error");     
      
      if(graph != null) {
        graph.removeAllNodes();
        graph.removeAllLinks();
      }
      
      graph = new initGraph(svg);
      graph.loadGraph(data);
      
      force
        .nodes(graph.nodes)
        .links(graph.links)
        .start();
    
      refreshGraph(graph);
      

    });
    dataIsLoaded = true;
  }

}




