
uniform sampler2D uPainting, uBuffer, uWin;
uniform vec2 uPaintingResolution, uWinPosition;

varying vec2 vUv;

void main(void)
{
   vec4 color = texture2D(uBuffer, vUv);
   // vec2 winPosition = uWinPosition/uPaintingResolution;
   // vec2 uv = vUv;
   // uv -= winPosition;
   // uv *= .1;
   // vec4 win = texture2D(uWin, uv);
   // color = mix(color, win, win.a);
   gl_FragColor = color;
}