//All to be replaced by a JS file.

//Var used to store bookfile being read in
var bookFile;

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

//Called on click
function updateData(e){
  bookFile = e.id;
  getBookFile();
  d3.select("svg").remove();
  drawCloud(bookFile);
}

//Called whenever changing book text
function getBookFile() {
  switch(bookFile){
    case '1':
      bookFile = "bookstxt/Psycho.txt"
      break;
    case '2':
      bookFile = "bookstxt/AnimalFarm.txt"
      break;
    case '3':
      bookFile = "bookstxt/BraveNewWorld.txt"
      break;
    case '4':
      bookFile = "bookstxt/Frankenstein.txt"
      break;
    case '5':
      bookFile = "bookstxt/GrapesOfWrath.txt"
      break;
    case '6':
      bookFile = "bookstxt/Lolita.txt"
      break;
    case '7':
      bookFile = "bookstxt/ToKillAMockingbird.txt"
      break;
    case '8':
      bookFile = "bookstxt/TropicOfCancer.txt"
      break;
    case '9':
      bookFile = "bookstxt/Ulysses.txt"
      break;
    case '10':
      bookFile = "bookstxt/WhiteNiggersOfAmerica.txt"
      break;
    default:
      bookFile = "bookstxt/WhiteNiggersOfAmerica.txt"
      break;
  }
}

function drawCloud(bookFile) {
  var wordArray = [];
  wordArray.push(new words("starter"));
  
//gets the data from the specified text file
        $.get(bookFile, function(data, status){
            var str=data;
            // get rid of random symbols
            var thingy=str
            .replace(/[\.,-\/•#!?©@$%^"'\^&\*;:{}=\-_`~()\d\r\v\n]/g,"");
            //get rid of words under 3 characters in length
            thingy=thingy.replace(/(\b(\w{1,3})\b(\s|$))/g, "");
            //get rid of common words
             thingy=thingy.replace(/that|their|they|with|were|which|this|from|have|them|most|only|more|these|there|will|been|than|then|would|could|should|those|they|when|httpwwwidphnet|said|went|they|what|while|says|some|like|about|just|even|over|where|dont|your|after|s|into|down|back|around|here|away|till|through|toward|before|upon|t|uch/g, "");
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
        
var fill = d3.scale.category10();

var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
  
 var count2=0;
//Word cloud creation in D3
  d3.layout.cloud().size([300, 500])
      .words(topWords.map(function(d) {
        var wordSize=20;
          wordSize=wordSize*((topWordCount[count2])/topWordCount[24]);
          
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
          var wordSize=20;
          wordSize=wordSize*((topWordCount[count])/topWordCount[24]);
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
}

//Jquery magic
$(document).ready(function(){
  getBookFile();
  console.log(bookFile);
  drawCloud(bookFile);
});
