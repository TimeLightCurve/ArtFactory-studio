varying vec2 vUv;
 varying vec3 vPosition;
 varying float vTime;
 uniform float uTime;
 uniform float uProgress;
 uniform vec3 uResolution;
 uniform float uHovered;
 // New interaction uniforms
 uniform vec2 uMouse;       // pixel space mouse
 uniform vec2 uMouseVel;    // pixel space velocity
 uniform float uMouseStrength; // global interaction strength
 uniform float uBoost; // boost effect for interaction

// (You can remove the psrdnoise include if unused now)
// #include "lygia/generative/psrdnoise.glsl"

// Cheap hash + value noise
float hash12(vec2 p){
    p = fract(p * 0.1031);
    p += dot(p, p.yx + 33.33);
    return fract((p.x + p.y) * p.x);
}

float valueNoise(vec2 p){
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f); // smoothstep
    float a = hash12(i);
    float b = hash12(i + vec2(1,0));
    float c = hash12(i + vec2(0,1));
    float d = hash12(i + vec2(1,1));
    return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
}

void main(){
    float time = uTime * 0.2;          // slow drift
    vec2 uv = vUv;                      // assuming vUv in [0,1]
    
    // Mouse (convert to uv space once)
    vec2 mouseUv = uMouse / uResolution.xy;
    vec2 dv = uv - mouseUv;
    float r2 = dot(dv,dv);
    
    // Soft influence (no sqrt/exp). Radius ~0.25
    float influence = smoothstep(0.35, 0.0, r2) * uMouseStrength;
    
    // Animated domain (two light octaves)
    float scale = 7.0;
    float n1 = valueNoise(uv * scale + vec2(time, 0.0));
    float n2 = valueNoise(uv * scale * 2.0 + vec2(0.0, time * 1.6));
    float n = mix(n1, n2, 0.35);
    
    // Calm near mouse: blend toward mid gray
    float mid = 0.45;
    n = mix(n, mid, influence);
    
    // Gentle contrast curve
    n = n * n * 1.1 + 0.02;
    
    // Final subtle fog tint
    vec3 base = vec3(0.02);
    vec3 fog = vec3(0.04) * n;
    vec3 color = base + fog;
    color = clamp(color, 0.0, 0.12);
    
    gl_FragColor = vec4(color * 0.4, 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}