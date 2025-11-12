precision mediump float;
precision mediump int;

uniform float uProgress;
uniform vec3 uResolution;
uniform sampler2D uImage1Tex;
uniform float uClickedValue;
uniform float uFishEyeValue;
uniform float uExpandedValue;
uniform vec2 uUVOffset; 
uniform vec2 uUVRepeat;

varying vec2 vUv;
varying vec3 vPos;
varying vec3 vModelPosition;
varying vec2 vUvTransformed;

// #include "lygia/generative/psrdnoise.glsl"
// #include "lygia/math/aastep.glsl"


#define INTENSITY 3.0

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

vec3 checker(vec2 uv){
 	return vec3(abs(floor(mod(uv.x*10.,2.))-floor(mod(uv.y*10.,2.))));   
}

void main() {

	// float time = uTime ;

    // vec2 pixel = 1.0/uResolution.xy;
    // vec2 st = gl_FragCoord.xy * pixel;

	// vec2 uv = gl_FragCoord.xy / uResolution.xy;

	// vec2 uv = vUv;

    //uv.x *= iResolution.x/iResolution.y;
    // uv = (uv - 0.0) * 0.5;
        
   	// float t = time * SPEED;
    
    // vec2 fishuv;
    // float fishyness = (0.1 + 0.1 * (uProgress - 1.0) * (uFishEyeValue + 1.0)) * INTENSITY;
    // fishuv.x = (0.5 - uv.y*uv.y) * fishyness * uv.x;
    // fishuv.y = (0.5 - uv.x*uv.x) * fishyness * uv.y;
    
    // // Fisheye Chromatic Aberration !
    // float cr = texture(uImage1Tex, uv - fishuv * 0.92).x;
    // vec2 cgb = texture(uImage1Tex, uv - fishuv * 0.99).yz;
    // vec3 c = vec3(cr, cgb);
    
    // // Vignetting
    // float uvMagSqrd = dot(uv,uv);
    // float vignette = 0.0 * uFishEyeValue + 1.0 - uvMagSqrd * fishyness;
    // c *= vignette;


    vec2 baseUv = vUvTransformed;
    vec2 windowCenter = uUVOffset + 0.5 * uUVRepeat;

    vec2 finalUv = baseUv;

    if (uFishEyeValue > 1e-4) {
        // work in a centered space around the cropped window
        vec2 p = (vUv - windowCenter);

        const float BARREL = -1.0;
        const float PINCUSHION = 4.1;
        float effect = PINCUSHION;
        float effect_scale = 2.8;

        float d = length(p) * uFishEyeValue;                   
        float z = sqrt(1.0 + d * d * effect);
        float r = atan(d, z) / 3.14159;
        r *= effect_scale;
        float phi = atan(p.y, p.x);

        vec2 uvFish = vec2(r * cos(phi), r * sin(phi)) + windowCenter;

        // Smoothly blend original vs fisheye
        finalUv = mix(baseUv, uvFish, clamp(uFishEyeValue, 0.0, 1.0));
    }


	vec3 imageTexture = texture(uImage1Tex, finalUv).rgb ;



    vec4 layer0 = vec4(imageTexture, 1.0);
    // vec4 layer0 = vec4(c, 1.0);

	

	// layer0.a *=  pow(3.2 - abs(distance(vModelPosition, vec3(0))), 3.0)  ;
	layer0.a *=  pow( smoothstep(0.0, 1.15 ,(1.8 + uClickedValue * 3.8) - abs(distance(vModelPosition, vec3(0)))), 1.0)  ;
	layer0.a *= pow(1.0 - uProgress, 2.0) - abs(vModelPosition.y) * uProgress;

    gl_FragColor = layer0; 
    // gl_FragColor = vec4(vec3(p2), 1.0);
    // gl_FragColor = vec4(d3,1.0);


	// #include <tonemapping_fragment>
    // #include <colorspace_fragment>
}