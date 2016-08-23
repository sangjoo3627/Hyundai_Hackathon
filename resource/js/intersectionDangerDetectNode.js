function IntersectionDangerDetectNode (options) {
	this._$init.apply(this, arguments);
}

IntersectionDangerDetectNode.prototype = {
	_$init: function(options) {
		if(options == null) {
			options = {};
		}
		
		this._cluster_list = options.cluster_list || [];
		this._center = options.center || null;
		this._signal = [];
		this._road = [];
		this._danger_cluster_list = [];
		
		this._angle = options.angle || [Math.PI, -(Math.PI / 2), 0, Math.PI / 2];
		this._dir = options.dir || 4;
		this._cen_dst = options.cen_dst || 200;
		this._danger_vel = options.danger_vel || 10;
		this._angle_tole = options.angle_tole || 0.174533;
	},
	
	init: function() {
		
		this._road = [];
		for(var i = 0; i < this._dir; i ++) {
			this._road.push([]);
		}
		
		this._danger_cluster_list = [];
	},
	
	setCenter: function(center) {
		this._center = center;
	},
	
	setClusterList: function(cluster_list) {
		this._cluster_list = cluster_list;
	},
	
	setSignal: function(signal) {
		if(signal.length == this._dir) {
			this._signal = signal;
		}
	},
	
	transfer: function(victim_cluster, killer_cluster, degree) {
		console.log(victim_cluster);
	},
	
	detect: function() {
		if(this._center == null) {
			return;
		}
		
		for(i in this._cluster_list) {
			var cluster = this._cluster_list[i];
			var bet_dst = distanceBetween(this._center, cluster.first.sprite);
			var danger_vel = this._danger_vel;
			
			if(bet_dst <= this._cen_dst) {
				var first_rot = normalizeRadian(cluster.first.sprite.rotation);
				var bet_rot = normalizeRadian(angleBetween(cluster.first.sprite, this._center));
				var diff_rot = first_rot - bet_rot;
								
				for(var j = 0; j < this._dir; j ++) {
					var para_rot = Math.abs(first_rot - this._angle[j]);
					
					if(para_rot < this._angle_tole && (diff_rot >= -(Math.PI / 2)) && (diff_rot <= (Math.PI / 2))) {
						this._road[j].push(cluster);
						
						if((this._signal[j] == 0) && (cluster.first.vel > danger_vel)) {
							this._danger_cluster_list.push(cluster);
						}
					}
				}
			}			
		}
		
		var legal_index = [];
		for(i in this._signal) {
			if(this._signal[i] != 0) {
				legal_index.push(i);
			}
		}
		
		var danger_list = this._danger_cluster_list;
		if(danger_list.length != 0 && legal_index.length != 0) {
			for(i in danger_list) {
				var killer_cluster = danger_list[i];
				for(j in legal_index) {
					for(k in this._road[j]){
						this.transfer(this._road[j][k], killer_cluster, 'danger');
					}
				}
			}
		}
	}
	
};