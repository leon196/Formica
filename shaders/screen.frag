
uniform sampler2D uPainting, uBuffer;

varying vec2 vUv;

void main(void)
{
   vec4 color = texture2D(uBuffer, vUv);
   gl_FragColor = color;
}