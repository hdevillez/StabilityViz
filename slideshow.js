var currPosSlide = 0;    

// Change the left slide and the right animation in the help page
function changeSlide(nextSlide) {
  currPosSlide = nextSlide;
  sliders[1].goTo(nextSlide);
  
  reinitialization();
  d3.select("#tailGraph").property("style", "visibility : visible");
  
  if(nextSlide == 0) {
    d3.select("#tailGraph").property("style", "visibility : hidden"); // The time-player is not accessible for the first animation

    // Color the 3 communities of the examples in blue-red-yellow            
    for(var i = 0; i < graph.nodes.length; i++) {
      if(i < 3) {
        graph.nodes[i].nbWalkers[0] = 100;
        graph.X0[0][i] = graph.nodes[i].nbWalkers[0];
        nbWalkerTot += 100;
        graph.nodes[i].color = "#ff0000";
      }
      else if(i < 7) {
        graph.nodes[i].nbWalkers[1] = 100;
        graph.X0[1][i] = graph.nodes[i].nbWalkers[1];
        nbWalkerTot += 100;
        graph.nodes[i].color = "#00ff00";
      }
      else {
        graph.nodes[i].nbWalkers[2] = 100;
        graph.X0[2][i] = graph.nodes[i].nbWalkers[2];
        nbWalkerTot += 100;
        graph.nodes[i].color = "#0000ff";
      }
         
    }

  }
  else if(nextSlide == 1) {
    
    // Color only one node to show the diffusion process
    
    graph.nodes[0].nbWalkers[2] = 100;
    graph.X0[2][0] = graph.nodes[0].nbWalkers[2];
    nbWalkerTot += 100;
    graph.nodes[0].color = "#0000ff";   
   
  }
  else if(nextSlide == 2) {
  
    // Color the nodes in a bad partition of communities
    
    for(var i = 0; i < graph.nodes.length; i++) {
      if(i%3 == 0) {
        graph.nodes[i].nbWalkers[0] = 100;
        graph.X0[0][i] = graph.nodes[i].nbWalkers[0];
        nbWalkerTot += 100;
        graph.nodes[i].color = "#ff0000";
        }
      else if(i%3 == 1) {
        graph.nodes[i].nbWalkers[1] = 100;
        graph.X0[1][i] = graph.nodes[i].nbWalkers[1];
        nbWalkerTot += 100;
        graph.nodes[i].color = "#00ff00";
        }
      else {
        graph.nodes[i].nbWalkers[2] = 100;
        graph.X0[2][i] = graph.nodes[i].nbWalkers[2];
        nbWalkerTot += 100;
        graph.nodes[i].color = "#0000ff";
      }
    }  


  }
  else if(nextSlide == 3) {
  
    // Color the nodes in a good partition of communities
    
    for(var i = 0; i < graph.nodes.length; i++) {
      if(i < 3) {
        graph.nodes[i].nbWalkers[0] = 100;
        graph.X0[0][i] = graph.nodes[i].nbWalkers[0];
        nbWalkerTot += 100;
        graph.nodes[i].color = "#ff0000";
      }
      else if(i < 7) {
        graph.nodes[i].nbWalkers[1] = 100;
        graph.X0[1][i] = graph.nodes[i].nbWalkers[1];
        nbWalkerTot += 100;
        graph.nodes[i].color = "#00ff00";
      }
      else {
        graph.nodes[i].nbWalkers[2] = 100;
        graph.X0[2][i] = graph.nodes[i].nbWalkers[2];
        nbWalkerTot += 100;
        graph.nodes[i].color = "#0000ff";
      }
         
    }  

  }
  
  update();
}
