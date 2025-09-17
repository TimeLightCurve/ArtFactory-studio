
uniform float uProgress;
uniform float uTime;
uniform float uVelocity;


varying vec2 vUv;
varying vec3 vPos;
varying vec3 vModelPosition;



float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}


void main() {

	vec3 pos = position;
	// pos.y += 10.0 *( 0.5 ) * ( 1.0 - uProgress1 );
	// pos.x += vUv.y * 0.5 * (1.0 - uProgress1);

	// vec4 modelPosition = modelMatrix * vec4(pos, 1.0);

	// modelPosition.y += sin(modelPosition.y * 0.5 + uTime * 4.0 ) * 10.5 * ( 1.0 - uProgress2 );
	// pos.y += sin( 0.5 * pos.x + uTime * 0.2  ) * 0.05 ;
	// pos.y += sin( 1.5 * pos.x + uTime * 0.5 + 20.0  ) * 0.02;
	// pos.x += sin( 500.5 * pos.y * vUv.x + uTime * 0.2  ) * 0.2 ;
	// modelPosition.x += -5.0 * ( 1.0 - uProgress1);

	// float velocityEffect = clamp(uVelocity / 2.0, -1.0, 1.0);
	float velocityEffect = map(uVelocity, -20.0, 20.0, 0.0, 1.0);
	// velocityEffect = abs(velocityEffect );
	velocityEffect = pow(velocityEffect, 2.0);
	velocityEffect = smoothstep(0.0,1.0,velocityEffect);

	vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
	modelPosition.z += (1.0 - smoothstep(0.0,1.0,abs(modelPosition.x * 0.07))) * .7 * velocityEffect;

	gl_Position = projectionMatrix * viewMatrix * modelPosition; 

	//varyings
	vUv = uv;
	vPos = pos;
	vModelPosition = modelPosition.xyz;
}