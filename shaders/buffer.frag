
#define TAU 3.14159 * 2.

uniform sampler2D uPainting, uBuffer;
uniform vec2 uResolution, uPaintingResolution;
uniform vec2 uPosition;
uniform float uRotation, uClear, uPlayerWin, uJump, uTime;

varying vec2 vUv;

float rand (vec2 seed) { return fract(sin(dot(seed*.1684,vec2(54.649,321.547)))*450315.); }

float luminance (vec3 color) {
	return (color.r+color.b+color.g)/3.;
}

void main(void)
{
	vec2 uv = vUv;
	vec4 frame = texture2D(uBuffer, uv);
	vec4 paint = texture2D(uPainting, vUv);
	float lum = luminance(paint.rgb);
	float angle = lum * TAU;
	uv += vec2(cos(angle),sin(angle))*.01;
	// angle = rand(uv) * TAU;
	// uv += vec2(cos(angle),sin(angle))*.01;
	float dist = length(uPosition/uPaintingResolution-uv);
	float range = .1+uPlayerWin*.5+ + clamp(uJump,0.,1.) * .1;
	float rangeMin = 0. + clamp(uJump,0.,1.) * .09;
	vec4 color = mix(frame, vec4(vec3(lum),1), (1.-smoothstep(rangeMin,range,dist)) * .05);
	color = mix(color, paint, (1.-smoothstep(rangeMin,range*.5,dist)) * .05);
	gl_FragColor = color * (1.-uClear);
}