import * as THREE from 'three'

import { Object3DNode, useFrame } from '@react-three/fiber'

import { extend } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { MobileBgShaderMaterial, IMobileBgShaderMaterial } from './shaderMaterials'
import { animate, useMotionValue } from 'motion/react'
import { useWheelStore } from '@/src/lib/store/useWheelStore'
// import { types } from '@theatre/core'
// import { MathUtils } from 'three'


extend({ MobileBgShaderMaterial })


declare module '@react-three/fiber' {
	interface ThreeElements {
		mobileBgShaderMaterial: Object3DNode<IMobileBgShaderMaterial, typeof MobileBgShaderMaterial>
	}
}


export default function MobileBgPlane() {

	const customShaderRef = useRef<IMobileBgShaderMaterial>(null)
	const lastMouse = useRef<THREE.Vector2>(new THREE.Vector2())
	const smoothedMouse = useRef<THREE.Vector2>(new THREE.Vector2())
	const lastFrameTime = useRef<number>(performance.now())
	const timeRef = useRef(1000000)

	const targetMouse = useRef<THREE.Vector2>(new THREE.Vector2())
	const nameListShowRef = useRef(false)
	const nameListMotionValue = useMotionValue(0)
	const nameListAnimation = useRef<'none' | 'EXPANDING' | 'HIDING' | 'EXPANDED' | 'HIDDEN'>('none')
	const titleAnimationDone = useWheelStore((state) => state.titleAnimationDone)

	useEffect(()=>{
		if (!titleAnimationDone) {
			animate(nameListMotionValue, 0, {
				bounce: 0.0,
				type: 'spring',
				visualDuration: 3.5,
				restDelta: 0.01,
				onUpdate: (v) => {
					nameListAnimation.current = 'EXPANDING'
					if (customShaderRef.current) customShaderRef.current.uColorTransition = v
				},
				onComplete: () => {
					nameListAnimation.current = 'EXPANDED'
				}
			})
		} else {
			animate(nameListMotionValue, 1, {
				bounce: 0.0,
				type: 'spring',
				visualDuration: 3.5,
				restDelta: 0.01,
				onUpdate: (v) => {
					nameListAnimation.current = 'HIDING'
					if(customShaderRef.current) customShaderRef.current.uColorTransition = v
				},
				onComplete: () => {
					nameListAnimation.current = 'HIDDEN'
				}
			})
		}
	},[titleAnimationDone])

	// Track pointer globally (window). Add listener once.
	useEffect(() => {
		function onPointerMove(e: PointerEvent) {
			targetMouse.current.set(e.clientX, window.innerHeight - e.clientY)
		}

		const handleNameToggle = (e: CustomEvent) => {
			nameListShowRef.current = e.detail
			if (nameListShowRef.current) {
				animate(nameListMotionValue, 1, {
					bounce: 0.0,
					type: 'spring',
					visualDuration: 3.5,
					restDelta: 0.01,
					onUpdate: (v) => {
						nameListAnimation.current = 'HIDING'
						if(customShaderRef.current) customShaderRef.current.uColorTransition = v
					},
					onComplete: () => {
						nameListAnimation.current = 'HIDDEN'
					}
				})
			} else {
				animate(nameListMotionValue, 0, {
					bounce: 0.0,
					type: 'spring',
					visualDuration: 3.5,
					restDelta: 0.01,
					onUpdate: (v) => {
						nameListAnimation.current = 'EXPANDING'
						if (customShaderRef.current) customShaderRef.current.uColorTransition = v
					},
					onComplete: () => {
						nameListAnimation.current = 'EXPANDED'
					}
				})
			}
		}
		window.addEventListener('pointermove', onPointerMove, { passive: true })
		window.addEventListener('toggle-darkmode-update', handleNameToggle as any)
		return () =>{ 
			window.removeEventListener('pointermove', onPointerMove)
			window.removeEventListener('toggle-darkmode-update', handleNameToggle as any)
		}

	}, [])




	useFrame((state, delta) => {
		if (!customShaderRef.current) return
		customShaderRef.current.uResolution.set(state.size.width, state.size.height, 1)
		timeRef.current += delta 
		customShaderRef.current.uTime = state.clock.elapsedTime 
		// console.log("Time:", customShaderRef.current.uTime)
		customShaderRef.current.uProgress = 1.0

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
	<mesh position={[0, 0, -8.8]}>
		<planeGeometry args={[11.5, 25, 40, 200]}
		/>
		<mobileBgShaderMaterial
			ref={customShaderRef}
			key={MobileBgShaderMaterial.key}
			side={THREE.DoubleSide}
			transparent
		/>
	</mesh>
  )
}
