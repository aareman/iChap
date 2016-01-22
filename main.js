/*
Features to add
-unique by page so we can see the decline in new words per daf. --DONE! 
-key word pickout -- Done!
-collapse all similar words into one (issue with this one)
-generate nice report at end 
-pull out all roshei teivos -- Done!
-twelve is the header text to remove when working with tzel harim -- DONE!
-just trim until two whitespaces -- done!
-how many unmatched words are left on the page
----and what they are.
-add a range selector for the pages using a dropdownlist with only headers and 
indexes.

*/

var gList, fList;
var tractate; // an array
var TEMP;

//main load and handling function
$(document).ready(function(){
  $("#gittin").load("Text_Resources/Gittin_Complete_Text.html",function(){
     tractate = cleanup($(this).text()).split("\n");
     var temp = [];
     for(var i=0;i<tractate.length;i++){
       if(tractate[i] !== "" && tractate[i].indexOf("@") < 0){
         temp.push(tractate[i]);
       }
     }
     tractate = temp;
     
    $("#keywords").load("Text_Resources/KeyWords.html",function(){
      gList = $(this).text().split("|");
      $("#frequency").load("Text_Resources/frequency.html",function(){
      fList = $(this).text().split("|");
      $("#gemarah").load("Text_Resources/Gittin_Gemarah.html",function(){
      //var gm = cleanup($(this).text());
      
      
  //  Levenshtien test()
      
      //var ar = dedup(tokenize(gm));
      //ar = test(ar);
  
      $(this).text("");
      /*
      //$(this).append(array2list(ar));
      
  //  Roshei Teivos
      
      var br = getRosheiTeivos(tokenize(gm));
      $(this).append("<h3>Roshei Teivos - " + br.length + "</h3>" );
      //$(this).append(array2string(test(br)));
      $("#ghead").append(" " + ar.length);
      
  //  Key words
      
      var list = getKeyWords(gm, gList);
      list = dedup(list);
      $(this).append("<h3>Key Words - " + list.length + "</h3>");
      //$(this).append(array2list(list));
      
  //  Frequency
      
      list = getKeyWords(gm, fList);
      list = dedup(list);
      list = test(list);
      $(this).append("<h3>Frequency - " + list.length + "</h3>"); 
      //$(this).append(array2list(list));
      */
      //main();
      init();
      
    });
    });
    });
    
    //$("#gemarah").load("testgm.txt",function(){
    
  });
  
 /* $("#rashi").load("Gittin_Rashi.txt",function(){
    var ar = dedup(tokenize($(this).text()));
    $(this).text(ar.join());
    $("#rhead").append(" " + ar.length);
  });
  $("#tosefos").load("Gittin_Tosefos.txt",function(){
    var ar = dedup(tokenize($(this).text()));
    $(this).text(ar.join());
    $("#thead").append(" " + ar.length);
  });*/
  
});

function init(){
  var temp = [];
  temp = prepTractate(temp,0,tractate.length);
  
  //1.5 (temporary) load list
  
  var startSelect = document.getElementById("startSelect");
  var endSelect = document.getElementById("endSelect");
  for(var i = 0; i < temp.length;i++){
    var option1 = document.createElement("option");
    var option2 = document.createElement("option");
    option1.text = temp[i][0];
    option2.text = temp[i][0];
    startSelect.add(option1);
    endSelect.add(option2);
  }
  
  TEMP = temp;
  $("span").text("Ready");
}
function main(start, end){
  
  //fix boundary issues
  var index;
  if(start > end){
    index = start;
    start = end;
    end = index;
  }
  
  var temp = TEMP.slice(start,end+1); //is the main multidimensional array for this function.
  var genList = [];//to keep track of which words have been found.
  
//step 1 - load pages from tractate and select headers
  //temp = prepTractate(temp,0,tractate.length);
  
  //1.5 (temporary) load list
  /*
  var startSelect = document.getElementById("startSelect");
  var endSelect = document.getElementById("endSelect");
  for(var i = 0; i < temp.length;i++){
    var option1 = document.createElement("option");
    var option2 = document.createElement("option");
    option1.text = temp[i][0];
    option2.text = temp[i][0];
    startSelect.add(option1);
    endSelect.add(option2);
  }*/
  
//step 2,3,4 - break and search each part
  for(i = 0;i<temp.length;i++){
    
    //these getkeyword functions return as arrays
      //check settings
      var choice = document.getElementById("formy");
    if(temp[i][1]){
      var l = temp[i][1];
      if(choice.elements["nam"].value === "freq"){
        temp[i][1] = getKeyWords(temp[i][1],fList); //keywords
      }
      else{
        temp[i][1] = getNonKeyWords(temp[i][1],fList); //keywords
      }
      
      var t = getKeyWords(l,gList); //high frequency
      for(var j = 0; j<t.length;j++){
        temp[i][1].push(t[j]);
      }
      temp[i][1] = test(dedup(temp[i][1]));
    }
      
    

    
//step 3 - only have words the first time they come up
    //remove words found on prev dapim
    
    if(genList.length > 0){
      
      for(var c = 0;c<genList.length;c++){
        for(var k = 0;k<temp[i][1].length;k++){
          if(genList[c] === temp[i][1][k]){
            temp[i][1].splice(k,1);
            break;
          }
        }
      }
      
      for(var s = 0; s<temp[i][1].length;s++){
        genList.push(temp[i][1][s]);
      }
      
    }
    else{
      var a2 = temp[i][1];
      for(var q = 0;q<a2.length;q++){
        genList.push(a2[q]);
      }
    }
//step 4 - return appropriate header
    temp[i][0] = brackify(temp[i][0] + " - " + temp[i][1].length,"b");  
  }

    
//step 5 - print finished lists  
  for(i = 0;i<temp.length;i++){
    $("#gemarah").append(temp[i][0] + "</br>" + 
                            array2string(temp[i][1]) + "</br>");
    
  }
}
function prepTractate(temp,start,end){
  //swaps if bounds are incorrect
  if(start > end){
    var s = end;
    end = start;
    start = s;
  }
  
  for(var i=start;i<end;i++){
    temp.push(find_header(tractate[i]));
  }
  return temp;
}
function cleanup(text){
  var t;
  t = text.replace(/:/g , "");
  t = t.replace(/\./g, "");
  t = t.replace(/\)/g, "");
  t = t.replace(/\(/g, "");
  t = t.replace(/\]/g, "");
  t = t.replace(/\[/g, "");
  //t = t.replace(/,/g, "");
  t = t.trim();
  
  return t;
}
function tokenize(text){
  
  var array = text.split(' ');
  
  for(var i = 0;i<array.length;i++){
    array[i] = array[i].trim();
  }
  
  return array;
}
function test(array){
  //array = dedup(array);
  array = array.sort();
  var g = array.length;
  var a2 = [];
  a2.push(array[0]);
  array.splice(0,1);
  //dist[50][50] = 0;
  var word; //temp word
  var index = 0; // temp index in array
  var dist = 10;
  
  while(a2.length < g){
    
    for(var i=0;i<array.length;i++){
      var temp = getEditDistance(array[i],a2[a2.length-1]);
      if(temp < dist){
          dist = temp;
          index = i;
      }
    }
    //(Temporary test)
    
    a2.push(array[index] + dist);

    array.splice(index,1);
    dist = 10;
    index = 0;
  }
  return rmSimilar(a2);
}
function dedup(array){
  var a = [];
  
  for(var i = 0; i < array.length; i++){
    var unique = true;
    
    for(var j = 0; j<a.length;j++){
      if(a[j] === array[i]){
        unique = false;
        break;
      }
      else{
        unique = true;
      }
    }
    if(unique === true){
      a.push(array[i]);
    }
  }
  return a;
}
function array2string(array){
  if(array.length > 0){
    var str = array[0];
  
    for(var i=1;i<array.length;i++){
    
      str += ", " + array[i];  
    
    
    }
    return str;
  }
  else{
    return "-No Words-";
  }
  
}
function array2list(array){
  var htmlText = "<ol>";
  
  for(var i = 0;i<array.length;i++){
    htmlText += brackify(array[i], "li");
  }
  htmlText+="</ol>";
  
  return htmlText;
}
function brackify(middle, tag){
  return " <"+tag+">"+middle+"</" + tag + "> ";
}
function getRosheiTeivos(array){
  var a = [];
  for(var i=0;i<array.length;i++){
    if(array[i].indexOf('"') > -1){
      a.push(array[i]);
    }
  }
  a = dedup(a);
  a.sort();
  return a;
}
function getKeyWords(str, List){
  // add handling if List has more than one column
  
  var keyA = [];
  for(var i = 0; i < List.length;i++){
    if(str != 1){
        if(List[i].indexOf(" ") >= 0 && str.indexOf(" " + List[i]) >= 0){
          keyA.push(List[i]);
      }  
      else if(str.indexOf(" " + List[i] + " ") >= 0){
          keyA.push(List[i]);
      }
    }
    else{
      keyA.push("-Error-");
    }
  }
  
  //code to find keywords in str and return them to keyA
  // str.indexOf()  <-- should work rudimentarily
  
  return keyA;
}
function getNonKeyWords(str,list){
  str = str.trim();
  var keyA = str.split(" ");
  keyA = rmArray(keyA, list);
  return keyA;
}
function getEditDistance(a, b) {
  // Compute the edit distance between the two given strings
  if(a.length === 0) return b.length; 
  if(b.length === 0) return a.length; 

  var matrix = [];

  // increment along the first column of each row
  var i;
  for(i = 0; i <= b.length; i++){
    matrix[i] = [i];
  }

  // increment each column in the first row
  var j;
  for(j = 0; j <= a.length; j++){
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for(i = 1; i <= b.length; i++){
    for(j = 1; j <= a.length; j++){
      if(b.charAt(i-1) == a.charAt(j-1)){
        matrix[i][j] = matrix[i-1][j-1];
      } else {
        matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
                                Math.min(matrix[i][j-1] + 1, // insertion
                                         matrix[i-1][j] + 1)); // deletion
      }
    }
  }

  return matrix[b.length][a.length];
}
function find_header(text){
//pull the header of page out of each daf from a text file
  var a = [1,1];
  
  for(var i=0;i<text.length;i++){
    if(i > 0){
      if(text[i] === " " && text[i-1] === " "){
        a[0] = text.slice(0,i);
        a[1] = text.slice(i,text.length);
        break;
      }
    }
  }
  
  return a;
}
function rmArray(origArray, toBeRemovedArray){
  //takes in two arrays and removes from the first all those items in the second
  for(var i = 0;i<toBeRemovedArray.length;i++){
    for(var j=0;j<origArray.length;j++){
      if(toBeRemovedArray[i] === origArray[j]){
        origArray.splice(j,1);
        break;
      }
    }
  }
  return origArray;
}
function rmSimilar(array){
  var a = [];
  /*
  remove after levenshtien sort pending 3 conditions
  -longer contains shorter
  -longer is not more than 2 longer
  -index of contained is not 0
  */
  for(var i = 0; i < array.length; i++){
    if(array[i].indexOf("2") < 0){
      a.push(array[i]);
    }
  }
  
  for(i = 1; i < a.length;i++){
    a[i] = a[i].slice(0,(a[i].length-1));
  }
  
  return a;
}
