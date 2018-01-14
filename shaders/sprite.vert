
uniform vec2 uResolution;
uniform float uRotation;

varying vec2 vUv;

mat2 rot (float a) {
	float c=cos(a),s=sin(a);
	return mat2(c,-s,s,c);
}

void main(void)
{
	vUv = uv;

	vec2 p = uv * 2. - 1.;
	// p *= rot(uRotation);
	p.x *= uResolution.y/uResolution.x;
	p *= .1;

	gl_Position = vec4( p, 0, 1 );
}