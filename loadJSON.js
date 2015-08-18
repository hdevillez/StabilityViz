var dataIsLoaded = true;


//Load the graph encoded as a json file
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

function loadGraph(){
  reinitialization();
  clearBarChart();
  
  if(automaticWalkInterval != null) //Remove automatic walk
    clearInterval(automaticWalkInterval);
  
  
  file = document.getElementById("graphChoice").value; //Get the name file


  loadD3(file);
};

