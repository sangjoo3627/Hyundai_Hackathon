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