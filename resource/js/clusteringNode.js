function ClusteringNode(options) {
	this._$init.apply(this, arguments);
}

ClusteringNode.prototype = {
	_$init: function(options) {
		this._cluster_list = [];
		this._cluster_num = 0;

		if(options == undefined) {
			options = {};
		}			
		this._vehicle_list = options.vehicle_list || [];
		this._vel_div_ratio = options.vel_div_ratio || 10;
		// scale factor times 5
		this._dist_scale = options.dist_scale || 5;
		// 7 degree for left and right
		this._angle_tole = options.angle_tole || 0.122173;
	},

	init: function() {
		vehicle_list = this._vehicle_list;

		for(i in vehicle_list) {
			vehicle_list[i].cluster = -1;
		}

		this._cluster_list = [];
		this._cluster_num = 0;

		return this;
	},
	
	setVehicleList: function(vehicle_list) {
		this._vehicle_list = vehicle_list;
	},
	
	setAngleTole: function(angle_tole) {
		this._angle_tole = angle_tole;
	},
	
	setDistScale: function(dist_scale) {
		this._dist_scale = dist_scale;
	},
	
	getVehicleList: function() {
		for(i in this._vehicle_list){
			this._vehicle_list[i].is_driving_caution_victim = false;
			this._vehicle_list[i].is_driving_danger_victim = false;
			this._vehicle_list[i].is_intersection_danger_victim = false;
			this._vehicle_list[i].is_driving_caution_killer = false;
			this._vehicle_list[i].is_driving_danger_killer = false;
			this._vehicle_list[i].is_intersection_danger_killer = false;
		}
		return this._vehicle_list;
	},

	getClusterList: function() {
		return this._cluster_list;
	},

	getSize: function() {
		return this._cluster_num;
	},

	cluster: function() {
		this.init();	

		vehicle_list = this._vehicle_list;
		cluster_list = this._cluster_list;
		
		for(i in vehicle_list) {
			if(vehicle_list[i].cluster == -1) {
				cluster_list.push({
					first: vehicle_list[i],
					last: vehicle_list[i],
					vehicle_list: [vehicle_list[i]]
				});
				vehicle_list[i].cluster = this._cluster_num;
				this._repeat(vehicle_list[i]);
				this._cluster_num += 1;
			}
		}

		return this;
	},

	_repeat: function(vehicle) {
		vehicle_list = this._vehicle_list;
		cluster_num = this._cluster_num;
		cluster_list = this._cluster_list;

		for(i in vehicle_list) {
			if(vehicle_list[i] != vehicle && vehicle_list[i].cluster == -1) {
				var switch_pos = this._satisfy(vehicle_list[i], vehicle)

				if(switch_pos != 'false') {
					console.log(vehicle.name + ' - ' + vehicle_list[i].name);

					vehicle_list[i].cluster = cluster_num;
					cluster_list[cluster_num].vehicle_list.push(vehicle_list[i]);

					if(cluster_list[cluster_num].first == vehicle && switch_pos == 'front') {
						cluster_list[cluster_num].first = vehicle_list[i];
					}

					if(cluster_list[cluster_num].last == vehicle && switch_pos == 'rear') {
						cluster_list[cluster_num].last = vehicle_list[i];
					}

					/*Recursive*/
					this._repeat(vehicle_list[i]);
				}
			}
		}
	},

	_satisfy: function(src, trgt) {
		var src_sprite = src.sprite;
		var trgt_sprite = trgt.sprite;

		// console.log('[SATISFY] ' + src.name + ' - ' + src.trgt);

		var src_dst = this._getDetectDst(src.vel);
		var trgt_dst = this._getDetectDst(trgt.vel);
		var bet_dst = distanceBetween(src_sprite, trgt_sprite);

		//console.log('dst: ' + src_dst + ' / ' + trgt_dst +' / ' + bet_dst);

		if(src_dst < bet_dst || trgt_dst < bet_dst) {
			return 'false';
		}

		var src_rot = src_sprite.rotation;
		var trgt_rot = trgt_sprite.rotation;
		var bet_rot = angleBetween(src_sprite, trgt_sprite);
		var src_vel = src.vel;

		//console.log('rot: ' + src_rot + ' / ' + trgt_rot + ' / ' + bet_rot);
		var switch_pos = this._isInLine(src_rot, trgt_rot, bet_rot, src_vel);

		if( switch_pos == 'front') {
			return 'front';
		} else if (switch_pos == 'rear') {
			return 'rear';
		}else {
			return 'false';
		}
	},

	_getDetectDst: function(vel) {
		if(vel >= 60) {
			return 0;
		} else {
			return (10 - vel / 6) * this._dist_scale;
		}
	},

	_isInLine: function(src_rot, trgt_rot, bet_rot, src_vel) {
		if(!this._isParallel(src_rot, trgt_rot)) {
			return 'false';
		}

		var rev_bet_rot = reverseAngle(bet_rot);

		if(this._isParallel(src_rot, bet_rot, src_vel)) {
			if(this._isParallel(trgt_rot, bet_rot, src_vel)) {
				return 'rear';
			}
		} else if(this._isParallel(src_rot, rev_bet_rot, src_vel)) {
			if(this._isParallel(trgt_rot, rev_bet_rot, src_vel)) {
				return 'front';
			}
		} else {
			return 'false';
		}
	},
	
	_getAngleTole: function(vel) {
		if(vel > 30) {
			var c_vel = vel * 5 / 18;
			var r = 0.8493 * c_vel * c_vel - 8.0045 * c_vel + 39.091;
			return c_vel / r;
		} else {
			return 0.122173;
		}				
	},

	_isParallel: function(angle1, angle2, vel) {
		var diff = normalizeAngle(angle1 - angle2);
		var angle_tole = this._getAngleTole(vel)

		if(diff < angle_tole || diff > (Math.PI * 2 - angle_tole)) {
			return true;
		} else {
			return false;
		}
	}
};