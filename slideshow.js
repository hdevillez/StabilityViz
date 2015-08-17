var width = parseInt(d3.select("body").style("width"))*49/100,
    height = 500;



var svg = d3.select("#visGraph1").append("svg")
    .attr("width", width)
    .attr("height", height);
    
document.getElementById("visSide1")
  .innerHTML = "test";
  
var svg2 = d3.select("#visSide2").append("svg")
    .attr("width", width)
    .attr("height", height);

