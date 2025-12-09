    varying vec2 vUv;
    varying vec3 vPosition;
    varying float vTime;
    varying vec3 vNormal;
    varying float vElevation;

    uniform float uTime;
    uniform float uProgress;
    
    uniform float uBigWavesElevation ;
    uniform vec2 uBigWavesFrequency ;
    uniform float uBigWavesSpeed ;
    uniform float uSmallWavesElevation ;
    uniform float uSmallWavesFrequency ;
    uniform float uSmallWavesSpeed ;
    uniform float uSmallIterations ;

    #include "../includes/perlinClassic3D.glsl";

    
    float waveElevation(vec3 position) {

          float elevation = sin(position.x * (2.0 * uv.x - 1.0)  * 2.1 * uBigWavesFrequency.x + uTime * uBigWavesSpeed * 1.2) *
                            sin(position.x * uBigWavesFrequency.x + uTime * uBigWavesSpeed) *
                            sin(position.y * uBigWavesFrequency.y + uTime * uBigWavesSpeed) *
                            sin(position.y * ( 2.0 * uv.x - 1.0)  * 1.5 * uBigWavesFrequency.x + uTime * uBigWavesSpeed) *
                            sin(position.y * ( 2.0 * position.x - 1.0)  * 0.3 * uBigWavesFrequency.x + uTime * uBigWavesSpeed) *
                            uBigWavesElevation;

          for(float i = 1.0; i <= uSmallIterations; i++)
          {
              elevation -= abs(perlinClassic3D(vec3(position.xz * uSmallWavesFrequency * i, uTime * uSmallWavesSpeed)) * uSmallWavesElevation / i);
          }

          return elevation;
      }

    void main() {
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float shift = 0.01;
    vec3 modelPositionA = modelPosition.xyz + vec3(shift, 0.0, 0.0);
    vec3 modelPositionB = modelPosition.xyz + vec3(0.0, - shift, 0.0);

    // Elevation
    float elevation = waveElevation(modelPosition.xyz);
    float elevationA = waveElevation(modelPositionA);
    float elevationB = waveElevation(modelPositionB);
    
    modelPosition.z += elevation;
    modelPositionA.z += elevationA;
    modelPositionB.z += elevationB;

    // Compute normal
    vec3 toA = normalize(modelPositionA - modelPosition.xyz);
    vec3 toB = normalize(modelPositionB - modelPosition.xyz);
    vec3 computedNormal = cross(toA, toB);

    // Final position
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    // Varyings
    vElevation = elevation;
    vNormal = computedNormal;
    vPosition = modelPosition.xyz;
    }