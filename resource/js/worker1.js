var i = 0;
var dn;

onmessage = function(event) {
	postMessage(parseInt(event.data) + i);
	i ++;
};

function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}