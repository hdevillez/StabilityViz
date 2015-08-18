var width = parseInt(d3.select("body").style("width"))*49/100,
    height = 500;



var svg = d3.select("#visGraph1").append("svg")
    .attr("width", width)
    .attr("height", height);
    
//Rectangle of color in the svg of the graph

var colorTab = ["#ff0000", "#00ff00", "#0000ff","#ffff00", "#00ffff", "#ff00ff", "#ffffff", "#000000"];
var currColor = "#ff0000";
svg.selectAll(".colorChoice")
    .data(colorTab)
  .enter().append("rect")
  .attr("class", "colorChoice")
  .attr("width", 50)
  .attr("height", 50)
  .attr("fill", function (d, i) { return"#" +(rybColorMixer.rybToRgb(colorTab[i], { hex: true}))})
  .attr("x", function(d, i) { return i*60+5})
  .attr("y", 5)
  .attr("rx", 15) // rounded corner
  .attr("ry", 15)
  .style("stroke", "#000000")
  .style("stroke-width", function (d, i) { if(i==0) return 3; else return 0;})
  .on("click", function(d, i) {
    currColor = colorTab[i];
    svg.selectAll(".colorChoice")
      .style("stroke-width", "0");
    d3.select(this).style("stroke-width", "3");
  });
for(var i = 0; i < colorTab.length; i++) {
  svg.append("rect")
  
}
    
document.getElementById("visSide1")
  .innerHTML = "test";
  
var svg2 = d3.select("#visSide2").append("svg")
    .attr("width", width)
    .attr("height", height);

