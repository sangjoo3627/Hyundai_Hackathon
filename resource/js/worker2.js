
onmessage = function(event) {
	var num = Math.floor(Math.random() * 3) + 1;
	for(var i = 0; i < num; i ++) {
		wait(Math.floor(Math.random() * 300));
		postMessage('Worker 2');	
	}
};

function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}