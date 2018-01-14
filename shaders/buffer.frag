
uniform sampler2D uPainting, uBuffer;
uniform vec2 uResolution, uPaintingResolution;
uniform vec2 uPosition;
uniform float uRotation;

varying vec2 vUv;

float luminance (vec3 color) {
	return (color.r+color.b+color.g)/3.;
}

void main(void)
{
	vec2 uv = vUv;
	vec4 frame = texture2D(uBuffer, uv);
	vec4 paint = texture2D(uPainting, vUv);
	float angle = luminance(paint.rgb) * 3.14159 * 2.;
	uv += vec2(cos(angle),sin(angle))*.01;
	float dist = length(uPosition/uPaintingResolution-uv);
	vec4 color = mix(frame, paint, (1.-smoothstep(.0,.1,dist)) * .05);
	gl_FragColor = color;
}