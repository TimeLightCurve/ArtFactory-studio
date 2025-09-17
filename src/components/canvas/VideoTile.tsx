import { ScreenSizer, shaderMaterial, useAspect, useTexture, useVideoTexture } from "@react-three/drei"
import { extend, Object3DNode, useFrame } from "@react-three/fiber"
import { types } from "@theatre/core"
import { editable as e, useCurrentSheet } from "@theatre/r3f"
import { use, useEffect, useRef } from "react"
import * as THREE from 'three'
import { Vector3 } from "three"
// @ts-expect-error
import imageVertex from '../../glsl/images/imageVertex.glsl'
// @ts-expect-error
import imageFragment from '../../glsl/images/imageFragment.glsl'
import { useIntroStore } from "@/src/lib/store/useIntroStore"
import { easing } from 'maath'
import { useMotionValueEvent, useScroll } from "motion/react"
import { useLenis } from "lenis/react"
import { useWindowSize } from "@uidotdev/usehooks"

export const VideoShaderMaterial = shaderMaterial(
	{
		uTime: 0,
		uColor: new THREE.Color(0.2, 0.0, 0.1),
		uProgress: 0,
		uImage1Tex: new THREE.Texture,
		uResolution: new Vector3(1, 1, 1),
		uAlpha: 0,
		uVelocity: 0,
	},
	imageVertex,
	imageFragment,
)
extend({ VideoShaderMaterial })

export interface IVideoShaderMaterial extends THREE.ShaderMaterial {
	uTime: number
	uColor: THREE.Color,
	uProgress: number,
	uImage1Tex: THREE.Texture,
	uResolution: Vector3,
	uAlpha: number,
	uVelocity: number,

}

declare module '@react-three/fiber' {
	interface ThreeElements {
		videoShaderMaterial: Object3DNode<IVideoShaderMaterial, typeof VideoShaderMaterial>
	}
}

type VideoProps = {
	index: number
	url: string 
}

export default function VideoTile({index, url}: VideoProps) {
	const textGroupRef = useRef<THREE.Group>(null)
	const groupRef = useRef<THREE.Group>(null)

	const imageMatRef = useRef<IVideoShaderMaterial>(null)
	const imageProgressRef = useRef(0)

	const lenis = useLenis()

	const ribbonSheet = useCurrentSheet()

	const visible = useIntroStore((state) => state.visible)

	const introCompleted = useIntroStore((state) => state.introCompleted)

	const setVideoClicked = useIntroStore((state) => state.setVideoClicked)
	const videoClicked = useIntroStore((state) => state.videoClicked)

	const tileWidthFactor = 20.9

	// const imageTextureRef = useRef<THREE.Texture>(null)

	// const videoTextureRef = useRef<THREE.VideoTexture>(null)
	
	// const imageTexture = useTexture('test.png')
	const {scrollYProgress } = useScroll()
	// const scrollProgressRef = useRef(0)
	const indexTracker = useRef(0)

	const planeRef = useRef<THREE.Mesh>(null)

	useMotionValueEvent(scrollYProgress, "change", (scrollYProgress) => {
		indexTracker.current = (scrollYProgress * 4)
		// scrollProgressRef.current = scrollYProgress * 4 % 1
		// indexTracker.current = Math.floor((scrollYProgress * 100) / (100 / 4) + 0.04)
		// indexTracker.current = (scrollYProgress * 100) / 16.6667
	})


	const videoTexture = useVideoTexture(url,{
		start: false,
		muted: true,
		loop: true,
	})

	const firstPlayDelayedRef = useRef(false)
	const {width} = useWindowSize()
	const tileWidth = width ? width : 1920
	const tileHeight = tileWidth * 9 / 16


	useEffect(() => {
		const vid = videoTexture?.image as HTMLVideoElement | undefined
		if (!vid) return

		let timeoutId: number | undefined
		const shouldPlay = visible && index === videoClicked.videoIndex

		if (shouldPlay) {
			if (!introCompleted && !firstPlayDelayedRef.current) {
				timeoutId = window.setTimeout(() => {
					vid.play().catch(() => { })
					firstPlayDelayedRef.current = true
				}, 600)
			} else {
				vid.play().catch(() => { })
			}
		} else {
			vid.pause()
			vid.currentTime = 0
		}

		return () => {
			if (timeoutId) window.clearTimeout(timeoutId)
		}
	}, [videoTexture, visible, index, videoClicked.videoIndex, introCompleted])




	const imageProgress = ribbonSheet?.object('imageProgress',
		{
			x: types.number(0,
				{
					range: [-1, 1.5],
					nudgeMultiplier: 0.0001
				}
			)
		},
		{ reconfigure: true }
	)
	imageProgress?.onValuesChange((value) => {
		imageProgressRef.current = value.x
	}
	)



	useFrame((state, delta) => {
		if (!textGroupRef.current || !imageMatRef.current || !groupRef.current) return

		if (lenis) {
			easing.damp(imageMatRef.current,'uVelocity', Math.abs(lenis.velocity), 0.25, delta)
		}

		imageMatRef.current.uResolution.set(state.size.width, state.size.height, 1)

		imageMatRef.current.uProgress = imageProgressRef.current
		imageMatRef.current.uImage1Tex = videoTexture
			
		imageMatRef.current.uTime = state.clock.elapsedTime

		if(index === 0 ){		
			if(!introCompleted){
				imageMatRef.current.uAlpha = 0
				groupRef.current.position.set(0,0, 4.85)
			}
			else{
				// console.log('videoIndex', videoClicked.videoIndex, '   --clicked', videoClicked.clicked)
				if(videoClicked.clicked && videoClicked.videoIndex === index){
					easing.damp3(
						groupRef.current.position,
						[(indexTracker.current * tileWidthFactor), 0, 4.4],
						0.5,
						delta,
						1000,
						(t: number) => 1 / (1 + t + 0.48 * t * t + 0.235 * t * t * t),
					)
					// easing.damp(imageMatRef.current, 'uAlpha', 0, 0.2, delta)

				} else {
					easing.damp3(
						groupRef.current.position, 
						[0, 0, 0.05], 
						0.55, 
						delta, 
						200, 
						(t: number) => 1 / (1 + t + 0.48 * t * t + 0.235 * t * t * t),
					)				
				}

				if (Math.floor(indexTracker.current) === index) {
					easing.damp(imageMatRef.current, 'uAlpha',
						1.5,
						0.5,
						delta,
						200,
						(t: number) => 1 / (1 + t + 0.48 * t * t + 0.235 * t * t * t),
					)
				} else {
					easing.damp(imageMatRef.current, 'uAlpha',
						1.95,
						0.5,
						delta,
						200,
					)
				}
						
			}
		}
		 else {
			
			if (videoClicked.clicked && videoClicked.videoIndex === index) {
				easing.damp3(
					groupRef.current.position,
					// [0 - ((index )* tileWidthFactor) , 0, 4.4],
					[(-index + indexTracker.current) * tileWidthFactor, 0, 4.4],
					0.5,
					delta,
					1000,
					(t: number) => 1 / (1 + t + 0.48 * t * t + 0.235 * t * t * t),
				)
				// easing.damp(imageMatRef.current, 'uAlpha', 0, 0.2, delta)
			} else {
				easing.damp3(
					groupRef.current.position,
					[0, 0, 0.05],
					0.55,
					delta,
					200,
					(t: number) => 1 / (1 + t + 0.48 * t * t + 0.235 * t * t * t),
				)
				// if(videoClicked.videoIndex !== index){
				// // easing.damp(imageMatRef.current, 'uAlpha', 1.9, 0.1, delta)
				// } else {
				// 	easing.damp(imageMatRef.current, 'uAlpha', 1.3, 0.1, delta)
				// }
			}
			// console.log('indexTracker:', indexTracker.current % 1, )
			const limitArea = indexTracker.current % 1
			if(Math.floor(indexTracker.current) === index && limitArea < 0.2 ){
				easing.damp(imageMatRef.current, 'uAlpha', 
					1.7, 
					0.5, 
					delta, 
					200,
					(t: number) => 1 / (1 + t + 0.48 * t * t + 0.235 * t * t * t),
				)
			} else {
				easing.damp(imageMatRef.current, 'uAlpha', 
					1.95, 
					0.5, 
					delta,
					200,
				)
			}
			
		}

		// console.log('utime', imageMatRef.current.uTime)
		// if (selectedImage.current !== currentImage.current && ribbonSheet) {
		// 	setImageIndex(currentImage.current)
		// }
		if(planeRef.current){
			planeRef.current.scale.lerp(new Vector3(tileWidth / 100, tileHeight / 100, 1), 0.1)	
		}
	})
	

	return (
		<group ref={groupRef} visible={index === 0 || introCompleted} onClick={()=>{
			// console.log('clicked video', index)
			if (introCompleted) {
				setVideoClicked({clicked: !videoClicked.clicked , videoIndex:index})
			}
		}} >
			<e.group theatreKey="image group" ref={textGroupRef} >
				<e.group theatreKey="imageTex" >
					{/* <mesh>
						<planeGeometry args={[54, 30]} />
						<meshStandardMaterial map={wallTexture}   />
					</mesh> */}
					{/* <mesh scale={[19.2 ,10.8, 0.01]}  > */}
					{/* <ScreenSizer scale={1}>	 */}
						<mesh ref={planeRef} >
							<planeGeometry args={[1, 1, 192,108]} />
							{/* <meshBasicMaterial color={'black'} /> */}
							<videoShaderMaterial key={VideoShaderMaterial.key} ref={imageMatRef} transparent />
							{/* <Suspense fallback={<FallbackMaterial url="test.png" />}>
								<VideoMaterial url="0912.mp4" />
							</Suspense> */}
						</mesh>
					{/* </ScreenSizer> */}
					{/* <Environment preset="city" environmentIntensity={0.2} /> */}
				</e.group>
			</e.group>
		</group>
	)
}

