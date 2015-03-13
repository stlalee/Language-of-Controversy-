//All to be replaced by a JS file.

//Jquery magic
$(document).ready(function(){
  
//gets the data from the specified text file
        $.get("test.txt", function(data, status){
            var str=data;
            //split parses the data into an array by the regular expression specified 
            var thingy=str.split(" ");
           
        
  var fill = d3.scale.category20();
  
//Word cloud creation in D3
  d3.layout.cloud().size([300, 300])
      .words(thingy.map(function(d) {
        return {text: d, size: 10 + Math.random() * 90};
      }))
      .padding(5)
      //.rotate(function() { return ~~(Math.random() * 2) * 90; })
      .font("Impact")
      .fontSize(function(d) { return d.size; })
      .on("end", draw)
      .start();

  function draw(words) {
    d3.select("#svg").append("svg")
        .attr("width", 300)
        .attr("height", 300)
      .append("g")
        .attr("transform", "translate(150,150)")
      .selectAll("text")
        .data(words)
      .enter().append("text")
        .style("font-size", function(d) { return d.size + "px"; })
        .style("font-family", "Impact")
        .style("fill", function(d, i) { return fill(i); })
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")";
        })
        .text(function(d) { return d.text; });
  }
  },'text');
});


  //click title for transition
  d3.select("#title")
  	.on("click", function() {
  		console.log("Hey, it works!");
  	});
