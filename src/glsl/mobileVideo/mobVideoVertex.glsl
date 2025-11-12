precision mediump float;
precision mediump int;


uniform float uProgress;
uniform float uClickedValue;
uniform float uExpandedValue;
uniform vec2 uUVOffset; 
uniform vec2 uUVRepeat;

varying vec2 vUv;
varying vec3 vPos;
varying vec3 vModelPosition;
varying vec2 vUvTransformed;



float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}


void main() {

	vec3 pos = position;
	// pos.y += 10.0 *( 0.5 ) * ( 1.0 - uProgress1 );
	// pos.x += vUv.y * 0.5 * (1.0 - uProgress1);
	
	pos.y -= 0.1 * ( 1.0 - pow(uClickedValue, 0.5));
	// pos.y += 0.3 ;

  	pos.xy *= vec2(1.0, uUVRepeat.y);

	// vec4 modelPosition = modelMatrix * vec4(pos, 1.0);

	// modelPosition.y += sin(modelPosition.y * 0.5 + uTime * 4.0 ) * 10.5 * ( 1.0 - uProgress2 );
	// pos.y += sin( 0.5 * pos.x + uTime * 0.2  ) * 0.05 ;
	// pos.y += sin( 1.5 * pos.x + uTime * 0.5 + 20.0  ) * 0.02;
	// pos.x += sin( 500.5 * pos.y * vUv.x + uTime * 0.2  ) * 0.2 ;
	// modelPosition.x += -5.0 * ( 1.0 - uProgress1);

	// float velocityEffect = clamp(uVelocity / 2.0, -1.0, 1.0);
	// float velocityEffect = map(uVelocity, -20.0, 20.0, 0.0, 1.0);
	// // velocityEffect = abs(velocityEffect );
	// velocityEffect = pow(velocityEffect, 2.0);
	// velocityEffect = smoothstep(0.0,1.0,velocityEffect);

	vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
	// modelPosition.y += 0.2 * uExpandedValue;

	// modelPosition.y += 2.28 * ( 1.0 - pow(uClickedValue, 0.5));
	// modelPosition.z += (1.0 - smoothstep(0.0,1.0,abs(modelPosition.x * 0.07))) * .9 * velocityEffect;

	gl_Position = projectionMatrix * viewMatrix * modelPosition; 

	//varyings
	vUv = uv;
	vPos = pos;
	vModelPosition = modelPosition.xyz;
	vUvTransformed = uv * uUVRepeat + uUVOffset;

}