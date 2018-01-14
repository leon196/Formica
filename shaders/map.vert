
uniform vec2 uResolution, uPaintingResolution;
uniform float uPlayerWin;
varying vec2 vUv;

void main(void)
{
	vUv = uv;

	vec2 p = uv;
	p.x *= uResolution.y/uResolution.x;
	p.x *= uPaintingResolution.x/uPaintingResolution.y;
	p *= .25*(1.-smoothstep(0.,.1,uPlayerWin));
	p -= 1.;

	gl_Position = vec4( p, .2, 1 );
}