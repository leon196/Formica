
#define PI2 3.14159/2.

uniform vec2 uResolution, uPaintingResolution;
uniform vec2 uPosition;
uniform float uRotation;

varying vec2 vUv;

mat2 rot (float a) {
	float c=cos(a),s=sin(a);
	return mat2(c,-s,s,c);
}

void main(void)
{
	vUv = uv;
	
	vec2 p = uv;
	p -= uPosition / uPaintingResolution;
	p *= rot(uRotation-PI2);
	p.x *= uResolution.y/uResolution.x;
	p.x *= uPaintingResolution.x/uPaintingResolution.y;
	p *= 10.;

	gl_Position = vec4( p, 0.9, 1 );
}