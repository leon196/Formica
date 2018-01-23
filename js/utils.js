

	function lerp(v0, v1, t) {
		return v0*(1-t)+v1*t;
	}

	function closestPowerOfTwo (num) {
		return Math.pow(2, Math.ceil(Math.log(num) / Math.log(2)));
	}