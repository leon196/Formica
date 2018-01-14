
uniform vec2 uResolution, uPaintingResolution;
varying vec2 vUv;

void main(void)
{
	vUv = uv;

	vec2 p = uv;
	p.x *= uResolution.y/uResolution.x;
	p.x *= uPaintingResolution.x/uPaintingResolution.y;
	p *= .25;
	p -= 1.;
	// p.x -= 1.-uPaintingResolution.x/uResolution.x;

	gl_Position = vec4( p, .2, 1 );
}