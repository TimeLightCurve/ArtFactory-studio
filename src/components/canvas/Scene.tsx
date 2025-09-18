'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect} from 'react'
import * as THREE from 'three'
import { Preload } from '@react-three/drei'
import { getProject } from '@theatre/core'
import {  SheetProvider } from '@theatre/r3f'
// import extension from '@theatre/r3f/dist/extension'
// import studio from '@theatre/studio'
import projectState from '@/public/Art factory Project.theatre-project-state.json'
import Experience from './Experience'
// import { useIsClient } from '@uidotdev/usehooks'
import { Leva } from 'leva'
import { useIntroStore } from '@/src/lib/store/useIntroStore'


const isProd = true

// if (!isProd) {
//   studio.initialize()
//   studio.extend(extension)
//   studio.ui.hide()
// }

export const project = getProject(
	'Art factory Project',
	isProd
		? {
			state: projectState,
		}
		: undefined
)
export const newSheet = project.sheet('art factory sheet')



export default function Scene({ ...props }) {
	// const setIntroCompleted = useAnimationStore((state) => state.setIntroCompleted)
	// const [start, setStart] = useState(false)
	// const isClient = useIsClient()
	// const GPUTier = useDetectGPU()

	const visible = useIntroStore((state) => state.visible)
	const setIntroCompleted = useIntroStore((state) => state.setIntroCompleted)

	useEffect(() => {
			// Delay the animation by 2.5 seconds
			// console.log("Visible in scene:", visible)
			const animationTimer = setTimeout(() => {
				project.ready.then(() => {
					newSheet.sequence.position = 0
					newSheet.sequence.pause()
					if(visible){
						newSheet.sequence
							.play({
								range: [0, 3 + 5/30],
								
							}).then(() => {
								// setIntroCompleted(true)
								setTimeout(() => {

									setIntroCompleted(true)
								}, 1000)
							})
					} else {
						// console.log("Pausing sheet")
						newSheet.sequence.position = 0
						newSheet.sequence.pause()
					}
				})
			}, 0)

			// Cleanup function to clear the timeout if component unmounts
			return () => clearTimeout(animationTimer)
	}, [visible])


	// if (!isClient) return null

	return (
		<>
		<Leva hidden />
				<Canvas
					{...props}
					shadows
					// orthographic
					gl={{
						antialias: false,
						preserveDrawingBuffer: true,
						powerPreference: 'high-performance',
						// toneMappingExposure: 1,
						// precision: "highp",
					}}
					onCreated={({ gl }) => {
						gl.clearDepth()
						gl.toneMapping = THREE.NoToneMapping
						gl.getContext().getExtension('OES_texture_float')
					}}
					dpr={2}
					style={{
						zIndex: 30,
						position: 'fixed',
						top: 0,
						left: 0,
						width: '100vw',
						height: '100vh',
						pointerEvents: 'auto',
					}}
				>
					{/* <Stats /> */}

					<Suspense fallback={null}>
						<SheetProvider sheet={newSheet}>
							<group >
								<Experience />
							</group>
							<Preload all />
						</SheetProvider>
					</Suspense>
				</Canvas>
		</>
	)
}
