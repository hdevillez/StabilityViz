/*
 * Implementation of a modificated version of the Louvain algorithm :
 *  - The modularity is computed each time by his definition
 *  - If the parameter t != 1, the stability is computed instead of the modularity
 *
 * Source : 
 *  - https://sites.google.com/site/findcommunities/
 *  - Fast unfolding of communities in large networks
 *      Vincent D Blondel, Jean-Loup Guillaume,
 *      Renaud Lambiotte and Etienne Lefebvre
 */

var communities = [];

var weightedDegree = [];
var listCommunities = [];
var totalWeight, t;
    
function findCommunities(t) {
 
 
  communities = [];
  this.t = t;
  
  totalWeight = 0; // Compute the total weigh of the graph
  for(var iLink = 0; iLink <  graph.links.length; iLink++) { 
    totalWeight += graph.links[iLink].value;                  
  }
  
  var currMod;
  var newMod;
  var g = graph;
    
  var layer = 0;
  // While the modularity is improved ...
  do {
    
    //Reinitialize the degree of the nodes
    for(var iNode = 0; iNode < g.nodes.length; iNode++) {
      weightedDegree[iNode] = 0;
    }
    
    //Compute the degree of the nodes
    for(var iLink = 0; iLink <  g.links.length; iLink++) {
            
      var currLink = g.links[iLink];
      weightedDegree[currLink.source.id] += currLink.value;
      weightedDegree[currLink.target.id] += currLink.value;        
    }
    
    // Initialize the communities of graph at a certain layer
    communities[layer] = [];
    if(layer == 0) {
      for(var i= 0; i < g.nodes.length;i++) {
        communities[0][i] = i;
      }
    }
    else {
      for(var i = 0; i < listCommunities.length; i++) {
        communities[layer][i] = i;
      }
    }
    
    //console.log(communities);
    newMod = modularity(g, layer);
    currMod = newMod;
  

    newMod = oneLevel(g, layer);
    
    
    //console.log(newMod);
    listCommunities = [];
    
    // Simplify the communities so that they are numbered from 0 to n-1
    for(var i = 0; i < g.nodes.length; i++) {
      var flag = false;
      for(var j = 0; j < listCommunities.length; j++) {
        if(listCommunities[j] == communities[layer][i]) {
          communities[layer][i] = j;
          flag = true;
        }
      }
      if(!flag) {
        listCommunities.push(communities[layer][i]);
        communities[layer][i] = listCommunities.length-1;
      }
    }
   

    
    g = partitionToGraph(g, layer);
    
    layer++;

  } while (newMod > currMod); // While the modularity is improved
   
  
  findFinalCommunities(); // Compute the partition of the initial graph equivalent to the partition of the higher level graph
  colorByCommunities(); // Color the different nodes according to this partition
}


// Return the modularity of the graph according to the partition given by "community[layer]"
function modularity(g, layer) {

    var mod = 1-t ;
    
    for(var iNode1 = 0; iNode1 < g.nodes.length; iNode1++) {
        for(var iNode2 = 0; iNode2 < g.nodes.length; iNode2++) {
            if(communities[layer][iNode1] == communities[layer][iNode2]) {
                mod += (g.A.subset(math.index(iNode1, iNode2)) * t/(totalWeight*2)- weightedDegree[iNode1]*weightedDegree[iNode2]/((totalWeight*2)*(totalWeight*2)));
            }
        }
    }
    return mod;
}

var dummySvg = d3.select("#body").append("svg");


// Return a new graph :
// - The nodes are the communities that maximise the modularity according to the Louvain algorithm
// - The value of the link between two nodes is the sum of the value of the links between the communities of the old graph

function partitionToGraph(g, layer) {

  var newGraph = initGraph(dummySvg);
  
  for(var iComm= 0; iComm < listCommunities.length; iComm++) {
    newGraph.addNode(iComm);
  }
  
  for(var iComm1= 0; iComm1 < listCommunities.length; iComm1++) {
      for(var iComm2= 0; iComm2 < listCommunities.length; iComm2++) {
      
        var weight = 0;
        
        for(var iLink = 0; iLink < g.links.length; iLink++) {
          if(communities[layer][g.links[iLink].source.id] == iComm1 && communities[layer][g.links[iLink].target.id] == iComm2)
            weight += g.links[iLink].value;
        }
        
        if(weight > 0)
          newGraph.addLink(iComm1, iComm2, weight);
      
      }
  }
  initMatrices(newGraph);
  
  return newGraph;
}


// Compute the partition that provides the best modularity according to Louvain algorithm for a certain layer of the graph
function oneLevel(g, layer) {
    
    var improvement = false;
    var newMod   = modularity(g, layer);
    var nbStep = 0;
    
    // While the modularity is improved ...
    do {
      improvement = false;

      // for each node: remove the node from its community and insert it in the best community
      for (var nodeTmp=0 ; nodeTmp<g.nodes.length ; nodeTmp++) {
        var node = nodeTmp;
 
        var nodeComm = communities[layer][node];


        var neighComm = [];
        // Compute all neighboring communities of the current node
        for(var iLink = 0; iLink < g.links.length; iLink++) {
          if((g.links[iLink].source.id == node) || g.links[iLink].target.id == node) {
            
            var currNeighComm = null;
            if(communities[layer][g.links[iLink].source.id] != nodeComm) {
              currNeighComm = communities[layer][g.links[iLink].source.id];
            }
            else if(communities[g.links[iLink].target.id] != nodeComm) { 
              currNeighComm = communities[layer][g.links[iLink].target.id];
            }
            
            var alreadyVisited = false;
            if(currNeighComm != null) {
              for(var iNeigh = 0; iNeigh < neighComm.length; iNeigh++) {
                if(neighComm[iNeigh] == currNeighComm)
                  alreadyVisited = true;;
              }  
              
              if(!alreadyVisited) {
                neighComm.push(currNeighComm);
              }
            }
            

            
          }
        }

        // Compute the neighbouring community for the node that guarantee the best modularity
        // Default choice for future insertion is the former community
        var bestComm = nodeComm;
        var bestIncrease = 0;
        for (var iNeigh = 0; iNeigh < neighComm.length; iNeigh++) {
          
          communities[layer][node] = neighComm[iNeigh];
            
          var increase = modularity(g, layer) - newMod;
          
          //console.log(iNeigh + " " + modularity());
          if (increase>bestIncrease) {
            bestComm = neighComm[iNeigh];
            bestIncrease = increase;
            
          } 


        }

       
       communities[layer][node] = bestComm;

       // console.log(bestComm + " " + find(node));
        newMod = modularity(g, layer);
       // console.log(currMod);
        
        if (bestComm!=nodeComm) {
          improvement=true;
          //console.log(node + " " + nodeComm + " " +bestComm);
        }
      }


      nbStep++;
      //console.log(modularity(g, layer));
      
    } while (improvement && nbStep < 100);
    console.log(communities);
   // console.log(nbStep);
    return newMod;
}  


// Compute the partition of the initial graph equivalent to the partition of the higher level graph
function findFinalCommunities() {
  var finalCommunities= [];
  
  for(var i = communities.length-1; i > 0; i--) {
    
    for(var j = 0 ; j < communities[i].length; j++) {
      for(var k = 0; k < communities[i-1].length; k++) {
        if(communities[i-1][k] == j)
        communities[i-1][k] = communities[i][j];
      }
    }    
  }
}

// Color the nodes according to the communities given by the graph
var comColors = d3.scale.category20();
function colorByCommunities() {
    
  for(var iNode = 0; iNode < graph.nodes.length; iNode++) {
    
    if(communities[0][iNode]%3 == 0)
      currColor = "ff0000";
    else if(communities[0][iNode]%3 == 1)
      currColor = "0000ff";
    else
      currColor = "00ff00";
    
    initColorNode((graph.nodes[iNode]));
  }
    
   /* node.transition()
        .style("fill", function (d) {return comColors(communities[0][d.id])});*/
}
  
