'use client'

// import { editable as e, PerspectiveCamera } from '@theatre/r3f'
import { useIsClient } from '@uidotdev/usehooks'
import { useRef } from 'react'
import * as THREE from 'three'
// import { Vector3 } from 'three'
// import { easing } from 'maath'
// import BgPlane from './BgPlane'
import { useWheelStore } from '@/src/lib/store/useWheelStore'
import {  PerspectiveCamera } from '@react-three/drei'
import MobileVideoTile from './MobileVideoTile'
import StudioImages from './StudioImages'
import ArtistImages from './ArtistsImages'
import MobileBgPlane from './MobileBgPlane'




export default function MobileHome() {

	const cameraRef = useRef<THREE.PerspectiveCamera>(null)
	const groupRef = useRef<THREE.Group>(null)
	const pageAnimationStart = useWheelStore((state) => state.pageAnimationStart)
	const videoTitle = useWheelStore((state) => state.videoTitle)


	const isClient = useIsClient()
	if (!isClient) return null

	return (
		<>
			<PerspectiveCamera
				ref={cameraRef}
				// theatreKey="Camera"
				makeDefault
				fov={50}
				position={[0, -0.0, 6]}
				near={0.001}
				far={50000}
			/>
			<MobileBgPlane />

			<group
				// visible={groupVisible}
				ref={groupRef}
			>
				<group
				// position={new Vector3((i - 0.0) * (calculatedTileWidth), 0, 0.5)}
				>
					<MobileVideoTile />
				</group>
			</group>
			<group visible={pageAnimationStart}>

				{
					videoTitle === 'studio' &&
					<StudioImages />}
				{ videoTitle === 'artists' &&
					<ArtistImages />}
			</group>

		</>
	)
}


