import * as THREE from 'three'
import { Object3DNode, useFrame } from '@react-three/fiber'
import { extend } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { BgShaderMaterial, IBgShaderMaterial } from './shaderMaterials'
// import { types } from '@theatre/core'
// import { MathUtils } from 'three'


extend({ BgShaderMaterial })

declare module '@react-three/fiber' {
	interface ThreeElements {
		bgShaderMaterial: Object3DNode<IBgShaderMaterial, typeof BgShaderMaterial>
	}
}


export default function BgPlane() {

	const customShaderRef = useRef<IBgShaderMaterial>(null)
	const lastMouse = useRef<THREE.Vector2>(new THREE.Vector2())
	const smoothedMouse = useRef<THREE.Vector2>(new THREE.Vector2())
	const lastFrameTime = useRef<number>(performance.now())
	const timeRef = useRef(1000000)

	const targetMouse = useRef<THREE.Vector2>(new THREE.Vector2())


	// Track pointer globally (window). Add listener once.
	useEffect(() => {
		function onPointerMove(e: PointerEvent) {
			targetMouse.current.set(e.clientX, window.innerHeight - e.clientY)
		}
		window.addEventListener('pointermove', onPointerMove, { passive: true })
		return () => window.removeEventListener('pointermove', onPointerMove)
	}, [])



	useFrame((state, delta) => {
		if (!customShaderRef.current) return
		customShaderRef.current.uResolution.set(state.size.width, state.size.height, 1)
		timeRef.current += delta * 3
		customShaderRef.current.uTime = state.clock.elapsedTime 
		// console.log("Time:", customShaderRef.current.uTime)
		customShaderRef.current.uProgress = 0.9

		// targetMouse.current.set(state.pointer.x * state.size.width / 2 , state.pointer.y * state.size.height /2 )

		smoothedMouse.current.lerp(targetMouse.current, 0.15)

		// Compute velocity (px/sec)
		const now = performance.now()
		// const dtMs = now - lastFrameTime.current
		// const dt = dtMs / 1000.0
		lastFrameTime.current = now
		const vel = smoothedMouse.current.clone().sub(lastMouse.current)
		// lastMouse.current.copy(smoothedMouse.current)
		// if (dt > 0) vel.divideScalar(dt)

		// Damping velocity to manageable scale
		// vel.multiplyScalar(0.8)

		customShaderRef.current.uMouse.set(smoothedMouse.current.x, smoothedMouse.current.y)
		customShaderRef.current.uMouseVel.set(vel.x, vel.y)
		// customShaderRef.current.uMouseStrength = 0.25
		// customShaderRef.current.uBoost = -10.0
		// customShaderRef.current.uHovered = 0
	})
  return (
	<mesh position={[0,0,-2.5]}>
		<planeGeometry args={[114, 64, 100, 100]}
		/>
		<bgShaderMaterial
			ref={customShaderRef}
			key={BgShaderMaterial.key}
			side={THREE.DoubleSide}
			transparent
		/>
	</mesh>
  )
}
