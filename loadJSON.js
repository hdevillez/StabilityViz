function loadGraph(data){

  reinitialization();
  clearBarChart();
  

  
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
  console.log(data);
  refreshGraph(graph);



};

function loadInternFile() {
  file = document.getElementById("graphChoice").value; //Get the name file

  d3.json(file, function(error, data) {
      
  if (error) return alert("Error in the loading of the file.");     
    
    console.log(data);
    loadGraph(data);
   
  });
}

function loadExternFile() {

  var reader = new FileReader();

  reader.onload = function (e){
    var data = undefined;
    

    if(inputFile.files[0].name.match('\.json'))
      data = JSON.parse(reader.result);
    else if(inputFile.files[0].name.match('\.NET'))
      data = parsePajek(reader.result);
    
    console.log(data);
    
    loadGraph(data);
    
  }
  var inputFile = document.getElementById("fileInput");

  reader.readAsText(inputFile.files[0]);
}

//Parse a pajek NET string
function parsePajek(pajek){
  console.log(pajek);
  
  var data = {
    nodes : [],
    links : []
  };
  var lines = pajek.split(/\r\n|\r|\n/g);

  var indexNbVertices = lines[0].indexOf("*Vertices") + 9;
  if(indexNbVertices == -1) {
    alert("Format error");
    return undefined;
  }
  
  //Parse the nodes
  var nbNodes = 0;
  for(var i = indexNbVertices; i< lines[0].length && lines[0].charAt(i) != '%'; i++) {
    nbNodes *= 10;
    nbNodes += +lines[0].charAt(i);
  
  }
  
  for(var i = 0; i < nbNodes; i++) {
    data.nodes.push({"id" : i});
  }
  
  //Parse the links
  
  if(lines[1].toLowerCase() == "*edges" ||lines[1].toLowerCase() == "*arcs") {
    for(var i = 2; i < lines.length-1; i++) {
      var link = lines[i].split(" ");
      console.log(link);
      if(link.length == 2) {
        data.links.push({"source" : +link[0]-1, "target" : +link[1]-1, "value" : 1});
      }
      else if(link.length == 3) {
        data.links.push({"source" : +link[0]-1, "target" : +link[1]-1, "value" : +link[2]});
      }
      else {
        alert("Format error");
        return undefined;
      }
      
    }
  
  }

 

  console.log(data);
  return data;
}


