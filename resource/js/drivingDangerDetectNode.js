function DrivingDangerDetectNode(options) {
	this._$init.apply(this, arguments);
}

DrivingDangerDetectNode.prototype = {
	_$init: function(options) {
		if(options == undefined) {
			options = {};
		}
		this._cluster_list = options.cluster_list || [];
		this._idle_time = options.idle_time || 0.2;
		this._dist_scale = options.dist_scale || 5;
		
	},
	
	init: function() {
		this._cluster_list = [];
	},
	
	setClusterList: function(cluster_list) {
		this._cluster_list = cluster_list;
	},
	
	transfer: function(victim_cluster, killer_cluster, degree) {
		console.log(victim_cluster.last.name + ' <- ' + killer_cluster.first.name + ' / ' + degree);
	},
	
	detect: function() {
		var cluster_list = this._cluster_list;
		for(var i = 0; i < cluster_list.length; i ++) {
			for(var j = i + 1; j < cluster_list.length; j ++) {
				var degree = this._isEffective(cluster_list[i], cluster_list[j]);
				if(!(degree == 'false')) {
					this.transfer(cluster_list[i], cluster_list[j], degree);
				} else {
					degree = this._isEffective(cluster_list[j], cluster_list[i]);
					if(!(degree == 'false')) {
						this.transfer(cluster_list[j], cluster_list[i], degree);
					}
				}
			}
		}
	},
	
	_isEffective: function(victim_cluster, killer_cluster) {
		var victim = victim_cluster.last;
		var killer = killer_cluster.first;
		
		// is in caution distance
		var bet_dst = distanceBetween(victim.sprite, killer.sprite);
		var caution_dst = this._getCautionDst(killer.vel);
		if(bet_dst > caution_dst) {
			return 'false';
		}

		// 
		var victim_rot = victim.sprite.rotation;
		var killer_rot = killer.sprite.rotation;
		var diff_rot = angleBetween(killer.sprite, victim.sprite);
		if(!this._isEffectiveAngle(victim_rot, killer_rot, diff_rot)) {
			return 'false';
		}
		
		if(victim.vel >= killer.vel) {
			return 'false';
		}
		
		var danger_dst = this._getDangerDst(victim.vel, killer.vel);
		if(bet_dst < danger_dst) {
			return 'danger';
		} else {
			return 'caution';
		}
		
	},
	
	_getDangerDst: function(victim_vel, killer_vel) {
		var c_victim_vel = victim_vel * 5 / 18;
		var c_killer_vel = killer_vel * 5 / 18;
		var accel = this._getEffectiveAccel(killer_vel);
		var height = (c_victim_vel - c_killer_vel) / accel;
		
		return (c_victim_vel + c_killer_vel) * height / 2 + this._idle_time * c_killer_vel * this._dist_scale;
		
	},
	
	_getCautionDst: function(vel) {
		var c_vel = vel * 5 / 18;
		var accel = Math.abs(this._getEffectiveAccel(vel));
		
		return (c_vel * c_vel) / (2 * accel) + this._idle_time * c_vel * this._dist_scale;
	},
	
	_getEffectiveAccel: function(vel) {
		if(vel <= 60) {
			return (-0.04641) * vel - 0.1718;
		} else {
			return (-0.0003439) * vel * vel + 0.0856 * vel - 6.854;
		}
	},
	
	_isEffectiveAngle: function(victim_rot, killer_rot, diff_rot) {
		var tri_sec_rot = normalizeAngle(victim_rot - diff_rot);
		var effective_rot = normalizeAngle(diff_rot - killer_rot);
		if(tri_sec_rot > (Math.PI / 6) && tri_sec_rot < (Math.PI / 2)) {
			// killer is at right-directed behind of victim
			if(effective_rot > (Math.PI * 7 / 4)) {
				return true;
			}
		} else if (tri_sec_rot > (Math.PI * 3 / 2) && tri_sec_rot < (Math.PI * 11 / 6)) {
			// killer is at left behind of victim
			if(effective_rot < (Math.PI / 4)) {
				return true;
			}
		} else if (tri_sec_rot <= (Math.PI / 6) || tri_sec_rot >= (Math.PI * 11 / 6)) {
			// killer is at right behind back of the victim
			if(effective_rot < (Math.PI / 8) || effective_rot > (Math.PI * 15 / 8)) {
				return true;
			}
		}
		
		return false;
	}
	
};