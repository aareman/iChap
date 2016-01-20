//Tractate object
/*
-load tractate
-parse and find by perek and daf
-return daf selections as an array.
*/

function Tractate(array){
  this.mainText = array;
}
Tractate.prototype.refractor = function(){
  var temp = [];
  
};


//other functions
function find_header(text){
  var a = [];
  
  for(var i=0;i<text.length;i++){
    if(i > 0){
      if(text[i] === " " && text[i-1] === " "){
        a[0] = text.substring(0,i-1);
        a[1] = text.substring(i,text.length);
        break;
      }
    }
  }
  
  return a;
}