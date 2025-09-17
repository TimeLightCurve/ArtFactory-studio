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
   
/////////////////////////////////////////////
// fractional brownian motion ///////////////
/////////////////////////////////////////////

float random (in vec2 _st) {
    return fract(sin(dot(_st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

// Based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 _st) {
    vec2 i = floor(_st);
    vec2 f = fract(_st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

#define NUM_OCTAVES 1

float fbm ( in vec2 _st) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    // Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.5), sin(0.5),
                    -sin(0.5), cos(0.50));
    for (int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * noise(_st);
        _st = rot * _st * 2.0 + shift;
        a *= 0.7;
    }
    return v;
}
    
 void main() {
     float time = uTime; // time with boost effect

    

     // Base domain (scaled)
     vec2 st = gl_FragCoord.xy / uResolution.xy * 2.0;
     vec2 baseSt = st;

    // Normalized mouse in domain space (same scaling factor 4.0)
    vec2 mouseSt = (uMouse / uResolution.xy) * 4.0;
    // Distance & influence (area of calm). Increase multiplier to shrink radius
    float d = distance(st, mouseSt);
    float influence = exp(-d * 2.5) * uMouseStrength; // 0..~1

    // We'll keep original domain (no warp). We'll later attenuate detail & contrast near mouse.
    float t2 = time * 0.5 ; // unchanged time (could slow locally if desired)

     vec3 color = vec3(0.1);

     // fbm chains (use modified st; some use baseSt to keep structure)
     vec2 q = vec2(0.1);
     q.x = fbm( st + 0.05 * t2 );
     q.y = fbm( st + vec2(1.0));

     vec2 r = vec2(0.1);
     r.x = fbm( st + 1.0*q + vec2(1.7,9.2) + 0.15 * (t2 - uBoost * 10.8 ) );
     r.y = fbm( st + 1.0*q + vec2(8.3,2.8) + 0.526 *  (t2 - uBoost * 10.8 ) );

    float f = fbm(st + r);

    // Detail attenuation: compute a simple 'detail' component via higher freq diff
    float fHigh = fbm((st + r) * 2.8);
    float detail = fHigh - f * 1.2; // signed detail

    // Reduce detail & contrast near mouse: scale detail portion
    float reducedDetail = detail * (0.02 - influence* 8.0);
    float fFlattened = f + reducedDetail; // f with flattened detail near cursor

    // Additionally compress overall contrast near mouse (bring towards mid 0.5)
    float mid = 0.1;
    float fCalm = mix(fFlattened, mid + (fFlattened - mid) * 0.25, influence); // 25% contrast inside

    color = mix(vec3(.0),
                vec3(0.1,0.1,0.1),
                clamp((fCalm*fCalm)*4.0,0.0,1.0));

    color = mix(color,
                vec3(.0),
                clamp(length(q),0.0,1.0));

    //  vec3 hoverColor = mix( vec3(0.5,0.5,0.5), vec3(0.501961,0.219608,0.266667),uHovered);           

    color = mix(color,
               vec3(0.5,0.5,0.5),
            //    hoverColor,
                clamp(length(r.x),0.1,1.0));

    // Slight dimming inside influence to further emphasize calm (very subtle)
	color = clamp(color, 0.2, 0.5) +  vec3(0.05, 0.05, 0.05);
    color = mix(color, color, influence);


    vec4 pattern = vec4((fCalm*fCalm*fCalm + .1*fCalm*fCalm + .5*fCalm) * 0.9 * color, 1.0);
	pattern = clamp(pattern ,0.02, 0.3);
    // float limitTime = smoothstep(0.0, 150.0, uTime);
    // vec4 finalColor = mix(vec4(0.0), pattern, limitTime * (pattern* 2.5));
    gl_FragColor = pattern ;

    
	#include <tonemapping_fragment>
    #include <colorspace_fragment>
 }