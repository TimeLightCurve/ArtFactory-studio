import { useGalleryStore } from '@/src/lib/store/useGalleryStore'
import { useWheelStore } from '@/src/lib/store/useWheelStore'
import { Text } from "@react-three/drei" // Removed Html
import { extend, Object3DNode, useFrame, useThree } from "@react-three/fiber"
import { useLenis } from "lenis/react"
import { easing } from 'maath'
import { useEffect, useMemo, useRef } from "react" // Removed useCallback, useState
import * as THREE from "three"
import { IStudioImageShaderMaterial, StudioImageShaderMaterial,  ITextShaderMaterial, TextShaderMaterial } from './shaderMaterials'

import { useStatics } from './statics'


extend({ StudioImageShaderMaterial, TextShaderMaterial })

declare module "@react-three/fiber" {
	interface ThreeElements {
        studioImageShaderMaterial: Object3DNode<IStudioImageShaderMaterial, typeof StudioImageShaderMaterial>
		textShaderMaterial: Object3DNode<ITextShaderMaterial, typeof TextShaderMaterial>
	}
}


export default function StudioImages() {
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
	} = useStatics()

	const lenis = useLenis()
	const { camera } = useThree()
	const pageAnimationStart = useWheelStore((state) => state.pageAnimationStart)

	// 1. Internal Ref for the animation loop
	// Initialize with current store value non-reactively
	const cameraZRef = useRef(useGalleryStore.getState().cameraZ)

	// 2. Listen for the custom event from the DOM
	useEffect(() => {
		const handleZoomUpdate = (e: CustomEvent) => {
			cameraZRef.current = e.detail
			// easing.damp(
			// 	cameraZRef,
			// 	 'current',
			// 	e.detail,
			// 	0.5,
			// 	0.016
			// )
		}

		window.addEventListener('camera-zoom-update', handleZoomUpdate as any)
		return () => window.removeEventListener('camera-zoom-update', handleZoomUpdate as any)
	}, [])

	const meshRefs = useRef<THREE.Mesh[]>([])
	const textRefs = useRef<THREE.Mesh[]>([])
	const tmpV = useMemo(() => new THREE.Vector3(), [])
	const titleRefs = useRef<THREE.Group[]>([])
	const startTimes = useRef<number[]>([])
	const triggered = useRef<boolean[]>([])
	const clickedRef = useRef(false)
	const clickedImageIndex = useRef<number | null>(null)
	const zValueRef = useRef<number>(6)
	const yFar = useRef(0)
	const groupRef = useRef<THREE.Group>(null)

	// InstancedMesh for small squares
	const squareRef = useRef<THREE.InstancedMesh>(null)
	const dummy = useMemo(() => new THREE.Object3D(), [])

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
			3.9,
			dt,
		)

		sharedResolution.value = state.size.height

		const t = (zValueRef.current - zMin) / (zMax - zMin)
		const tLerp = THREE.MathUtils.lerp(1.0, 2.0, t)
		sharedStackScale.value = tLerp

		const tGlobal = state.clock.elapsedTime
		sharedTime.value = tGlobal

		const scrollY = -((sizes[sizes.length - 1]?.offset ?? 0) * (lenis ? lenis.progress : 0))
		sharedScroll.value = 0

		easing.damp(yFar, 'current', clickedRef.current ? 2.5 : 0, 0.2, dt)

		const base = THREE.MathUtils.smoothstep(tLerp, 1.0, 2.0)
		const smoothedScale = Math.pow(base, 2.0)
		const sc2 = Math.pow(smoothedScale, 2.0)

		if (clickedRef.current && clickedImageIndex.current !== null) {
			const image = meshRefs.current[clickedImageIndex.current!]
			const columnChecker = clickedImageIndex.current % 2
			easing.damp3(
				camera.position,
				new THREE.Vector3(
					sc2 * (columnChecker * 2 - 1),
					image.position.y - 0.4,
					image.position.z + 3.5
				),
				0.35,
				dt,
			)
		} else {
			easing.damp3(
				camera.position,
				new THREE.Vector3(0, scrollY, zValueRef.current),
				0.35,
				dt,
			)
		}

		const WORLD_TRIGGER_TOLERANCE = 1.5

		for (let i = 0; i < meshRefs.current.length; i++) {
			const mesh = meshRefs.current[i]
			const textMesh = textRefs.current[i]
			if (!mesh || !textMesh) continue

			const { width, height, offset } = sizes[i]
			const columnChecker = i % 2
			const cx = sc2 * (columnChecker * 2 - 1)
			const cy = (
				(-offset + sc2 * (height * 2 * columnChecker))
				- sc2 * (height * 1.6 * columnChecker)
				- (clickedImageIndex.current! > i ? -yFar.current : clickedImageIndex.current! < i ? yFar.current : 0)
			)
			const cz = (i % 5) * 0.8 - 2.9

			mesh.position.set(cx, cy, cz)
			const titleG = titleRefs.current[i]
			if (titleG) titleG.position.set(cx, cy, cz)

			// Update square instance position
			if (squareRef.current) {
				// Position square at bottom-left of the image, aligned with text Y
				// Text Y local is: -height / 2 - height * 0.01
				const sqX = cx - width / 2 - 0.05 // Shift left of image edge
				const sqY = cy - height / 2 - height * 0.01 - 0.02 // Align roughly with text top
				const sqZ = cz + 0.01

				dummy.position.set(sqX, sqY, sqZ)
				dummy.rotation.set(0, 0, 0)
				dummy.scale.set(1, 1, 1)
				dummy.updateMatrix()
				squareRef.current.setMatrixAt(i, dummy.matrix)
			}

			if (triggered.current[i]) continue
			const distY = Math.abs(mesh.position.y - camera.position.y)

			if (distY < WORLD_TRIGGER_TOLERANCE) {
				triggered.current[i] = true
				startTimes.current[i] = tGlobal
				const mat = mesh.material as any
				const textMat = textMesh.material as any

				mat.uniforms.uStartTime.value = tGlobal
				mat.uniforms.uTriggered.value = 1.0
				mat.uniforms.uDuration.value = defaultDuration

				textMat.uniforms.uTriggered.value = 1.0
				textMat.uniforms.uStartTime.value = tGlobal + 0.2
				textMat.uniforms.uDuration.value = textDuration
			}
		}

		if (squareRef.current) {
			squareRef.current.instanceMatrix.needsUpdate = true
		}

		if (pageAnimationStart) {
			// animate the whole group from -200 to 0 once 
			easing.damp3(
				groupRef.current!.position,
				new THREE.Vector3(0, 0, 0),
				0.8,
				dt,
			)
			// easing.damp3(
			// 	camera.position,
			// 	new THREE.Vector3(0, 0, 8),
			// 	0.8,
			// 	dt,
			// )
		}
	})

	const handleClickImage = (i: number) => {
		clickedRef.current = !clickedRef.current
		clickedImageIndex.current = i
	}

	return (
		<group visible={pageAnimationStart} >
			{/* <Html fullscreen >

			</Html> */}
			<Text
				// ref={(el) => { if (el) textRefs.current[i] = el }}
				position={[0.0, 1.5, 0.0]}
				// font={"fonts/Special_Elite/SpecialElite-Regular.ttf"}
				font={"fonts/TTRicordiAllegriaRegular.ttf"}
				fontSize={0.3}
				color="black"
				anchorX="center"
				anchorY="top"
				// maxWidth={width * 0.9}
				lineHeight={1.4}
				strokeWidth={0}
				strokeOpacity={0}
				outlineOpacity={0}
				outlineWidth={0}
				sdfGlyphSize={256}
			>
				{`Selected works`}
				{/* <textShaderMaterial
					key={TextShaderMaterial.key}
					side={THREE.DoubleSide}
					uIndex={i}
					uImageHeight={height}
					uTotalHeight={offset}
					uStackScale={sharedStackScale.value}
					uStartTime={0}
					uDuration={textDuration}
					uTriggered={0}
					onUpdate={(m) => {
						m.uniforms.uStackScale = sharedStackScale
						m.uniforms.uCornerLen = sharedCornerLen
						m.uniforms.uCornerThick = sharedCornerThick
						m.uniforms.uCornerAlpha = sharedCornerAlpha
						m.uniforms.uAspect = new THREE.Uniform(width / height)
						m.uniforms.uTime = sharedTime
						m.uniforms.uScroll = sharedScroll
						m.uniforms.uResolution = sharedResolution
					}}
					transparent
				/> */}
			</Text>

			

			<group ref={groupRef} position={[0, -15, 0]}>
				{/* Instanced Squares */}
				<group position={[0.17, -0.16, 0]}>

					<instancedMesh ref={squareRef} args={[undefined, undefined, textures.length]} frustumCulled={false}>
						<planeGeometry args={[0.08, 0.08]} />
						<meshBasicMaterial color="black" />
					</instancedMesh>
				</group>
				{textures.map((tex, i) => {
					const { width, height, offset } = sizes[i]
					const title = urls[i]?.split('/').pop()?.split('.').shift() ?? `Image ${i + 1}`
					return (
						<group key={i} onClick={() => handleClickImage(i)} >
							<mesh
								ref={(el) => { if (el) meshRefs.current[i] = el }}
							// frustumCulled={false}
							>
								<planeGeometry args={[width, height, 1, 1]} />
								<studioImageShaderMaterial
									key={StudioImageShaderMaterial.key}
									uMap={tex}
									uIndex={i}
									uImageHeight={height}
									uTotalHeight={offset}
									uStackScale={sharedStackScale.value}
									uStartTime={0}
									uDuration={defaultDuration}
									uTriggered={0}
									onUpdate={(m) => {
										m.uniforms.uStackScale = sharedStackScale
										m.uniforms.uCornerLen = sharedCornerLen
										m.uniforms.uCornerThick = sharedCornerThick
										m.uniforms.uCornerAlpha = sharedCornerAlpha
										m.uniforms.uAspect = new THREE.Uniform(width / height)
										m.uniforms.uTime = sharedTime
										m.uniforms.uScroll = sharedScroll
									}}
									transparent
								/>
							</mesh>

							<group ref={(el) => { if (el) titleRefs.current[i] = el }}>
								<Text
									ref={(el) => { if (el) textRefs.current[i] = el }}
									position={[0.0, -height / 2 - height * 0.01, 0.0]}
									// font={"fonts/Special_Elite/SpecialElite-Regular.ttf"}
									font={"fonts/TTRicordiAllegriaRegular.ttf"}
									fontSize={0.23}
									color="white"
									anchorX="center"
									anchorY="top"
									maxWidth={width * 0.9}
									lineHeight={1.4}
									strokeWidth={0}
									strokeOpacity={0}
									outlineOpacity={0}
									outlineWidth={0}
									sdfGlyphSize={256}
								>
									{`Armin Morbach`}
									<textShaderMaterial
										key={TextShaderMaterial.key}
										side={THREE.DoubleSide}
										uIndex={i}
										uImageHeight={height}
										uTotalHeight={offset}
										uStackScale={sharedStackScale.value}
										uStartTime={0}
										uDuration={textDuration}
										uTriggered={0}
										onUpdate={(m) => {
											m.uniforms.uStackScale = sharedStackScale
											m.uniforms.uCornerLen = sharedCornerLen
											m.uniforms.uCornerThick = sharedCornerThick
											m.uniforms.uCornerAlpha = sharedCornerAlpha
											m.uniforms.uAspect = new THREE.Uniform(width / height)
											m.uniforms.uTime = sharedTime
											m.uniforms.uScroll = sharedScroll
											m.uniforms.uResolution = sharedResolution
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
	)
}
