//All to be replaced by a JS file.

//function to get rid of repeating words
function unique(list) {
    var result = [];
   
    $.each(list, function(i, e) {
        if (($.inArray(e, result) == -1) ) result.push(e);
    });

    return result;
}

//Jquery magic
$(document).ready(function(){
  
//gets the data from the specified text file
        $.get("whiteNofAmerica.txt", function(data, status){
            var str=data;
            // get rid of random symbols
            var thingy=str.replace(/[\.,-\/#!?$%\^&\*;:{}=\-_`~()]/g,"");
            //Multiple spaces become one.
            thingy=thingy.replace(/\s+/g, ' ');
            //Make lower case
            thingy=thingy.toLowerCase();
            //split parses the data into an array by the regular expression specified 
            thingy=thingy.split(" ");
            console.log(unique(thingy));

             var count=0;

             //clean, unique array of words.
             var result=unique(thingy);
             //corresponding unique array of counts
            var values=[];
            //Fills array Values with the counts
            for(i=0; i<result.length;i++){  
            count=0;  
            for(j=0;j<thingy.length;j++){        
              if (result[i]==thingy[j]){
                count++;
              }
            }
            values[i]=count;
            }
            console.log(values);

            /*
              var temp=thingy[1];
              var count=0;
            for(i=0; i<thingy.length;i++){            
              if (temp==thingy[i]){
                count++;
              }
            }*/
           
        
  var fill = d3.scale.category20();

var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
  
//Word cloud creation in D3
  d3.layout.cloud().size([300, 300])
      .words(result.map(function(d) {
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
        .text(function(d) { return d.text; })
        .on("mouseover", function(d) {
            tooltip.transition()
               .duration(200)
               .style("opacity", .9);
            //Add Tooltip.html with transition and style
            tooltip.html(d.text) 
        })
        .on("mousemove", function(d) {
            return tooltip
            .style("left", (d3.event.pageX + 15) + "px")
            .style("top", (d3.event.pageY + 5) + "px")
        })
        //Then Add .on("mouseout", ....
        .on("mouseout", function(d) {
            tooltip.transition().duration(500).style("opacity", 0);
        })
  }
  },'text');
});
