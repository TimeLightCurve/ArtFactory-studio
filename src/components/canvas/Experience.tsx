'use client'

import { useFrame } from '@react-three/fiber'
import { editable as e, PerspectiveCamera } from '@theatre/r3f'
import { useIsClient, useWindowSize } from '@uidotdev/usehooks'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Vector3 } from 'three'
import VideoTile from './VideoTile'
import { useIntroStore } from '@/src/lib/store/useIntroStore'
import { useMotionValueEvent, useScroll } from 'motion/react'
import { easing } from 'maath'
import { useLenis } from 'lenis/react'
import BgPlane from './BgPlane'



// const videosURLs = [
// 	// 'videos/VID_20250914_235423_960_1.mp4',
// 	'videos/VID_20250914_235348_493_2.mp4',
// 	'videos/VID_20250914_235348_493_1.mp4',
// 	'videos/VID_20250914_235344_085_1.mp4',
// 	'videos/VID_20250914_235344_085_2.mp4',
// 	'videos/VID_20250914_235344_085_3.mp4',
// 	// 'videos/VID_20250914_235346_816_1.mp4',
// 	// 'videos/VID_20250914_235346_816_2.mp4',
// ]


const videosURLs = [
	 'videos/video1.mp4',
	 'videos/video2.mp4',
	 'videos/video3.mp4',
	 'videos/video4.mp4',
	 'videos/video5.mp4',
]


export default function Experience() {

	const isMobile = window.innerWidth < 768
	const cameraRef = useRef<THREE.PerspectiveCamera>(null)
	const groupRef = useRef<THREE.Group>(null)


	const { scrollYProgress } = useScroll()
	const lenis = useLenis()

	const scrollProgressRef = useRef(0)
	const indexTracker = useRef(0)

	const {width} = useWindowSize()

	const tileWidthFactor = 20.9
	const windowWidth = width ? width : 1920
	const calculatedTileWidth = (windowWidth / 1920) * tileWidthFactor

	useMotionValueEvent(scrollYProgress, "change", (scrollYProgress) => {
		indexTracker.current = scrollYProgress * 4
		scrollProgressRef.current = (indexTracker.current % 1) 
	})


	const {visible} = useIntroStore()

	const [groupVisible, setGroupVisible] = useState(false)
	// manage delayed visibility for the group so the visible prop is a boolean
	useEffect(() => {
		let timer: ReturnType<typeof setTimeout> | null = null
		if (visible) {
			timer = setTimeout(() => setGroupVisible(true), 500)
		} else {
			// when not visible, hide immediately
			setGroupVisible(false)
		}
		return () => {
			if (timer) clearTimeout(timer)
		}
	}, [visible])

	const fullWidth = (videosURLs.length - 1) * calculatedTileWidth

	useFrame((state, delta) => {

		if(groupRef.current){
			easing.damp3(
				groupRef.current.position,
				new Vector3(-scrollYProgress.get() * fullWidth, 0, 0),
				0.5,
				delta ,
				300,
				(t: number) => 1 / (1 + t + 0.48 * t * t + 0.235 * t * t * t),
			)
		}
		if(lenis && cameraRef.current){

			const velocity = THREE.MathUtils.smootherstep(THREE.MathUtils.clamp(Math.abs(lenis.velocity + 0.2),0, 100), 0, 100) * 100

			if(velocity > 55){
				easing.damp3(
					cameraRef.current.position, 
					new Vector3(0, 0, 18),
					0.5,
					delta,
					200,
					(t: number) => 1 / (1 + t + 0.48 * t * t + 0.235 * t * t * t),
				)
			} else if(velocity > 30){
				easing.damp3(
					cameraRef.current.position,
					new Vector3(0, 0, 13),
					0.5,
					delta,
					200,
					(t: number) => 1 / (1 + t + 0.48 * t * t + 0.235 * t * t * t),
				)
			} else if(velocity < 20){ 
				easing.damp3(
					cameraRef.current.position, 
					new Vector3(0, 0, 8),
					0.5,
					delta,
					100,
					(t: number) => 1 / (1 + t + 0.48 * t * t + 0.235 * t * t * t),
				)
			}

			if (lenis) {
				if( Math.abs(lenis.velocity ) < 20 ){
					
					const sectionWidth = (lenis.dimensions.scrollHeight - lenis.dimensions.height )/ 4
					
					if (scrollProgressRef.current > 0.25 && scrollProgressRef.current < 0.45) {
						lenis.scrollTo(sectionWidth * (Math.floor(indexTracker.current) + 1 ) , { duration: 1.0 , lock: true})
					} 
					if (scrollProgressRef.current > 0.6  && scrollProgressRef.current < 0.65) {				
						lenis.scrollTo(sectionWidth * (Math.floor(indexTracker.current)) , { duration: 1.2, lock: true})			
					}
				}
			} 
		}
	})


	const isClient = useIsClient()
	if (!isClient) return null

	return (
		<>
			<PerspectiveCamera
				ref={cameraRef}
				theatreKey="Camera"
				makeDefault
				fov={60}
				position={[0, 0, 8]}
				near={0.001}
				far={50000}
			/>
			<BgPlane />

			{/* <ImageTile 
			/> */}
			<group visible={groupVisible} ref={groupRef}>
				{videosURLs.map((url, i) => (
					<group key={i} position={new Vector3((i - 0.0) * (calculatedTileWidth), 0, 0.5)}>
						<VideoTile index={i} url={url} />
					</group>
				))
				}
			</group>
			{/* <VideoTile /> */}


			{/* <OrbitControls /> */}
		</>
	)
}


