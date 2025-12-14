precision highp float;

uniform sampler2D uMap;
uniform float uIndex;

// Time uniforms
uniform float uTime;
uniform float uStartTime;
uniform float uDuration;
uniform float uTriggered;
uniform float uNameOnly;
uniform float uColorTransition;

// Corner controls (UV space units, 0..1)
uniform float uCornerLen;    // e.g. 0.12
uniform float uCornerThick;  // e.g. 0.012
uniform float uCornerAlpha;  // e.g. 0.9
uniform float uAspect;        // plane width / height

varying vec2 vUv;
varying float vNDCY;

// Smooth rectangle mask (anti-aliased)
float rectAA(vec2 uv, vec2 uvMin, vec2 uvMax, float feather) {
  vec2 a = smoothstep(uvMin, uvMin + vec2(feather), uv);
  vec2 b = 1.0 - smoothstep(uvMax - vec2(feather), uvMax, uv);
  return a.x * a.y * b.x * b.y;
}

// L-shaped corner composed of two AA rectangles
float cornerMask(vec2 uv, vec2 lo, vec2 hi, bool top, bool left, float len, float thick, float feather) {
  // Convert desired world-like lengths into UV units per axis
  float Lx = len / max(uAspect, 1e-6);
  float Ly = len;
  float Tx = thick / max(uAspect, 1e-6);
  float Ty = thick;

  float m = 0.0;

  if (top && left) {
    // top-left
    // horizontal bar
    m += rectAA(uv, vec2(lo.x,      hi.y - Ty), vec2(lo.x + Lx, hi.y), feather);
    // vertical bar
    m += rectAA(uv, vec2(lo.x,      hi.y - Ly), vec2(lo.x + Tx, hi.y), feather);
  } else if (top && !left) {
    // top-right
    m += rectAA(uv, vec2(hi.x - Lx, hi.y - Ty), vec2(hi.x,      hi.y), feather);
    m += rectAA(uv, vec2(hi.x - Tx, hi.y - Ly), vec2(hi.x,      hi.y), feather);
  } else if (!top && left) {
    // bottom-left
    m += rectAA(uv, vec2(lo.x,      lo.y),      vec2(lo.x + Lx, lo.y + Ty), feather);
    m += rectAA(uv, vec2(lo.x,      lo.y),      vec2(lo.x + Tx, lo.y + Ly), feather);
  } else {
    // bottom-right
    m += rectAA(uv, vec2(hi.x - Lx, lo.y),      vec2(hi.x,      lo.y + Ty), feather);
    m += rectAA(uv, vec2(hi.x - Tx, lo.y),      vec2(hi.x,      lo.y + Ly), feather);
  }

  return clamp(m, 0.0, 1.0);
}

void main() {
  // Pure time-based after trigger
  float progress = clamp((uTime - uStartTime) / max(uDuration, 0.0001), 0.0, 1.0);
  
  // Animate 0->1 if triggered (expand), 1->0 if not triggered (contract)
  float enter = mix(1.0 - progress, progress, uTriggered);

  // Corners first, image after
  float sCorners = mix(0.96 * ( 1.0 - uNameOnly * 1.0), 1.0, smoothstep(-0.2, 0.85, enter));
  float sImage   = mix(0.98 * ( 1.0 - uNameOnly * 1.0), 0.9, smoothstep(0.20, 1.00, enter));
  float eImage   = mix(0.98 * ( 1.0 - uNameOnly * 1.0), 1.0, smoothstep(0.30, 1.00, enter));

  vec2 center = vec2(0.0);
  vec2 uvImg = (vUv - center) / max(sImage, 1e-3) + center;  // not used further, kept for clarity
  vec2 uvCor = (vUv - center) / sCorners + center;
  vec2 uv    = (vUv - center) / max(eImage, 1e-3) + center;
  // vec2 uvImg = (vUv - center) / max(1.0, 1e-3) + center;  // not used further, kept for clarity
  // vec2 uvCor = (vUv - center) / sCorners + center;
  // vec2 uv    = (vUv - center) / max(1.0, 1e-3) + center;

  vec2 uvChanged = vUv * 1.05 - vec2(0.025, 0.025);
  vec4 img = texture2D(uMap, uvChanged);

  float L = uCornerLen;
  float T = uCornerThick;
  float F = 0.0;

  vec2 lo = vec2(0.0);
  vec2 hi = vec2(1.0);

  float c = 0.0;
  c += cornerMask(uvCor, lo, hi, true,  true,  L, T, F);
  c += cornerMask(uvCor, lo, hi, true,  false, L, T, F);
  c += cornerMask(uvCor, lo, hi, false, true,  L, T, F);
  c += cornerMask(uvCor, lo, hi, false, false, L, T, F);
  c = clamp(c, 0.0, 1.0) * uCornerAlpha;

  vec4 borderColor = mix(vec4(1.0), vec4(0.0, 0.0, 0.0, 1.0), uColorTransition);

  img.a = mix(1.0, 0.0, 1.0 - rectAA(uv, vec2(0.02), vec2(0.98), 0.0)) * ( 1.0 - pow(uNameOnly, 4.0));
  vec4 color = mix(img, borderColor, c);
  gl_FragColor = color;
  
  
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}