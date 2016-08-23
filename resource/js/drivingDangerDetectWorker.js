importScripts("util.js");
importScripts("drivingDangerDetectNode.js");

var drivingDangerDetectNode = new DrivingDangerDetectNode({
	// game: game
});

drivingDangerDetectNode.transfer = function(victim_cluster, killer_cluster, degree) {
	postMessage(JSON.stringify({
		'victim_cluster': victim_cluster,
		'killer_cluster': killer_cluster,
		'degree': degree
	}));
};

onmessage = function(event) {
	var param = JSON.parse(event.data);
	var cluster_list = param.cluster_list;
	
	if(cluster_list != null && cluster_list.length != 0) {			
		drivingDangerDetectNode.setClusterList(cluster_list);
		drivingDangerDetectNode.detect();s
	}
}
