
#define PI2 3.14159/2.
#define TAU 3.14159*2.

uniform vec2 uResolution;
uniform float uRotation, uJump, uDistanceTotal, uPlayerWin;

varying vec2 vUv;

mat2 rot (float a) {
	float c=cos(a),s=sin(a);
	return mat2(c,-s,s,c);
}

void main(void)
{
	vUv = uv;

	vec2 p = uv * 2. - 1.;
	
	p *= 1.*(1.-uPlayerWin);
	p *= rot(mix(0., -mod(uRotation-PI2, TAU), uPlayerWin));

	p *= rot(sin(uv.y*2. + uDistanceTotal * .03)*.3);
	p.x *= uResolution.y/uResolution.x;
	p *= .1;
	p.x *= 1.+.5*sin(uJump * 3.14159);
	p.y *= 1.+1.*sin(uJump);


	gl_Position = vec4( p, 0, 1 );
}