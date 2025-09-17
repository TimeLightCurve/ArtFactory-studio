import { Environment, shaderMaterial, useTexture } from "@react-three/drei"
import { extend, Object3DNode, useFrame } from "@react-three/fiber"
import { types } from "@theatre/core"
import { editable as e, useCurrentSheet } from "@theatre/r3f"
import { MutableRefObject, useEffect, useRef, useState } from "react"
import * as THREE from 'three'
import { Vector3 } from "three"
// @ts-expect-error
import imageVertex from '../../glsl/images/imageVertex.glsl'
// @ts-expect-error
import imageFragment from '../../glsl/images/imageFragment.glsl'


export const ImageShaderMaterial = shaderMaterial(
	{
		uTime: 0,
		uColor: new THREE.Color(0.2, 0.0, 0.1),
		uProgress1: 0,
		uProgress2: 0,
		uProgress3: 0,
		uProgress4: 0,
		uImage1Tex: new THREE.Texture,
		uImage2Tex: new THREE.Texture,
		uResolution: new Vector3(1, 1, 1),
	},
	imageVertex,
	imageFragment,
)
extend({ ImageShaderMaterial })

export interface IimageShaderMaterial extends THREE.ShaderMaterial {
	uTime: number
	uColor: THREE.Color,
	uProgress1: number,
	uProgress2: number,
	uProgress3: number,
	uProgress4: number,
	uImage1Tex: THREE.Texture,
	uImage2Tex: THREE.Texture,
	uResolution: Vector3,

}

declare module '@react-three/fiber' {
	interface ThreeElements {
		imageShaderMaterial: Object3DNode<IimageShaderMaterial, typeof ImageShaderMaterial>
	}
}

type imageTexProps = {
	timeRef: MutableRefObject<number>
	currentImage: MutableRefObject<number>
	isMobile: boolean
}

export default function ImageTile() {
	const textGroupRef = useRef<THREE.Group>(null)
	const groupRef = useRef<THREE.Group>(null)

	const imageMatRef = useRef<IimageShaderMaterial>(null)
	const imageProgress1Ref = useRef(0)
	const imageProgress2Ref = useRef(0)
	const imageProgress3Ref = useRef(0)
	const imageProgress4Ref = useRef(0)

	const textRef = useRef(null)
	const selectedImage = useRef(0)
	const ribbonSheet = useCurrentSheet()
	const transferTop = useRef(false)
	const animationStart = useRef(false)

	const image1Texture = useTexture('/image3.jpg')
	const image2Texture = useTexture('/image2.jpg')
	const wallTexture = useTexture('/Paper-Texture-4.jpg')

	wallTexture.wrapS = THREE.RepeatWrapping
	wallTexture.wrapT = THREE.RepeatWrapping
	wallTexture.repeat.set(4, 3.4)
	// wallTexture.offset.set(50, 0)
	wallTexture.needsUpdate = true

	const [imageIndex, setImageIndex] = useState(0)


	const animationState = useRef<'idle' | 'first-chunk' | 'text-change' | 'second-chunk'>('idle')

	useEffect(() => {


		if (!ribbonSheet) return
		// Start the animation sequence
		animationState.current = 'first-chunk'

		// First chunk: animate from (6 + 22/30) to (7 + 23/30)
		ribbonSheet.sequence.play({
			range: [6 + 22 / 30, 7 + 23 / 30],
			rate: 1.5,
		}).then(() => {
			// Change text after first chunk completes
			if (textRef.current) {
				// @ts-expect-error
				textRef.current.text = imageText
			}
			animationState.current = 'text-change'

			// Small delay to let text change be visible
			setTimeout(() => {
				// animationState.current = 'idle'
				selectedImage.current = imageIndex
				// Second chunk: animate from (7 + 23/30) to (9 + 8/30)
				ribbonSheet.sequence.play({
					range: [0, 3 + 8 / 30],
					rate: 1,
				})
					.then(() => {
						animationStart.current = false
						animationState.current = 'idle'
						// 	// animationState.current = 'second-chunk'
						// 	// selectedImage.current = imageIndex
					})
			}, 30) // Small delay for text visibility
		})

	}, [ribbonSheet, imageIndex])




	const imageProgress1 = ribbonSheet?.object('imageProgress',
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

	imageProgress1?.onValuesChange((value) => {
		imageProgress1Ref.current = value.x
	}
	)


	const imageProgress2 = ribbonSheet?.object('imageProgress2',
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
	imageProgress2?.onValuesChange((value) => {
		imageProgress2Ref.current = value.x
	}
	)


	const imageProgress3 = ribbonSheet?.object('imageProgress3',
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
	imageProgress3?.onValuesChange((value) => {
		imageProgress3Ref.current = value.x
	}
	)
	const imageProgress4 = ribbonSheet?.object('imageProgress4',
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
	imageProgress4?.onValuesChange((value) => {
		imageProgress4Ref.current = value.x
	}
	)


	useFrame((state) => {
		if (!textGroupRef.current || !imageMatRef.current || !groupRef.current) return

		imageMatRef.current.uResolution.set(state.size.width, state.size.height, 1)
		imageMatRef.current.uProgress1 = imageProgress1Ref.current
		imageMatRef.current.uProgress2 = imageProgress2Ref.current
		imageMatRef.current.uProgress3 = imageProgress3Ref.current
		imageMatRef.current.uProgress4 = imageProgress4Ref.current
		imageMatRef.current.uImage1Tex = image1Texture
		imageMatRef.current.uImage2Tex = image2Texture
		imageMatRef.current.uTime = state.clock.elapsedTime


		// console.log('utime', imageMatRef.current.uTime)
		// if (selectedImage.current !== currentImage.current && ribbonSheet) {
		// 	setImageIndex(currentImage.current)
		// }

	})


	return (
		<group ref={groupRef} >
			<e.group theatreKey="image group" ref={textGroupRef} >
				<e.group theatreKey="imageTex" >
					<mesh>
						<planeGeometry args={[54, 30]} />
						<meshStandardMaterial map={wallTexture}   />
					</mesh>
					<mesh position={[-3, 0, 0.02]}>
						<planeGeometry args={[4.5, 7,500, 200]} />
						{/* <meshBasicMaterial color={'black'} /> */}
						<imageShaderMaterial key={ImageShaderMaterial.key} ref={imageMatRef} side={THREE.DoubleSide} transparent={true} blending={THREE.AdditiveBlending} />
					</mesh>
					{/* <Environment preset="city" environmentIntensity={0.2} /> */}
				</e.group>
			</e.group>
		</group>
	)
}
