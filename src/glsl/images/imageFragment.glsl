
uniform float uProgress;
uniform vec3 uResolution;
uniform sampler2D uImage1Tex;
uniform float uTime;
uniform float uAlpha;
uniform float uVelocity;

varying vec2 vUv;
varying vec3 vPos;
varying vec3 vModelPosition;

#include "lygia/generative/psrdnoise.glsl"
#include "lygia/math/aastep.glsl"



float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}



void main() {


	float time = uTime ;

    // vec4 color = vec4(vec3(0.0), 1.0);
    vec2 pixel = 1.0/uResolution.xy;
    vec2 st = gl_FragCoord.xy * pixel;

	vec3 imageTexture = texture(uImage1Tex, vUv).rgb ;
	// // vec3 image2Texture = texture(uImage2Tex, vUv).rgb ;

	// // vec4 l1 = vec4(pattern.xyz , 1.0);
	vec4 l1 = vec4(imageTexture , 1.0 );


	float nscale = 1.0;
    vec2 v = nscale * (st) + vec2(vModelPosition.x * 3.0 + 0.2 * time, vModelPosition.y * 3.2 + 0.1 * time);
    vec2 p = vec2(0.0, 0.0);
    float alpha = time;
    vec2 g;
     
    float n = psrdnoise(v, p, alpha, g);
  
    vec3 bgcolor = vec3(0.5, 0.5, 0.5);
    vec3 xcolor = vec3(1.0, 1.0, 1.0);
    // vec3 ycolor = vec3(0.7, 0.7, 0.7);
    vec3 pattern = mix(bgcolor, xcolor, g.x);
	pattern.x = map(pattern.x, -2.0, 1.0, 0.0, 1.0);
	// pattern = clamp(pattern, 0.0, 1.0);

	float velocityEffect = map(uVelocity, -20.0, 20.0, 0.0, 1.0);
	velocityEffect = pow(velocityEffect, 2.0);
	velocityEffect = smoothstep(0.0,1.0,velocityEffect) * 5.0;



	// float width = 0.5;
	// // float p1 = min(smoothstep(-10.0,20.0,( vModelPosition.x + 12.0)),
	// //  1.0 - smoothstep(-10.0, 40.0,( vModelPosition.x + 20.0)));

	// float p1 = (1.0 + 2.0 * vUv.x * vUv.x) * min(smoothstep(-10.0,0.0,( vModelPosition.x * 4.0 + 12.0 -velocityEffect* 0.6)),
	// 1.0 - smoothstep(0.0,12.0,( vModelPosition.x - 3.5 -velocityEffect* 0.3)));

	// // p1 = map(p1 ,0.0, 1.0, -width , 1.0 );
    // // Per-layer edge noise to roughen the transition boundary
    // // float n1 = fbm(vUv  + vec2(10.0, 3.0) + uTime ) * 2.0 - 1.0;
    // // float axis1 = 1.0 + 2.0 * vUv.x * vUv.x ;
    // p1 = smoothstep(p1- width , p1, vUv.x);
	// p1 = clamp(p1 , 0.0, 1.0);
	// float mix1 = 2.5 * p1 - pattern.x ;
	// mix1 = clamp(mix1 , 0.0, 1.0);


	// vec4 layer0 = mix(vec4(0), l1, mix1);
	// // vec4 layer3 = mix(layer0, l4, 1.0 - mix4);

	// // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);

    // // gl_FragColor = pattern;
    vec4 layer0 = vec4(imageTexture, 1.0);
	// layer0.a *= mix(layer0.a, 0.01, mix1);
	// layer0.a *= (1.0 - mix1);

	layer0.a *= (uProgress * uProgress  * 2.0 - uAlpha);
	// // layer0.a *= (1.0 - smoothstep(0.0,1.0,abs(vModelPosition.x * 0.1)));
	// // layer0.a *= (0.00 + 1.0 * min(smoothstep(0.0,0.5,(vModelPosition.x -0.25) * (vModelPosition.x  -0.25)),
	// // 1.0 - smoothstep(0.0,5.0,(vModelPosition.x + 5.0) * (vModelPosition.x + 5.0))));

	// float velocityEffect = map(uVelocity, -20.0, 20.0, 0.0, 1.0);
	// // velocityEffect = abs(velocityEffect );
	// velocityEffect = pow(velocityEffect, 2.0);
	// velocityEffect = smoothstep(0.0,1.0,velocityEffect) * 5.0;

	layer0.a *=  (2.0 + 2.5 * vUv.x * vUv.x) * min( smoothstep(0.0,600.0,( vModelPosition.x -29.0 -velocityEffect* 0.6) * (vModelPosition.x  -29.0 -velocityEffect * 0.3) ),
	(1.0 - smoothstep(-200.0,600.0,( vModelPosition.x - 8.0 -velocityEffect * 0.2) * (vModelPosition.x  - 8.0 - velocityEffect  * 0.3))));
    gl_FragColor = layer0;
    // gl_FragColor = vec4(vec3(p2), 1.0);
    // gl_FragColor = vec4(d3,1.0);



   

	// #include <tonemapping_fragment>
    // #include <colorspace_fragment>
}