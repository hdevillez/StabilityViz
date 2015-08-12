var graphPartition = null;

//Let the user select nodes to do the partition shown in the right corner of the page
function partition(){
  
  if(document.getElementById("partitionButton").value === "off") {

    document.getElementById("partitionButton").value = "on";
    document.getElementById("partitionButton").innerHTML="Partition On";

    d3.selectAll(".node").on('mousedown.drag', null);
    svg
      .on( "mousedown", function() {
        var m = d3.mouse( this);
        
        groupNode = [];
        node.classed("selected", false);
        
        
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
          initPartition()
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

function initPartition() {
  
  /*for(var iNode = 0; iNode < graph.nodes.length; iNode++) {
        
        graph.nodes[iNode].color = "red";
        console.log(graph.nodes[iNode]);
  }*/
  
  for(var iNode = 0; iNode < groupNode.length; iNode++) {
        groupNode[iNode].color = currColor;
  }

  
  force
    .nodes(graph.nodes)
    .links(graph.links)
    .start();
    
  refreshGraph(graph);
  
  groupNode = [];

}

