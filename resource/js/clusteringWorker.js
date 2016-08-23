importScripts("util.js");
importScripts("clusteringNode.js");

var clusteringNode = new ClusteringNode({
	//game: game
});

onmessage = function(event) {
	var param = JSON.parse(event.data);
	var vehicle_list = param.vehicle_list;
	
	if(vehicle_list != null && vehicle_list.length != 0) {
		clusteringNode.setVehicleList(vehicle_list);
		clusteringNode.cluster();
		
		postMessage(JSON.stringify({
			'vehicle_list': clusteringNode.getVehicleList(),
			'cluster_list': clusteringNode.getClusterList()
		}));
			
	}	
}