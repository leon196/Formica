
#define PI2 3.14159/2.
#define TAU 3.14159*2.

uniform vec2 uResolution, uPaintingResolution;
uniform vec2 uPosition;
uniform float uRotation, uScale, uPlayerWin;

varying vec2 vUv;

mat2 rot (float a) {
	float c=cos(a),s=sin(a);
	return mat2(c,-s,s,c);
}

void main(void)
{
	vUv = uv;
	
	vec2 p = uv;
	p.x *= uPaintingResolution.x/uPaintingResolution.y;
	p -= uPosition / uPaintingResolution;
	p *= rot(mix(mod(uRotation-PI2, TAU), 0., uPlayerWin));
	p.x *= uResolution.y/uResolution.x;
	p *= mix(uScale, 1.5, uPlayerWin);



	gl_Position = vec4( p, 0.9, 1 );
}