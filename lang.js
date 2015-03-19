//All to be replaced by a JS file.

var sort_by = function(field, reverse, primer){
   var key = function (x) {return primer ? primer(x[field]) : x[field]};

   return function (a,b) {
    var A = key(a), B = key(b);
    return ( (A < B) ? -1 : ((A > B) ? 1 : 0) ) * [-1,1][+!!reverse];                  
   }
}

//function to get rid of repeating words
function unique(list) {
    var result = [];
   
    $.each(list, function(i, e) {
        if (($.inArray(e, result) == -1) ) result.push(e);
    });

    return result;
}

function words(word){
  this.word = word;
  this.count = 1;
}

//wordArray stores the actual word and how many times it appears
var wordArray = [];
wordArray.push(new words("starter"));

//Jquery magic
$(document).ready(function(){
  
//gets the data from the specified text file
        $.get("bookstxt/WhiteNiggersOfAmerica.txt", function(data, status){
            var str=data;
            // get rid of random symbols
            var thingy=str
            .replace(/[\.,-\/•#!?©@$%^"'\^&\*;:{}=\-_`~()\d\r\v\n]/g,"");
            //get rid of words under 3 characters in length
            thingy=thingy.replace(/(\b(\w{1,3})\b(\s|$))/g, "");
            //get rid of common words
             thingy=thingy.replace(/that|their|they|with|were|which|this|from|have|them|most|only|more|these|there|will|been|than|then|would|could|should|those|they|when/g, "");
            //Multiple spaces become one.
            thingy=thingy.replace(/\s+/g, ' ');
            //Make lower case
            thingy=thingy.toLowerCase();
            //split parses the data into an array by the regular expression specified 
            thingy=thingy.split(" ");
            console.log(unique(thingy));

            //clean, unique array of words.
            var result = unique(thingy);
            console.log(result.length);

            //Push the unique words into the wordArray, will be used for keeping count
            for (var i = 0; i < result.length; ++i){
              wordArray.push(new words(result[i])); 
            }

            //Run through original text, increment counts of words in wordArray
            for (var i = 0; i < thingy.length; ++i){
              for (var j = 0; j < wordArray.length; ++j){
                if (thingy[i] == wordArray[j].word){
                  wordArray[j].count++; //incrememnt count if same
                }
              }
            }
            wordArray.sort(sort_by('count',false,parseInt));

            var topWords = [];
            var topWordCount= [];
            var testingstuff=[];
            for (var i = 0; i < 25; ++i){
              topWords.push(wordArray[i]);
              topWordCount.push(wordArray[i].count);
              testingstuff.push(wordArray[i].word);
            }
            console.log(testingstuff);
           
            /*var count=0;

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
            console.log(values);*/

            /*
              var temp=thingy[1];
              var count=0;
            for(i=0; i<thingy.length;i++){            
              if (temp==thingy[i]){
                count++;
              }
            }*/
           
        
var fill = d3.scale.category10();

var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
  
 var count2=0;
//Word cloud creation in D3
  d3.layout.cloud().size([300, 500])
      .words(topWords.map(function(d) {
        var wordSize=10;
          wordSize=wordSize+((topWordCount[count2])/2);
          
          count2++;
        return {text: d.word, count: d.count, size: wordSize };
      }))
      .padding(5)
      .rotate(function() { return ~~(0) * 90; })
      .font("Impact")
      .fontSize(function(d) { return d.size; })
      .on("end", draw)
      .start();

  function draw(words) {
    
    var count=0;
    
    d3.select("#svg").append("svg")
        .attr("width", 300)
        .attr("height", 500)
      .append("g")
        .attr("transform", "translate(150,250)")
      .selectAll("text")
        .data(words)
      .enter().append("text")

      //change font with size
        .style("font-size", function(d) {
          var wordSize=10;
          wordSize=wordSize+((topWordCount[count])/2);
          console.log(wordSize);
          count++;
         return wordSize+ "px"; 

       })
        .style("font-family", "Impact")
        .style("fill", function(d, i) { return fill(i); })
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate("+ d.rotate + ")";
        })
        .text(function(d) { return d.text; })
        .on("mouseover", function(d) {
            tooltip.transition()
               .duration(200)
               .style("opacity", .9);
            //Add Tooltip.html with transition and style
            tooltip.html("\"" + d.text + "\"" + " appears " + d.count + " times.") 
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
