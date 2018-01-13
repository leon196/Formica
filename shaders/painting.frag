
uniform sampler2D uPainting;

varying vec2 vUv;

void main(void)
{
   vec4 color = texture2D(uPainting, vUv);
   gl_FragColor = color;
}