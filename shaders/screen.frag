
uniform sampler2D uPainting, uBuffer, uWin;
uniform vec2 uPaintingResolution, uWinPosition;
uniform float uPlayerWin;

varying vec2 vUv;

float luminance (vec3 color) {
	return (color.r+color.b+color.g)/3.;
}

void main(void)
{
   vec4 color = mix(texture2D(uBuffer, vUv), texture2D(uPainting, vUv), smoothstep(.9, 1., uPlayerWin));
   vec2 uv = vUv;
   uv.x *= uPaintingResolution.x/uPaintingResolution.y;
   vec2 winPosition = uWinPosition/uPaintingResolution;
   winPosition.y = 1.-winPosition.y;
   uv -= winPosition;
   uv *= 8.;
   uv += .5;
   vec4 win = texture2D(uWin, uv);
   color = mix(color, win, win.a * step(.01,uPlayerWin) * (1.-smoothstep(.1,.2,uPlayerWin)));
   gl_FragColor = color;
}