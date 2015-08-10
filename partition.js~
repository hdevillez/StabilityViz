//Let the user select nodes to do the partition shown in the right corner of the page
function partition(){
  
  if(document.getElementById("partitionButton").value === "off") {
    groupNode = [];
    document.getElementById("partitionButton").value = "on";
    document.getElementById("partitionButton").innerHTML="Partition On";

    d3.selectAll(".node").on('mousedown.drag', null);
    svg
      .on( "mousedown", function() {
        var m = d3.mouse( this);
        //the selection is a rectangle with rounded corners but we can try with ellipse, cx, cy, rx, ry
        svg.append( "rect")
          .attr("rx", 70)
          .attr("ry", 70)
          .attr("class", "selection")
          .attr("x", m[0])
          .attr("y", m[1])
          .attr("width", 0)
          .attr("height", 0)

      })
      .on( "mousemove", function() {
        var s = svg.select( "rect.selection");
   
        if( !s.empty()) {
          var m = d3.mouse( this),
              d = {
                    x       : parseInt( s.attr( "x"), 10),
                    y       : parseInt( s.attr( "y"), 10),
                    width   : parseInt( s.attr( "width"), 10),
                    height  : parseInt( s.attr( "height"), 10)
              },
              move = {
                    x : m[0] - d.x,
                    y : m[1] - d.y
              };
   
          if( move.x < 1 || (move.x*2<d.width)) {
            d.x = m[0];
            d.width -= move.x;
          } else {
            d.width = move.x;      
          }
   
          if( move.y < 1 || (move.y*2<d.height)) {
            d.y = m[1];
            d.height -= move.y;
          } else {
            d.height = move.y;      
          }
                             
          s.attr( d);
                                 
          d3.selectAll('.node').each(function(element){
          
            if(!d3.select(this).classed("selected") &&
              element.x>=d.x && element.x<=d.x+d.width &&
              element.y>=d.y && element.y<=d.y+d.height) {
              
              
             
              //the circles we went over get the dashed border                             
              d3.select(this).classed("selected",true); 
              var isInGroupNode = false;
              if(groupNode !== null){
                for(var i = 0; i < groupNode.length && !isInGroupNode; i++){
                  if(element.id===groupNode[i].id){
                    isInGroupNode = true;
                  }
                }
              }
              if(!isInGroupNode){
                groupNode.push(element);
              }                              
            }
            if(d3.select(this).classed("selected") &&
              (element.x<d.x || element.x>d.x+d.width ||
               element.y<d.y || element.y>d.y+d.height)){
              
              d3.select(this).classed("selected",false); //the circles we went over get the dashed border                            
              for(var i = 0; i < groupNode.length && !isInGroupNode; i++){
                if(element.id===groupNode[i].id){
                  groupNode.shift(i,1);
                }
              }                                                      
            }
          });
        }
      })
      .on("mouseup", function(){
        //svg.select(".selection") is an array containing the dashed rectangle
        console.log("test");
          showPartition()
          svg.select( ".selection").remove();
          return;
      });
      
    }
    else if(document.getElementById("partitionButton").value === "on"){
      document.getElementById("partitionButton").value = "off";
      document.getElementById("partitionButton").innerHTML="Partition Off";
      svg.on("mousemove", function(){return;});
      svg.on("mouseup", function(){return;});
      svg.on("mousedown", function(){return;});
      
      node.call(force.drag);
  }
}

function showPartition() {
 
  var graphPartition = new initGraph(svg2);
  graphPartition.copyGraph(graph);
  
  var groupNode2 = [];
  
  for(var i = 0; i < graphPartition.nodes.length; i++) {
    var flag = true;
    for(var j = 0; j< groupNode.length; j++) {
      
      if(graphPartition.nodes[i].id == groupNode[j].id)
        flag = false;  
      
    }
    if(flag)
      groupNode2.push(graphPartition.nodes[i]);
  }
  
  
  //All the link between the two partitions are removed
  var linksToRemove = [],
      linksToAdd = [];
  for(var iLink = 0; iLink < graphPartition.links.length; iLink++){
    var flag = false;
    for(var iSource = 0; iSource < groupNode.length; iSource++) {
      for(var iTarget = 0; iTarget < groupNode.length; iTarget++) {
        
        if(groupNode[iSource].id == graphPartition.links[iLink].source.id
        && groupNode[iTarget].id == graphPartition.links[iLink].target.id) {
          flag = true;
        }
      }
    }  
    if(!flag){
        linksToRemove.push({"source" : graphPartition.links[iLink].source.id,
                            "target" : graphPartition.links[iLink].target.id
                          });
      }
  }   
  
  for(var iLink = 0; iLink < graphPartition.links.length; iLink++){
    var flag = false;
    for(var iSource = 0; iSource < groupNode2.length; iSource++) {
      for(var iTarget = 0; iTarget < groupNode2.length; iTarget++) {
        
        if(groupNode2[iSource].id == graphPartition.links[iLink].source.id
        && groupNode2[iTarget].id == graphPartition.links[iLink].target.id) {
          flag = true;
        }
      }
    }  
    if(flag){
        linksToAdd.push({"source" : graphPartition.links[iLink].source.id,
                            "target" : graphPartition.links[iLink].target.id
                          });
      }
  }   
  
  for(var i = 0; i<  linksToRemove.length; i++) {
    graphPartition.removeLink(linksToRemove[i].source, linksToRemove[i].target);
  }
  
  for(var i = 0; i<  linksToAdd.length; i++) {
    graphPartition.addLink(linksToRemove[i].source, linksToRemove[i].target, 1);
  }


  initMatrices(graphPartition);
  
  force
    .nodes(graphPartition.nodes)
    .links(graphPartition.links)
    .start();
  refreshGraph(graphPartition);

}

