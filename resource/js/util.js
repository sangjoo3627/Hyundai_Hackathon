

/*
 * Phaser Utils
 */
function angleBetween(source, target, world) {

	if (world === undefined) { world = false; }

	if (world)
	{
		return Math.atan2(target.world.y - source.world.y, target.world.x - source.world.x);
	}
	else
	{
		return Math.atan2(target.y - source.y, target.x - source.x);
	}

}
	
function distanceBetween(source, target, world) {

	if (world === undefined) { world = false; }

	var dx = (world) ? source.world.x - target.world.x : source.x - target.x;
	var dy = (world) ? source.world.y - target.world.y : source.y - target.y;

	return Math.sqrt(dx * dx + dy * dy);

}
	
	
function normalizeAngle(angleRad) {

	angleRad = angleRad % (2 * Math.PI);
	return angleRad >= 0 ? angleRad : angleRad + 2 * Math.PI;

}

function reverseAngle(angleRad) {

	return this.normalizeAngle(angleRad + Math.PI, true);

}

/*
 * Angle Manipulators
 * 	degree and radians
 */
function normalizeDegree(angleDeg) {
	var mod_angle = angleDeg % 360;
	if(mod_angle > 180) {
		mod_angle = mod_angle - 360;
	} else if (mod_angle <= -180) {
		mod_angle = mod_angle + 360;
	}

	return mod_angle;
}

function normalizeRadian(angleRad) {
	var mod_angle = angleRad % (Math.PI * 2);
	if(mod_angle > Math.PI) {
		mod_angle = mod_angle - (Math.PI * 2);
	} else if (mod_angle <= -Math.PI) {
		mod_angle = mod_angle + (Math.PI * 2);
	}

	return mod_angle;
}

function convertToRadian(angleDeg) {
	var norm_deg = normalizeDegree(angleDeg);
	return norm_deg * Math.PI / 180;
}

function convertToDegree(angleRad) {
	var norm_rad = normalizeRadian(angleRad);
	return norm_rad * 180 / Math.PI;
}