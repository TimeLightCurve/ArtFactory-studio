    varying vec2 vUv;
    varying vec3 vPosition;
    varying float vTime;
    uniform float uTime;
    uniform float uProgress;
    
    void main() {
      vUv = uv;
      vPosition = position;
      vTime = uTime;
      
      vec3 pos = position;
      
      // Create papyrus texture displacement
      float noise = sin(pos.x * 50.0 + uTime * 0.5) * sin(pos.y * 30.0 + uTime * 0.3) * 0.02;
      pos += normal * noise * uProgress;
      
      // Add wall-like roughness
      float wallRoughness = sin(pos.x * 100.0) * sin(pos.y * 80.0) * 0.01 * uProgress;
      pos += normal * wallRoughness;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }