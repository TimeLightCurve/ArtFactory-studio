'use client'

import { useFrame } from '@react-three/fiber'
// import { editable as e, PerspectiveCamera } from '@theatre/r3f'
import { useIsClient } from '@uidotdev/usehooks'
import {  useRef } from 'react'
import * as THREE from 'three'
// import { Vector3 } from 'three'
// import { easing } from 'maath'
// import BgPlane from './BgPlane'
import { PerspectiveCamera } from '@react-three/drei'
import MobileVideoTile from './MobileVideoTile'
import ImageInstances from './ImageInstances'
import { useLenis } from 'lenis/react'
import { easing } from 'maath'
import { useWheelStore } from '@/src/lib/store/useWheelStore'






export default function MobileHome() {

	const cameraRef = useRef<THREE.PerspectiveCamera>(null)
	const groupRef = useRef<THREE.Group>(null)
	const lenis = useLenis()
	const pageAnimationStart = useWheelStore((state) => state.pageAnimationStart)
	


	useFrame((state, delta) => {

		 
		if(lenis){
			if(cameraRef.current){
				
				// cameraRef.current.position.lerpVectors(new THREE.Vector3(0, 0, 6), new THREE.Vector3(0, -30, 6), lenis.progress) 
				easing.damp(cameraRef.current.position, 'y', -35 * lenis.progress, 0.5, 0.1)
			}
		}

		// 		easing.damp3(
		// 			cameraRef.current.position, 
		// 			new Vector3(0, 0, 8),
		// 			0.5,
		// 			delta,
		// 			100,
		// 			(t: number) => 1 / (1 + t + 0.48 * t * t + 0.235 * t * t * t),
		// 		)

	})


	const isClient = useIsClient()
	if (!isClient) return null

	return (
		<>
			<PerspectiveCamera
				ref={cameraRef}
				// theatreKey="Camera"
				makeDefault
				fov={60}
				position={[0, -0.0, 6]}
				near={0.001}
				far={50000}
			/>
			{/* <BgPlane /> */}
			<group 
				// visible={groupVisible}
				ref={groupRef}
			>
				<group 
					// position={new Vector3((i - 0.0) * (calculatedTileWidth), 0, 0.5)}
					>
					<MobileVideoTile  />
				</group>	
			</group>
			<group visible={pageAnimationStart}>

			<ImageInstances/>
			</group>
		</>
	)
}


