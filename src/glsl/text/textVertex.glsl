uniform float uIndex;
uniform float uImageHeight;
uniform float uTotalHeight;
uniform float uStackScale;
uniform float uScroll;
uniform float uStartTime;
uniform float uDuration;
uniform float uTime;
uniform float uTriggered;


varying vec2 vUv;
varying float vNDCY;

void main() {
  vUv = uv;

  float progress1 = clamp((uTime - (uStartTime + 0.1)) / max(1.4, 0.0001), 0.0, 1.0);
  progress1 = smoothstep(0.0, 1.0,  uTriggered * progress1);

  float progress2 = clamp((uTime - (uStartTime + 0.1)) / max(1.8, 0.0001), 0.0, 1.0);
  progress2 = smoothstep(0.0, 1.0,  uTriggered * progress2);  

 float progress = clamp((uTime - uStartTime) / max(uDuration, 0.0001), 0.0, 1.0);
  // Animate 0->1 if triggered (expand), 1->0 if not triggered (contract)
  float enter = mix(1.0 - progress, progress, uTriggered);

  float columnChecker = mod(uIndex, 2.0);
  columnChecker = smoothstep(0.0, 1.0, pow(columnChecker, 0.2));
  vec3 transformed = position;

  float smoothedScale = pow(smoothstep(1.0, 2.0, uStackScale), 2.0);

  transformed.y += 0.1 *( 0.5 + uv.x) * ( 1.0 - progress2 );
	transformed.x += vUv.y * 0.1 * (1.0 - progress2);

	transformed.y += sin(transformed.y * 0.2 + uTime * 4.0 ) * 0.1 * ( 1.0 - progress2 );
	transformed.x += sin(transformed.y* 0.2 + uTime * 2.0 ) * 0.1 * (1.0 - progress2 );
	transformed.x += -0.8 * ( 1.0 - progress1);

  

  float scrollDirection = 1.0;
  float pingpong = smoothstep(-1.0, 1.0, pow(abs(uIndex), 0.95)) ;

  // Corners first, image after

float enterAnimation = mix(0.0, 1.0, smoothstep(-1.0, 0.98, enter)); 
  transformed.x += (1.0 - enterAnimation) * -0.8  * scrollDirection;
  transformed.z += enterAnimation * 3.3;
  // transformed.y -= uTotalHeight - uImageHeight * 0.0 - pow(smoothedScale, 4.0) * (uImageHeight * 0.5 * columnChecker);
  // transformed.y -= uTotalHeight;
  // transformed.x += pow(smoothedScale, 2.0) * (columnChecker * 2.0 - 1.0) ;
  // transformed.z += (mod(uIndex, 5.0) * 0.6 - 0.8)  ;
  // Apply scroll in shader with easing 
  // transformed.y -= uScroll ;

  // transformed.z += (1.0 - enterAnimation) * 0.6  * scrollDirection * pow(uv.x, 2.0) + uIndex * 0.1 * pingpong;
  // transformed.z +=  uIndex * 0.1 * pingpong;


  // transformed.y -= uScroll;

  // Compute the plane center's NDC.y
  vec3 centerTransformed = vec3(0.0,-1.0,0.0);
  centerTransformed.y -= uTotalHeight;
  // centerTransformed.x += pow(smoothedScale, 2.0) * (columnChecker * 2.0 - 1.0);
  centerTransformed.y -= uScroll; // match scroll
  vec4 clipCenter = projectionMatrix * modelViewMatrix * vec4(centerTransformed, 1.0);
  vNDCY = clipCenter.y / clipCenter.w;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
}