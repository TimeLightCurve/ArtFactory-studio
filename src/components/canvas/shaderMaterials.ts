import { shaderMaterial } from "@react-three/drei"
import * as THREE from "three"

// @ts-expect-error
import artistVertex from "../../glsl/artists/artistVertex.glsl"
// @ts-expect-error
import artistFragment from '../../glsl/artists/artistFragment.glsl'

// @ts-expect-error
import textVertex from "../../glsl/text/textVertex.glsl"
// @ts-expect-error
import textFragment from "../../glsl/text/textFragment.glsl"

// @ts-expect-error
import studioVertex from "../../glsl/studio/studioVertex.glsl"
// @ts-expect-error
import studioFragment from "../../glsl/studio/studioFragment.glsl"

// @ts-expect-error
import videoVertex from '../../glsl/mobileVideo/mobVideoVertex.glsl'
// @ts-expect-error
import videoFragment from '../../glsl/mobileVideo/mobVideoFragment.glsl'

// @ts-ignore
import vertex from '@/src/glsl/bg/bgVertex.glsl'
// @ts-ignore
import fragment from '@/src/glsl/bg/bgFragment.glsl'

// @ts-ignore
import mobBgvertex from '@/src/glsl/mobileBg/mobBgVertex.glsl'
// @ts-ignore
import mobBgfragment from '@/src/glsl/mobileBg/mobBgFragment.glsl'

export const BgShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uProgress: 0,
    uResolution: new THREE.Vector3(1, 1, 1),
    uMouse: new THREE.Vector2(0, 0),
    uMouseVel: new THREE.Vector2(0, 0),
    uMouseStrength: 0.81,
    uHovered: 0,
    uBoost: -5,
  },
  vertex,
  fragment
)
export interface IBgShaderMaterial extends THREE.ShaderMaterial {
  uTime: number
  uProgress: number
  uResolution: THREE.Vector3
  uMouse: THREE.Vector2
  uMouseVel: THREE.Vector2
  uMouseStrength: number
  uHovered: number
  uBoost: number
}


export const MobileBgShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uProgress: 0,
    uResolution: new THREE.Vector3(1, 1, 1),
    uMouse: new THREE.Vector2(0, 0),
    uMouseVel: new THREE.Vector2(0, 0),
    uMouseStrength: 0.81,
    uHovered: 0,
    uBoost: -5,
    
    uBigWavesElevation : 2.2,
    uSmallWavesElevation : 0.15,
    uBigWavesFrequency : new THREE.Vector2(0.26, 0.30),
    uSmallWavesFrequency : 0.5,
    uBigWavesSpeed : 0.55,
    uSmallWavesSpeed : 0.2,
    uSmallIterations : 4.0,
    uColorTransition: 0.0,
  },
  mobBgvertex,
  mobBgfragment
)
export interface IMobileBgShaderMaterial extends THREE.ShaderMaterial {
  uTime: number
  uProgress: number
  uResolution: THREE.Vector3
  uMouse: THREE.Vector2
  uMouseVel: THREE.Vector2
  uMouseStrength: number
  uHovered: number
  uBoost: number
  uBigWavesElevation : number
  uBigWavesFrequency : THREE.Vector2
  uBigWavesSpeed : number
  uSmallWavesElevation : number
  uSmallWavesFrequency : number
  uSmallWavesSpeed : number
  uSmallIterations : number
  uColorTransition : number
}


export interface IStudioImageShaderMaterial extends THREE.ShaderMaterial {
  uMap: THREE.Texture
  uOpacity: number
  uIndex: number
  uScroll: number
  uGap: number
  uTotalHeight: number
  uImageHeight: number
  uStackScale: number
  // New time uniforms
  uTime: number
  uStartTime: number
  uDuration: number
  uTriggered: number
}


export const StudioImageShaderMaterial = shaderMaterial(
  {
	uMap: new THREE.Texture(),
	uOpacity: 1,
	uIndex: 0,
	uScroll: 0,
	uGap: 2.5,
	uTotalHeight: 0,
	uImageHeight: 1,
	uStackScale: 1,
	// New time uniforms (defaults)
	uTime: 0,
	uStartTime: 0,
	uDuration: 4,
	uTriggered: 0,
  },
  studioVertex,
  studioFragment
)


export interface IArtistShaderMaterial extends THREE.ShaderMaterial {
  uMap: THREE.Texture
  uOpacity: number
  uIndex: number
  uScroll: number
  uGap: number
  uTotalHeight: number
  uImageHeight: number
  uStackScale: number
  // New time uniforms
  uTime: number
  uStartTime: number
  uDuration: number
  uTriggered: number
  uDirection: number
  uNameOnly: number
}

export const ArtistShaderMaterial = shaderMaterial(
  {
    uMap: new THREE.Texture(),
    uOpacity: 1,
    uIndex: 0,
    uScroll: 0,
    uGap: 2.5,
    uTotalHeight: 0,
    uImageHeight: 1,
    uStackScale: 1,
    // New time uniforms (defaults)
    uTime: 0,
    uStartTime: 0,
    uDuration: 4,
    uTriggered: 0,
    uDirection: 1,
    uNameOnly: 0,
  },
  artistVertex,
  artistFragment
)


export interface ITextShaderMaterial extends THREE.ShaderMaterial {
  uOpacity: number
  uIndex: number
  uScroll: number
  uGap: number
  uTotalHeight: number
  uImageHeight: number
  uStackScale: number
  // New time uniforms
  uTime: number
  uStartTime: number
  uDuration: number
  uTriggered: number
  uResolutionY: number
  uDirection: number
  uNameOnly: number
}

export const TextShaderMaterial = shaderMaterial(
  {
    uOpacity: 1,
    uIndex: 0,
    uScroll: 0,
    uGap: 2.5,
    uTotalHeight: 0,
    uImageHeight: 1,
    uStackScale: 1,
    // New time uniforms (defaults)
    uTime: 0,
    uStartTime: 0,
    uDuration: 4,
    uTriggered: 0,
	  uResoltionY: 0,
    uDirection: 1,
    uNameOnly: 0,
  },
  textVertex,
  textFragment
)


export const MobileVideoShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color(0.2, 0.0, 0.1),
    uProgress: 0,
    uImage1Tex: new THREE.Texture(),
    uResolution: new THREE.Vector3(1, 1, 1),
    uClickedValue: 0,
    uFishEyeValue: 0,
    uExpandedValue: 0,
    uUVOffset: new THREE.Vector2(0, 0),
    uUVRepeat: new THREE.Vector2(1, 1),
  },
  videoVertex,
  videoFragment
)
export interface IMobileVideoShaderMaterial extends THREE.ShaderMaterial {
  uTime: number
  uColor: THREE.Color
  uProgress: number
  uImage1Tex: THREE.Texture
  uResolution: THREE.Vector3
  uClickedValue: number
  uFishEyeValue: number
  uExpandedValue: number
  uUVOffset: THREE.Vector2
  uUVRepeat: THREE.Vector2
}