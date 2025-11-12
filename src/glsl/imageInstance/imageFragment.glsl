    varying vec2 vUv;

    uniform sampler2D uMap;
    uniform float uOpacity;


    void main() {
      vec4 tex = texture2D(uMap, vUv);
      gl_FragColor = vec4(tex.rgb, tex.a * uOpacity);

    }