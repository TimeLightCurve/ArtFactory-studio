import { useGalleryStore } from '@/src/lib/store/useGalleryStore'
import { useWheelStore } from '@/src/lib/store/useWheelStore'
import { ContactShadows, Text } from "@react-three/drei" // Removed Html
import { extend, Object3DNode, useFrame, useThree } from "@react-three/fiber"
import { useLenis } from "lenis/react"
import { easing } from 'maath'
import { animate } from 'motion'
import { useMotionValue } from 'motion/react'
import { useEffect, useMemo, useRef } from "react" // Removed useCallback, useState
import * as THREE from "three"
import { ArtistShaderMaterial, IArtistShaderMaterial, ITextShaderMaterial, TextShaderMaterial } from './shaderMaterials'
import { useStatics } from './statics'
import { useRouter } from 'next/navigation'


extend({ ArtistShaderMaterial, TextShaderMaterial })

declare module "@react-three/fiber" {
	interface ThreeElements {
		artistShaderMaterial: Object3DNode<IArtistShaderMaterial, typeof ArtistShaderMaterial>
		textShaderMaterial: Object3DNode<ITextShaderMaterial, typeof TextShaderMaterial>
	}
}


export default function ArtistImages() {
	const {
		urls,
		sharedStackScale,
		sharedCornerLen,
		sharedCornerThick,
		sharedCornerAlpha,
		sharedTime,
		defaultDuration,
		textDuration,
		sharedScroll,
		sharedResolution,
		zMin,
		zMax,
		sizes,
		textures,
		artists,
	} = useStatics()

	const lenis = useLenis()
	const { camera } = useThree()
	const pageAnimationStart = useWheelStore((state) => state.pageAnimationStart)
	const darkMode = useGalleryStore((state) => state.darkMode)

	// 1. Internal Ref for the animation loop
	// Initialize with current store value non-reactively
	const cameraZRef = useRef(useGalleryStore.getState().cameraZ)

	const sharedDirection = useMemo(() => new THREE.Uniform(1), [])
	// NEW: Shared uniform for name list animation to reduce draw calls/updates
	const sharedNameListProgress = useMemo(() => new THREE.Uniform(0), [])
	const sharedColorTransition = useMemo(() => new THREE.Uniform(1), [])
	const sharedThemeColorTransition = useMemo(() => new THREE.Uniform(1), [])

	const nameListShowRef = useRef(false)
	const nameListMotionValue = useMotionValue(0)
	const themeMotionValue = useMotionValue(1)
	const nameListAnimation = useRef<'none' | 'EXPANDING' | 'HIDING' | 'EXPANDED' | 'HIDDEN'>('none')

	const route = useRouter()

	// 2. Listen for the custom event from the DOM
	useEffect(() => {
		const handleZoomUpdate = (e: CustomEvent) => {
			// THREE.MathUtils.mapLinear(e.detail, 4, 8, 4, 9)
			cameraZRef.current = e.detail
			// cameraZRef.current = THREE.MathUtils.lerp(cameraZRef.current, e.detail, 0.25)
			// easing.damp(cameraZRef, 'current', e.detail, 0.25, 0.016)
		}

		const handleNameToggle = (e: CustomEvent) => {
			nameListShowRef.current = e.detail
			if (nameListShowRef.current) {
				
				animate(nameListMotionValue, 1, {
					bounce: 0.0,
					type: 'spring',
					visualDuration: 1.5,
					restDelta: 0.01,
					onUpdate: () => {
						nameListAnimation.current = 'HIDING'
					},
					onComplete: () => {
						nameListAnimation.current = 'HIDDEN'
					}
				})
			} else {
				
				animate(nameListMotionValue, 0, {
					bounce: 0.0,
					type: 'spring',
					visualDuration: 1.5,
					restDelta: 0.01,
					onUpdate: () => {
						nameListAnimation.current = 'EXPANDING'
					},
					onComplete: () => {
						nameListAnimation.current = 'EXPANDED'
					}
				})
			}

		}

		const handleThemeToggle = (e: CustomEvent) => {
			nameListShowRef.current = e.detail
			if (nameListShowRef.current) {
				animate(themeMotionValue, 1, {
					bounce: 0.0,
					type: 'spring',
					duration: 2.5,
					restDelta: 0.01,
					onUpdate: (v) => {
						// if (customShaderRef.current) customShaderRef.current.uColorTransition = v
						sharedThemeColorTransition.value = v
					},
				})
			} else {
				animate(themeMotionValue, 0, {
					bounce: 0.0,
					type: 'spring',
					duration: 3.5,
					restDelta: 0.01,
					onUpdate: (v) => {
						// if (customShaderRef.current) customShaderRef.current.uColorTransition = v
						sharedThemeColorTransition.value = v

					},
				})
			}
		}

		window.addEventListener('camera-zoom-update', handleZoomUpdate as any)
		window.addEventListener('toggle-names-update', handleNameToggle as any)
		window.addEventListener('toggle-darkmode-update', handleThemeToggle as any)

		return () => {
			window.removeEventListener('camera-zoom-update', handleZoomUpdate as any)
			window.removeEventListener('toggle-names-update', handleNameToggle as any)
			window.removeEventListener('toggle-darkmode-update', handleThemeToggle as any)
		}
	}, [nameListMotionValue, sharedThemeColorTransition, themeMotionValue])


	const meshRefs = useRef<THREE.Mesh[]>([])
	const textRefs = useRef<THREE.Mesh[]>([])
	// const tmpV = useMemo(() => new THREE.Vector3(), [])
	const titleRefs = useRef<THREE.Group[]>([])
	const startTimes = useRef<number[]>([])
	const triggered = useRef<boolean[]>([])
	const clickedRef = useRef(false)
	const clickedImageIndex = useRef<number | null>(null)
	const zValueRef = useRef<number>(6)
	const xFar = useRef(0)
	const groupRef = useRef<THREE.Group>(null)
	const group1Ref = useRef<THREE.Group>(null)



	// InstancedMesh for small squares
	// const squareRef = useRef<THREE.InstancedMesh>(null)
	const dummy = useMemo(() => new THREE.Object3D(), [])

	// Calculate total width for infinite wrapping
	const totalWidth = useMemo(() => sizes[sizes.length - 1]?.offsetWidth || 0, [sizes])

	// Removed reactive store subscription to prevent re-renders
	// const cameraZ = useGalleryStore((s) => s.cameraZ)
	// const setCameraZ = useGalleryStore((s) => s.setCameraZ)
	// const columns = (cameraZ ?? 6) > (zMin + zMax) * 0.5 ? 2 : 1

	useEffect(() => {
		startTimes.current = textures.map(() => -1)
		triggered.current = textures.map(() => false)
	}, [textures])

	useFrame((state, dt) => {
		// 3. Read the ref updated by the event
		zValueRef.current = THREE.MathUtils.damp(
			zValueRef.current,
			THREE.MathUtils.clamp(cameraZRef.current, zMin, zMax),
			1.2,
			dt,
		)

		sharedResolution.value = state.size.height

		const t = (zValueRef.current - zMin) / (zMax - zMin)
		const tLerp = THREE.MathUtils.lerp(1.0, 2.0, t)
		sharedStackScale.value = tLerp

		const tGlobal = state.clock.elapsedTime
		sharedTime.value = tGlobal

		const scrollY = -((sizes[sizes.length - 1]?.offsetWidth ?? 0) * (lenis ? lenis.progress : 0))
		sharedScroll.value = 0

		easing.damp(xFar, 'current', clickedRef.current ? 2.5 : 0, 0.2, dt)

		const base = THREE.MathUtils.smoothstep(tLerp, 1.0, 2.0)
		const smoothedScale = Math.pow(base, 2.0)
		const sc2 = Math.pow(smoothedScale, 2.0)

		if (clickedRef.current && clickedImageIndex.current !== null) {
			const image = meshRefs.current[clickedImageIndex.current!]
			const columnChecker = clickedImageIndex.current % 2
			easing.damp3(
				camera.position,
				new THREE.Vector3(
					image.position.x + -100,
					sc2 * (columnChecker * 3 + ((1 - columnChecker) * -1) - 1) - 5,
					image.position.z + 5.5
				),
				0.35,
				dt,
			)
		} else {
			// if (nameListAnimation.current) {
			// 	easing.damp3(
			// 		camera.position,
			// 		new THREE.Vector3(0, nameListMotionValue.get() * 20 , zValueRef.current + nameListMotionValue.get() * 30),
			// 		0.15,
			// 		dt,
			// 	)
			// }
			// else {
			easing.damp3(
				camera.position,
				new THREE.Vector3(0, 2, zValueRef.current + nameListMotionValue.get() * 10),
				0.55,
				0.016,
			)
			// }

			// Removed group movement for infinite scroll; applied to meshes directly
			// easing.damp3(groupRef.current!.position, new THREE.Vector3(-scrollY, 0, 0), 0.3, dt)
			groupRef.current!.position.set(0, 0, 0)
		}

		const WORLD_TRIGGER_TOLERANCE = 1.9
		const S = -scrollY / (0.98 + sc2 * 0.8)// Positive scroll distance
		const nameListValue = nameListMotionValue.get() * nameListMotionValue.get()

		// NEW: Update the shared uniform once per frame instead of per-mesh
		sharedNameListProgress.value = nameListValue

		for (let i = 0; i < meshRefs.current.length; i++) {
			const mesh = meshRefs.current[i]
			const textMesh = textRefs.current[i]
			if (!mesh || !textMesh) continue
			const { widthHorizontal, heightHorizontal, offset, offsetWidth } = sizes[i]
			const prevHeight = sizes[i - 1]?.heightHorizontal ? sizes[i - 1].heightHorizontal : 0
			const prevWidth = sizes[i - 1]?.widthHorizontal ? sizes[i - 1].widthHorizontal : 0
			const columnChecker = i % 2


			// Static position calculation
			const staticX = (
				-(offsetWidth - sc2 * (prevHeight * 2 * Math.abs(i) / 5)) * (1 - sc2 * 2 * columnChecker)
				- sc2 * (widthHorizontal * 0.0 * columnChecker))
				- prevWidth * sc2 * columnChecker - 1
			// - ((prevHeight - 0.2) * i / 2 ) * ( 1 - sc2) 
			// - (clickedImageIndex.current! > i ? -xFar.current : clickedImageIndex.current! < i ? xFar.current : 0)			 

			// Apply scroll movement:
			// Row 0 moves with S
			// Row 1 moves with S - 2*S*sc2 (opposite when sc2=1)
			let cx = (staticX + S * (1 - 2 * columnChecker * sc2) + 0.6) * (1 - nameListValue) - 2.2 * nameListValue


			// // Infinite wrapping
			// if (totalWidth > 0) {
			// 	const halfW = totalWidth / 2
			// 	// Wrap around center
			// 	cx = ((cx + halfW) % totalWidth + totalWidth) % totalWidth - halfW
			// }

			const cy = (sc2 * (columnChecker * 4.5 - 1) - (sc2 * 1)) * (1 - Math.pow(nameListValue, 4.)) +
				(-i * 2.5 + 5) * Math.pow(nameListValue, 1.3) + S * nameListValue
			const cz = -4 + nameListValue * (4) - ((i % 5) - 2) * 0.1

			mesh.position.set(cx, cy, cz)
			const titleG = titleRefs.current[i]
			if (titleG) titleG.position.set(cx, cy, cz)

			// Update square instance position
			// if (squareRef.current) {
			// 	// Position square at bottom-left of the image, aligned with text Y
			// 	// Text Y local is: -heightHorizontal / 2 - heightHorizontal * 0.01
			// 	const sqX = cx - widthHorizontal / 2 - 0.05 // Shift left of image edge
			// 	const sqY = cy - heightHorizontal / 2 - heightHorizontal * 0.01 - 0.02 // Align roughly with text top
			// 	const sqZ = cz + 0.01

			// 	dummy.position.set(sqX, sqY, sqZ)
			// 	dummy.rotation.set(0, 0, 0)
			// 	dummy.scale.set(1, 1, 1)
			// 	dummy.updateMatrix()
			// 	squareRef.current.setMatrixAt(i, dummy.matrix)
			// }


			if (nameListAnimation.current !== 'none' && nameListAnimation.current !== 'EXPANDED' && nameListAnimation.current !== 'HIDDEN') {
				// console.log('hide')

				startTimes.current[i] = tGlobal
				const mat = mesh.material as any
				const textMat = textMesh.material as any
				// console.log(nameListValue)


				if (nameListAnimation.current === 'EXPANDING') {
					triggered.current[i] = true
					mat.uniforms.uStartTime.value = tGlobal
					mat.uniforms.uTriggered.value = nameListValue
					mat.uniforms.uDuration.value = defaultDuration

					textMat.uniforms.uTriggered.value = nameListValue
					textMat.uniforms.uStartTime.value = tGlobal
					textMat.uniforms.uDuration.value = textDuration
					// @ts-ignore
					easing.damp(textMesh, 'fontSize', 0.23, 0.5, dt)
				}
				else if (nameListAnimation.current === 'HIDING') {
					triggered.current[i] = false
					// @ts-ignore
					easing.damp(textMesh, 'fontSize', 0.6, 0.5, dt)
					mat.uniforms.uStartTime.value = tGlobal
					mat.uniforms.uTriggered.value = nameListValue
					mat.uniforms.uDuration.value = defaultDuration

					textMat.uniforms.uTriggered.value = nameListValue
					textMat.uniforms.uStartTime.value = tGlobal
					textMat.uniforms.uDuration.value = textDuration
				}


				// REMOVED: mat.uniforms.uNameOnly.value = nameListValue (Handled by shared uniform)

				// textMat.uniforms.uTriggered.value = nameListAnimation.current === 'HIDING' ? 1.0 : 0.0
				// textMat.uniforms.uStartTime.value = tGlobal
				// textMat.uniforms.uDuration.value = textDuration 

				if (nameListValue > 0.94) {
					mesh.visible = false
				} else {
					mesh.visible = true
				}

			} else {
				// if(nameListValue === 0){

				// if (triggered.current[i]) continue // Removed to allow toggling back and forth
				const distX = nameListAnimation.current === 'HIDDEN' ? Math.abs(mesh.position.y - camera.position.y) : Math.abs(mesh.position.x - camera.position.x)
				const isExpanded = triggered.current[i]

				if (!isExpanded && distX < WORLD_TRIGGER_TOLERANCE + 6.5) {
					// Expand
					triggered.current[i] = true
					startTimes.current[i] = tGlobal
					const mat = mesh.material as any
					const textMat = textMesh.material as any

					mat.uniforms.uStartTime.value = tGlobal
					mat.uniforms.uTriggered.value = 1.0
					mat.uniforms.uDuration.value = defaultDuration

					textMat.uniforms.uTriggered.value = 1.0
					textMat.uniforms.uStartTime.value = tGlobal
					textMat.uniforms.uDuration.value = textDuration
				}
				else if (isExpanded && distX > WORLD_TRIGGER_TOLERANCE + 6.5) {
					// Contract (with hysteresis of 1.5 units to prevent flickering)
					triggered.current[i] = false
					startTimes.current[i] = tGlobal
					const textMat = textMesh.material as any
					const mat = mesh.material as any

					mat.uniforms.uStartTime.value = tGlobal
					mat.uniforms.uTriggered.value = 0.0
					mat.uniforms.uDuration.value = defaultDuration


					textMat.uniforms.uTriggered.value = 0.0
					textMat.uniforms.uStartTime.value = tGlobal
					textMat.uniforms.uDuration.value = textDuration
				}
				// }
			}
		}

		// if (squareRef.current) {
		// 	squareRef.current.instanceMatrix.needsUpdate = true
		// }

		if (pageAnimationStart) {
			// animate the whole group from -200 to 0 once 
			easing.damp3(
				group1Ref.current!.position,
				new THREE.Vector3(2, 2, -1),
				0.5,
				dt,
			)
			// easing.damp3(
			// 	camera.position,
			// 	new THREE.Vector3(0, 0, 8),
			// 	0.8,
			// 	dt,
			// )
			if (lenis) {
				sharedDirection.value = THREE.MathUtils.damp(sharedDirection.value, lenis.direction, 0.8, dt)
				// sharedDirection.value = THREE.MathUtils.lerp(sharedDirection.value, lenis.direction, 0.1)
			}
		}
	})

	const handleClickImage = (i: number) => {
		clickedRef.current = !clickedRef.current
		clickedImageIndex.current = i
		route.push('/portfolio')
	}

	return (
		<group visible={pageAnimationStart} >
			{/* <Html fullscreen >

			</Html> */}
			{/* <Text
				// ref={(el) => { if (el) textRefs.current[i] = el }}
				position={[0.0, 1.5, 0.0]}
				// font={"fonts/Special_Elite/SpecialElite-Regular.ttf"}
				font={"fonts/TTRicordiAllegriaRegular.ttf"}
				fontSize={0.3}
				color="white"
				anchorX="center"
				anchorY="top"
				// maxWidth={widthHorizontal * 0.9}
				lineHeight={1.4}
				strokeWidth={0}
				strokeOpacity={0}
				outlineOpacity={0}
				outlineWidth={0}
				sdfGlyphSize={256}
			>
				{`Selected works`}

			</Text> */}



			<group ref={group1Ref} position={[35, 2, 0]}>
				<group ref={groupRef}>
					{/* Instanced Squares */}
					{/* <group position={[0.17, -0.16, 0]}>

						<instancedMesh ref={squareRef} args={[undefined, undefined, textures.length]} frustumCulled={false}>
							<planeGeometry args={[0.08, 0.08]} />
							<meshBasicMaterial color="white" />
						</instancedMesh>
					</group> */}
					{textures.map((tex, i) => {
						const { widthHorizontal, heightHorizontal, offsetWidth } = sizes[i]
						// const title = urls[i]?.split('/').pop()?.split('.').shift() ?? `Image ${i + 1}`
						return (
							<group key={i} onClick={() => handleClickImage(i)} >
								<mesh
									ref={(el) => { if (el) meshRefs.current[i] = el }}
									castShadow
								// frustumCulled={false}
								>
									<planeGeometry args={[widthHorizontal, heightHorizontal, 1, 1]} />
									<artistShaderMaterial
										key={ArtistShaderMaterial.key}
										// blending={THREE.AdditiveBlending}
										depthWrite={false}
										uMap={tex}
										uIndex={i}
										uImageHeight={heightHorizontal}
										uTotalHeight={offsetWidth}
										uStackScale={sharedStackScale.value}
										uStartTime={0}
										uDuration={defaultDuration}
										uTriggered={0}
										onUpdate={(m) => {
											m.uniforms.uStackScale = sharedStackScale
											m.uniforms.uCornerLen = sharedCornerLen
											m.uniforms.uCornerThick = sharedCornerThick
											m.uniforms.uCornerAlpha = sharedCornerAlpha
											m.uniforms.uAspect = new THREE.Uniform(widthHorizontal / heightHorizontal)
											m.uniforms.uTime = sharedTime
											m.uniforms.uScroll = sharedScroll
											m.uniforms.uDirection = sharedDirection
											// NEW: Pass the shared uniform reference
											m.uniforms.uNameOnly = sharedNameListProgress
											m.uniforms.uColorTransition = sharedThemeColorTransition
										}}
										transparent
									/>
								</mesh>

								<group ref={(el) => { if (el) titleRefs.current[i] = el }}>
									<Text
										ref={(el) => { if (el) textRefs.current[i] = el }}
										position={[0.0, -heightHorizontal / 2 - heightHorizontal * 0.01, 0.0]}
										// font={"fonts/Special_Elite/SpecialElite-Regular.ttf"}
										font={"fonts/TTRicordiAllegriaRegular.ttf"}
										fontSize={0.23}
										color="white"
										anchorX="center"
										anchorY="top"
										// maxWidth={widthHorizontal * 0.9}
										lineHeight={1.4}
										strokeWidth={0}
										// strokeOpacity={1}
										outlineOpacity={0}
										outlineWidth={0}
										sdfGlyphSize={256}
									>
										{`${artists[i] ?? `Artist ${i + 1}`}`}
										<textShaderMaterial
											key={TextShaderMaterial.key}
											side={THREE.DoubleSide}
											uIndex={i}
											uImageHeight={heightHorizontal}
											uTotalHeight={offsetWidth}
											uStackScale={sharedStackScale.value}
											uStartTime={0}
											uDuration={textDuration}
											uTriggered={0}
											onUpdate={(m) => {
												m.uniforms.uStackScale = sharedStackScale
												m.uniforms.uCornerLen = sharedCornerLen
												m.uniforms.uCornerThick = sharedCornerThick
												m.uniforms.uCornerAlpha = sharedCornerAlpha
												m.uniforms.uAspect = new THREE.Uniform(widthHorizontal / heightHorizontal)
												m.uniforms.uTime = sharedTime
												m.uniforms.uScroll = sharedScroll
												m.uniforms.uResolution = sharedResolution
												m.uniforms.uDirection = sharedDirection
												// NEW: Pass the shared uniform reference
												m.uniforms.uNameOnly = sharedNameListProgress
												m.uniforms.uColorTransition = sharedThemeColorTransition
											}}
											transparent
										/>
									</Text>
								</group>
							</group>
						)
					})}
				</group>
			</group>
		</group>
	)
}
