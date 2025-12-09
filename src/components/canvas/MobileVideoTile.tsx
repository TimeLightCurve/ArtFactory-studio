import {  useVideoTexture } from "@react-three/drei"
import { extend, Object3DNode, useFrame, useThree } from "@react-three/fiber"
// import { types } from "@theatre/core"
// import { editable as e, useCurrentSheet } from "@theatre/r3f"
import { useEffect, useMemo, useRef, useState } from "react"
import * as THREE from 'three'
import { useWheelStore } from "@/src/lib/store/useWheelStore"
import { useLenis } from "lenis/react"
import { animate, useMotionValue } from "motion/react"
import { IMobileVideoShaderMaterial, MobileVideoShaderMaterial } from "./shaderMaterials"



extend({ MobileVideoShaderMaterial })



declare module '@react-three/fiber' {
	interface ThreeElements {
		mobileVideoShaderMaterial: Object3DNode<IMobileVideoShaderMaterial, typeof MobileVideoShaderMaterial>
	}
}

const videosURLs = [
	'videos/video10.mp4',
	'videos/video6.mp4',
	'videos/video8.mp4',
	'videos/video7.mp4',
	'videos/video9.mp4',
]

type VideoProps = {

}

export default function MobileVideoTile({ }: VideoProps) {
	const lenis = useLenis()

	const textGroupRef = useRef<THREE.Group>(null)
	const groupRef = useRef<THREE.Group>(null)
	const planeRef = useRef<THREE.Mesh>(null)
	const videoMatRef = useRef<IMobileVideoShaderMaterial>(null)


	const fishEyeValue = useMotionValue(0)
	const progressValue = useMotionValue(0)
	const expandValue = useMotionValue(0)


	const sectionIndex = useWheelStore((state) => state.sectionIndex)
	const videoClicked = useWheelStore((state) => state.videoClicked)
	const videoTitle = useWheelStore((state) => state.videoTitle)
	const setExpanded = useWheelStore((state) => state.setExpanded)
	const titleAnimationDone = useWheelStore((state) => state.titleAnimationDone)
	const setPageAnimationStart = useWheelStore((state) => state.setPageAnimationStart)


	const prevSectionIndexRef = useRef(sectionIndex)
	const expandedDone = useRef(false)
	const doOnceRef = useRef(false)

	const useVideoTextures = (urls: string[]) => {
		const opts = {
			start: false,
			muted: true,
			loop: true,
			controls: true,
			autoplay: false,
			playsInline: true,
		}

		const t0 = useVideoTexture(urls[0], opts) as THREE.VideoTexture
		const t1 = useVideoTexture(urls[1], opts) as THREE.VideoTexture
		const t2 = useVideoTexture(urls[2], opts) as THREE.VideoTexture
		const t3 = useVideoTexture(urls[3], opts) as THREE.VideoTexture
		const t4 = useVideoTexture(urls[4], opts) as THREE.VideoTexture

		return useMemo(() => {
			const textures: THREE.VideoTexture[] = [t0, t1, t2, t3, t4]

			textures.forEach((t: THREE.VideoTexture) => {
				t.generateMipmaps = false
				t.minFilter = THREE.LinearFilter
				t.magFilter = THREE.LinearFilter
				t.anisotropy = 1
				t.wrapS = THREE.ClampToEdgeWrapping
				t.wrapT = THREE.ClampToEdgeWrapping;
				// colorSpace may not be typed on older three types, cast to any to assign safely
				(t as any).colorSpace = THREE.SRGBColorSpace
			})

			return textures
		}, [t0, t1, t2, t3, t4])
	}

	const videoTextures = useVideoTextures(videosURLs)

	const { camera, viewport } = useThree()
	const { width: vw, height: vh } = viewport.getCurrentViewport(camera, new THREE.Vector3(0, 0, 0))
	// const vh = viewport.height
	// const vw = viewport.width

	const targetAspect = 9 / 16 // width / height
	const [fitMode, setFitMode] = useState<'contain' | 'cover'>('cover')
	// const fitMode: = 'contain' // switch to 'cover' if you want it to fill

	const scale = useMemo(() => {
		const vpAspect = vw / vh
		let w: number, h: number
		if (fitMode === 'contain') {
			// fit inside viewport without cropping
			if (vpAspect > targetAspect) {
				// viewport is wider -> limit by height
				h = vh
				w = vh * targetAspect
			} else {
				// viewport is narrower -> limit by width
				w = vw
				h = (vw / targetAspect)
			}
		} else {
			// fill viewport, may crop
			if (vpAspect > targetAspect) {
				// viewport is wider -> fill width
				w = vw
				h = (vw / targetAspect)
			} else {
				// viewport is narrower -> fill height
				h = vh
				w = (vh * targetAspect)
			}
		}

		return [w, h, 1] as [number, number, number]
		// }, [vw, vh, targetAspect])
	}, [videoMatRef])



	useEffect(() => {
		// const vid = videoTextures.at(-sectionIndex)?.image as HTMLVideoElement | undefined
		// if (!vid) return
		// if (videoClicked) return // <--- Removed this early return

		videoTextures.forEach((tex, index) => {
			const vid = tex.image as HTMLVideoElement | undefined
			if (!vid) return

			if (index === THREE.MathUtils.euclideanModulo(-sectionIndex, videoTextures.length)) {
				// console.log('play video index:', index)
				// vid.currentTime = 0
				vid.play().catch(() => { })
			} else {
				vid.pause()
				// Only perform the heavy src reset if NOT clicked. 
				// This prevents glitches/black screens on background videos during the expand animation.
				if (!videoClicked) {
					const src = vid.currentSrc
					if (src) {
						vid.removeAttribute('src')
						vid.load()
						setTimeout(() => { vid.src = src }, 0)
					}
				}
			}
		})
	}, [videoTextures, sectionIndex, videoClicked])

	useEffect(() => {
		// on mount, set the initial texture
		if (videoMatRef.current) {
			const index = THREE.MathUtils.euclideanModulo(-sectionIndex, videoTextures.length)
			videoMatRef.current.uImage1Tex = videoTextures[index]
		}
	}, [videoTextures])

	useEffect(() => {
		if (videoMatRef.current) {

			if (videoClicked) {
				// Force assignment of the correct texture when clicked to prevent black screen on first load
				const index = THREE.MathUtils.euclideanModulo(-sectionIndex, videoTextures.length)
				videoMatRef.current.uImage1Tex = videoTextures[index]

				if (lenis) {
					lenis.start()
					lenis.scrollTo(0, {
						immediate: false,
						lerp: 0.05,
						// duration: 0.4,
						onComplete: () => {
							// lenis.stop()
						},
					})
					// lenis.stop()
				}

				animate(fishEyeValue, 2, {
					// duration: 0.8,
					// ease: [0.771, 0.127, 0.486, 0.939],
					type: "spring",
					stiffness: 162,
					damping: 109,
					mass: 1,
					restDelta: 0.04,
					onUpdate: (value) => {
						// clickedValue.set(value)
						// console.log('test', THREE.MathUtils.pingpong(value, 1))
						videoMatRef.current!.uClickedValue = value / 2
						videoMatRef.current!.uFishEyeValue = THREE.MathUtils.pingpong(value, 1)
					},
					onComplete: () => {
						// expandedDone.current = true
						setExpanded(true)
						if (videoTitle === 'studio') {
							animate(planeRef.current!.position, { y: -2.4, z: 0 }, {
								type: "spring",
								stiffness: 162,
								damping: 109,
								mass: 1,
								restDelta: 0.04,
							})
						}
						else if (videoTitle === 'artists') {
							animate(planeRef.current!.position, { y: 14.5, z: -50, x: 0 }, {
								type: "spring",
								visualDuration: 1.1,
								bounce: 0
							})
							animate(planeRef.current!.scale, { x: 0, y: 0, z: 0 }, {
								// duration: 0.4,
								type: "spring",
								visualDuration: 1.1,
								bounce: 0,
								// ease: [0.538, 0.136, 0.856, 0.361],
								ease: 'easeInOut',
								delay: 0.4,
								// onUpdate: (value) => {
								// 	if (planeRef.current) {
								// 		planeRef.current.position.lerp(new Vector3(0, 3 * value , -2), 0.1)
								// 	}
								// }
							})
						}
						animate(expandValue, 1, {
							type: "spring",
							visualDuration: 1.65,
							bounce: 0,
							onUpdate: (value) => {
								if (videoTitle === 'artists') {
									const cropTop = THREE.MathUtils.clamp(0.0 * value, 0, 0.95)
									const cropBottom = THREE.MathUtils.clamp(0.2 * value, 0, 0.95)
									const repeatY = Math.max(1 - (cropTop + cropBottom), 1e-4)
									videoMatRef.current!.uUVRepeat.set(1, repeatY)
									videoMatRef.current!.uUVOffset.set(0, cropBottom)
								}
								else {
									const cropTop = THREE.MathUtils.clamp(0.18 * value, 0, 0.5)
									videoMatRef.current!.uUVRepeat.set(1, 1 - 2 * cropTop)
									videoMatRef.current!.uUVOffset.set(0, cropTop)
								}

								// const cropTop = THREE.MathUtils.clamp(0.20 * value, 0, 0.95)
								// const cropBottom = THREE.MathUtils.clamp(0.10 * value, 0, 0.95)
								// const repeatY = Math.max(1 - (cropTop + cropBottom), 1e-4)
								// videoMatRef.current!.uUVRepeat.set(1, repeatY)
								// videoMatRef.current!.uUVOffset.set(0, cropBottom)

								videoMatRef.current!.uExpandedValue = value
								doOnceRef.current = false
							},
						})
					}
				})

			}
			else {
				if (lenis) {
					lenis.start()
					lenis.scrollTo(0, {
						immediate: false,
						// duration: 0.4,
						lerp: 0.05,
						onComplete: () => {
							// lenis.stop()
						},
					})
					// lenis.stop()
				}
				animate(fishEyeValue, 0, {
					// duration: 0.8,
					// ease: [0.153, 0.597, 0.486, 0.939],
					type: "spring",
					stiffness: 162,
					damping: 140,
					mass: 1,
					restDelta: 0.06,
					onPlay: () => {
						videoMatRef.current!.uUVRepeat.set(1, 1)
						videoMatRef.current!.uUVOffset.set(0, 0)
					},
					onUpdate: (value) => {
						// clickedValue.set(value)
						videoMatRef.current!.uClickedValue = value / 2
						videoMatRef.current!.uFishEyeValue = THREE.MathUtils.pingpong(value, 1)
					},
					onComplete: () => {
						expandedDone.current = false
						animate(expandValue, 0, {
							type: "spring",
							stiffness: 162,
							damping: 109,
							mass: 1,
							restDelta: 0.04,
							onUpdate: (value) => {
								videoMatRef.current!.uExpandedValue = value
							},
						})
					}
				})
			}
		}
	}, [videoClicked, lenis, expandedDone])

	const exitVideoValue = useMotionValue(0)
	const positionValue = useMotionValue(0)
	const videoHidden = useRef(false)

	useEffect(() => {
		if (titleAnimationDone) {
			if (videoTitle === 'artists') {
				// animate(planeRef.current!.scale, { x:0, y:0, z:0 }, {
				// 	duration: 0.4,
				// 	// type: "spring",
				// 	// visualDuration: 1.0,
				// 	// bounce: 0,
				// 	// ease: [0.538, 0.136, 0.856, 0.361],
				// 	ease: 'easeInOut',
				// 	delay: 0.0,
				// 	// onUpdate: (value) => {
				// 	// 	if (planeRef.current) {
				// 	// 		planeRef.current.position.lerp(new Vector3(0, 3 * value , -2), 0.1)
				// 	// 	}
				// 	// }
				// })
			}
			else {
				animate(planeRef.current!.position, { y: 4, z: 0 }, {
					duration: 1.4,
					// type: "spring",
					// visualDuration: 1.0,
					// bounce: 0,
					// ease: [0.538, 0.136, 0.856, 0.361],
					ease: 'easeInOut',
					delay: 0.4,
					// onUpdate: (value) => {
					// 	if (planeRef.current) {
					// 		planeRef.current.position.lerp(new Vector3(0, 3 * value , -2), 0.1)
					// 	}
					// }
				})
			}
			animate(exitVideoValue, 1, {
				// type: "spring",
				// visualDuration: 1.6,
				// bounce: 0,
				// delay: 0.25,
				// restDelta: 0.04,
				duration: 1.2,
				delay: 0.4,
				// ease: [0.538, 0.136, 0.856, 0.361],
				ease: 'easeOut',
				onUpdate: (value) => {
					if (videoTitle === 'artists') {

					}
					else {
						const cropTop = THREE.MathUtils.clamp(0.36 * value, 0, 0.5)
						videoMatRef.current!.uUVRepeat.set(1, 1 - 0.36 - 2 * cropTop)
						videoMatRef.current!.uUVOffset.set(0, 0.18 + cropTop)
					}
				},
				onComplete: () => {
					videoHidden.current = true
					groupRef.current!.visible = false
					videoTextures[THREE.MathUtils.euclideanModulo(-sectionIndex, videoTextures.length)].image.pause()
					setPageAnimationStart(true)
				}
			})
		}
	}, [titleAnimationDone])


	useEffect(() => {
		if (videoMatRef.current && prevSectionIndexRef.current !== sectionIndex) {
			if (videoClicked) return

			// section changed
			animate(progressValue, 1, {
				duration: 0.3,
				// ease: [0.559, 0.215, 0.553, 0.803],
				ease: 'backIn',
				onUpdate: (value) => {
					videoMatRef.current!.uProgress = value
				},
				onComplete: () => {
					// progressValue.set(0)
					animate(progressValue, 0, {
						duration: 0.35,
						ease: [0.559, 0.215, 0.553, 0.803],
						delay: 0.2,
						onUpdate: (value) => {
							videoMatRef.current!.uProgress = value
						},
					})
					prevSectionIndexRef.current = sectionIndex
					videoMatRef.current!.uImage1Tex = videoTextures.at(-sectionIndex)!
				},
			})
		}
	}, [sectionIndex])

	useFrame((state, delta) => {
		if (!textGroupRef.current || !videoMatRef.current || !groupRef.current || !planeRef.current) return

		videoMatRef.current.uResolution.set(state.size.width, state.size.height, 1)

		// if(videoClicked && expandedDone.current && !titleAnimationDone){

		// }  
		// if(!videoClicked && !titleAnimationDone) {
		// 	// planeRef.current.position.set(0,0,0)
		// 	if(doOnceRef.current === false){
		// 		easing.damp3(
		// 			planeRef.current.position,
		// 			new Vector3(0, 0, 0),
		// 			0.5,
		// 			delta,
		// 			100,
		// 			(t: number) => 1 / (1 + t + 0.48 * t * t + 0.235 * t * t * t),
		// 		)
		// 		if(planeRef.current.position.distanceTo(new Vector3(0,0,0)) < 0.01)
		// 		doOnceRef.current = true
		// 	}

		// }


		// if(titleAnimationDone){
		// 	setTimeout(() => {
		// 		easing.damp3(
		// 			textGroupRef.current!.position, 
		// 			new Vector3(0, 5, 0),
		// 			0.7,
		// 			delta,
		// 			100,
		// 			(t: number) => 1 / (1 + t + 0.48 * t * t + 0.235 * t * t * t),
		// 		)
		// 	}, 300)
		// }
	})


	return (
		<group ref={groupRef}
		// visible={index === 0 || introCompleted} 

		>
			<group
				// theatreKey="image group" 
				ref={textGroupRef}
			>
				{/* <e.group theatreKey="imageTex"  > */}
				{/* <mesh>
						<planeGeometry args={[54, 30]} />
						<meshStandardMaterial map={wallTexture}   />
					</mesh> */}
				{/* <mesh scale={[19.2 ,10.8, 0.01]}  > */}
				{/* <ScreenSizer scale={1}>	 */}
				<mesh ref={planeRef} scale={scale} >
					<planeGeometry args={[1, 1, 1, 1]} />
					{/* <meshBasicMaterial color={'black'} /> */}
					<mobileVideoShaderMaterial key={MobileVideoShaderMaterial.key} ref={videoMatRef} transparent />
					{/* <Suspense fallback={<FallbackMaterial url="test.png" />}>
							<VideoMaterial url="0912.mp4" />
						</Suspense> */}
				</mesh>
				{/* </ScreenSizer> */}
				{/* <Environment preset="city" environmentIntensity={0.2} /> */}
				{/* </e.group> */}
			</group>
		</group>
	)
}

