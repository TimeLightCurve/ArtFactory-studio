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

  float progress1 = clamp((uTime - (uStartTime + 0.1)) / max(2.2, 0.0001), 0.0, 1.0);
  progress1 = smoothstep(0.0, 1.0,  uTriggered * progress1);

  float progress2 = clamp((uTime - (uStartTime + 0.1)) / max(2.0, 0.0001), 0.0, 1.0);
  progress2 = smoothstep(0.0, 1.0,  uTriggered * progress2);  


  float columnChecker = mod(uIndex, 2.0);
  columnChecker = smoothstep(0.0, 1.0, pow(columnChecker, 0.2));
  vec3 transformed = position;

  float smoothedScale = pow(smoothstep(1.0, 2.0, uStackScale), 2.0);

  transformed.y += sin(transformed.y * 0.2 + uTime * 0.5 ) * 0.2 * ( 1.0 - progress2 );
	transformed.x += sin(transformed.y* 0.2 + uTime * 0.4 ) * 0.32 * (1.0 - progress2 );
	// transformed.z +=  mod(uIndex, 8.0) * 0.05 * ( 1.0 - progress1);

  // transformed.y -=  - pow(smoothedScale, 4.0) * (uImageHeight * 0.5 * columnChecker);
  // transformed.y -= uTotalHeight;
  // transformed.x += pow(smoothedScale, 2.0) * (columnChecker * 2.0 - 1.0);

  // Apply scroll in shader with easing 
  // transformed.y -= uScroll;


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