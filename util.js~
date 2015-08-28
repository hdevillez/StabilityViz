// Return the maximal element of an array
function getMaxOfArray(numArray) {
  return Math.max.apply(null, numArray);
}


// Return the sum of the element of an array
function sumArray(numArray) {
  var sum = 0;
  for(var i = 0; i <numArray.length; i++)
    sum += numArray[i];
  return sum;
}

// Return the sum of the first element of the lines of 2D-arrays
function sumLineArray2D(tab2D, line){
  var sum = 0;
  for(var i = 0; i < tab2D.length ; i++){
    sum += tab2D[i][line];
  }
  return sum;
}

// Play/pause the animation of the walkers
function play() {
  var buttonPlay = d3.select("#playButton");
  
  // If the button play is actived, desactivate it and stop the walkers.  Otherwhise, activate it and launch the walkers.
  if(buttonPlay.classed("active")) {
    buttonPlay.classed("active", false);
    buttonPlay.property("textContent", "Play");
    clearInterval(automaticWalkInterval);
  }
  else{
    if(nbWalkerTot != 0) {
      buttonPlay.classed("active", true);
      buttonPlay.property("textContent", "Pause");
      automaticWalkInterval = setInterval(function () {walk(time+getSpeedWalk());}, 500); //The walkers move every 500 ms
      showEmptyBarChart(); 
    }
    else {
      alert("Please color at least one node before playing the animation");
    }
  }

}


// Stop the animation of the walkers
function stop() {

  var buttonPlay = d3.select("#playButton");
  buttonPlay.classed("active", false);
  buttonPlay.property("textContent", "Play");
  clearInterval(automaticWalkInterval);

  if(time != 0)
    walk(0);

  setSpeedWalk(1);

  if(node != null) {
    node
      .transition()
        .attr("r", function () {return 100/graph.nodes.length + 5;})
        .attr("title", function(d) { return d.nbWalkers[0] +"/"+d.nbWalkers[1] +"/"+d.nbWalkers[2] })
        .style("fill", colorNode)
  }

}

// Compute the newTime's step of the Markov process and update the figure
function walk(newTime) {
  
  time = newTime;
  
  d3.select("#time-value").text(time);
  d3.select("#time").property("value", time);


  var Xn = [];
  for( var i = 0; i < nbColor; i++) {
    Xn[i] = math.multiply(graph.X0[i], math.pow(graph.P, time));
  }
  
  for(var i = 0; i < nbColor; i++) {
    for(var j = 0; j < graph.nodes.length; j++) {
      graph.nodes[j].nbWalkers[i] = Xn[i].subset(math.index(j));
    }

  }
  
  update();
  
}

//Change the speed of the walkers
function setSpeedWalk(sw) {
  d3.select("#setSpeedWalkButton" +speedWalk).classed("active", false);
  speedWalk = sw;
  d3.select("#setSpeedWalkButton" +speedWalk).classed("active", true);
}


// Return the speed of the walkers
function getSpeedWalk() {
  switch(speedWalk) { 
    case 1:
      return +1;
      break;
    case 2:
      return +Math.round(graph.maxTime/50);
      break;
    case 3:
      return +Math.round(graph.maxTime/20);
      break;
    default:
      return 1;
  }
}

// Update the graph and the bar chart
function update() {

  if(node != null) {

    node
      .transition()
      .attr("r", function(d) {return (sumArray(d.nbWalkers)/nbWalkerTot)* 100 +5})
     // .attr("opacity", function(d) {return (sumArray(d.nbWalkers)/nbWalkerTot)*0.9+0.1 })
      .style("fill", colorNode) 
      .attr("title", function(d) { return d.nbWalkers[0] +"/"+d.nbWalkers[1] +"/"+d.nbWalkers[2] });
  }
  
  fillBarChart();

}

// Reinitialize the graph by removing the walkers of the node and the bar chart
function reinitialization() {
  
  stop();
  
  if(document.getElementById("playButton") != null) {
    var buttonPlay = d3.select("#playButton");
    if(buttonPlay.classed("active")) {
      
      buttonPlay.classed("active", false);
      buttonPlay.property("textContent", "Play");
      clearInterval(automaticWalkInterval);
    }
  }
  
  // Reinitialize the time and the slider
  d3.select("#time").property("value", 0);
  time = 0;
  d3.select("#time-value").text(time);

  speedWalk = 1;
  
  clearBarChart();   


  // Reinitialize the color and the number of walkers of the nodes
  nbWalkerTot = 0;
  if(graph != null) {
    for(var i = 0; i < nbColor; i++) {
      for(var j = 0; j < graph.nodes.length; j++) {

          graph.nodes[j].nbWalkers[i] = 0;
          graph.nodes[j].color = "#000000";
          graph.X0[i][j] = 0;
      }
    }
    
    node
      .transition()
        .style("fill", "#ffffff")
  }

}

//Return the color of a node in function of the number of walkers for each ryb color.
function colorNode(d) {
    
        
  var maxWalker = getMaxOfArray(d.nbWalkers);

  var rybColor = [];
  for(var i = 0; i < nbColor; i++) {
    if(maxWalker != 0)                                 // If there are a few walkers, the color is lighted.
      rybColor[i] = 255 * (d.nbWalkers[i]/maxWalker) * Math.sqrt(Math.sqrt(Math.sqrt(sumArray(d.nbWalkers)/nbWalkerTot))); 
    else
      rybColor[i] = 0;
  }
  return "#" +(rybColorMixer.rybToRgb(rybColor, { hex: true}));
         
}


//Give 100 colored walkers to a node
function initColorNode(element) {

  for(var i = 0; i < nbColor; i++) {
    element.nbWalkers[i] = 0;
    graph.X0[i][element.id] = 0;
  }
  
  if(element.color == "#000000" && currColor != "#000000")
    nbWalkerTot += 100;
  if(element.color != "#000000" && currColor == "#000000")
    nbWalkerTot -= 100;
    
  var arrayColor = rybColorMixer.hexToArray(currColor);
  for(var i = 0; i < nbColor; i++) {
  

    console.log(arrayColor);
    if(arrayColor[i] > 0)
      element.nbWalkers[i] = 100*255/sumArray(arrayColor);
    else
      element.nbWalkers[i] = 0;
   
    graph.X0[i][element.id] = element.nbWalkers[i];
    element.color = currColor;
  }
  
  node.transition()
    .style("fill", colorNode)
    .attr("title", function(d) { return d.nbWalkers[0] +"/"+d.nbWalkers[1] +"/"+d.nbWalkers[2] });
    
  if(time != 0){
    stop();
  }
    
}     
