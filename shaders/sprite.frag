
uniform sampler2D uSprite;

varying vec2 vUv;

void main(void)
{
   vec4 color = texture2D(uSprite, vUv);
   gl_FragColor = color;
}