'use client'

import MobileHome from "@/src/components/canvas/MobileHome"
import { Preload } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
// import { useWindowSize } from "@uidotdev/usehooks"
import { Suspense } from "react"
import * as THREE from 'three'

export default function MobileCanvas() {



	// useAnimationFrame((time)=>{
	// 	if (lenis) {
	// 		console.log('lenis.scroll:', lenis.progress)
	// 		return y.set(lenis.scroll)
	// 	}
	// })


	// const { height} = useWindowSize()
	// const windowHeight = window.document.body.clientHeight 
	// console.log('windowHeight:', window.document.body.clientHeight)

	return (
		// <motion.div
		// 	className=" flex flex-col w-full h-svh shrink-0  "
		// 	// style={{ height: 900 + 8 }}
		// >
		<div className=" flex flex-col w-full h-svh shrink-0 z-0">
			{/* <div className="  flex flex-col w-full h-32 shrink-0 justify-end items-center z-50 text-white"/> */}
			<Canvas
				shadows
				gl={{
					antialias: false,
					preserveDrawingBuffer: false,
					powerPreference: 'high-performance',
					// toneMappingExposure: 1,
					// precision: "highp",
				}}
				onCreated={({ gl }) => {
					gl.clearDepth()
					gl.toneMapping = THREE.NoToneMapping
					gl.getContext().getExtension('OES_texture_float')
				}}
				dpr={[1, 1.5]}
				style={{
					zIndex: 0,
					position: 'fixed',
					// bottom: 0,
					top: 0,
					width: '100vw',
					height: '100lvh',
					// display: 'flex',
					//   pointerEvents: 'auto',
				}}

			>
				<Suspense fallback={null}>
					<MobileHome />
					<Preload all />
				</Suspense>
			</Canvas>
		</div>
		// </motion.div>
	)
}
