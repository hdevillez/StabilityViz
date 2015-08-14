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

function loadGraph(){



  reinitialization();
  
  
  if(automaticWalkInterval != null) //Remove automatic walk
    clearInterval(automaticWalkInterval);
  
  
  file = document.getElementById("graphChoice").value;
//console.log(document.getElementById("graphChoice").value);

  initialNodeisClicked = false;
  clearBarChart();
  loadD3(file);
  

  
};

