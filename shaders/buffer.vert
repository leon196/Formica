
varying vec2 vUv;

void main(void)
{
	vUv = uv;

	gl_Position = vec4( vUv * 2. - 1., .5, 1 );
}