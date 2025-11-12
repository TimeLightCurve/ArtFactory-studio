import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon } from '@radix-ui/react-icons'
import { Html, shaderMaterial, useTexture } from "@react-three/drei"
import { extend, Object3DNode, useFrame, useThree } from "@react-three/fiber"
import { motion } from 'motion/react'
import { useEffect, useMemo, useRef, useState } from "react"
import * as THREE from "three"
import { useGalleryStore } from "../../lib/store/useGalleryStore"
// @ts-expect-error
import imageVertex from "../../glsl/imageInstance/imageVertex.glsl"
// @ts-expect-error
import imageFragment from "../../glsl/imageInstance/imageFragment.glsl"
import { useWheelStore } from '@/src/lib/store/useWheelStore'

export const ImageInstanceShaderMaterial = shaderMaterial(
	{

		uMap: new THREE.Texture(),
		uOpacity: 1,

	},
	imageVertex,
	imageFragment
)
extend({ ImageInstanceShaderMaterial })

export interface IImageInstanceShaderMaterial extends THREE.ShaderMaterial {

	uMap: THREE.Texture
	uOpacity: number

}

declare module "@react-three/fiber" {
	interface ThreeElements {
		imageInstanceShaderMaterial: Object3DNode<IImageInstanceShaderMaterial, typeof ImageInstanceShaderMaterial>
	}
}

export default function ImageInstances() {

	const pageAnimationStart = useWheelStore((state) => state.pageAnimationStart)


	const urls = useMemo(
		() => [
			"/images/8.jpg",
			"/images/9.jpg",
			"/images/1.jpg",
			"/images/2.jpg",
			"/images/3.jpg",
			"/test.png",
			"/images/4.jpg",
			"/images/6.jpg",
			"/images/7.jpg",
			"/images/8.jpg",
			"/images/9.jpg",
			"/images/1.jpg",
			"/images/2.jpg",
			"/images/3.jpg",
			"/test.png",
			"/images/4.jpg",
			"/images/6.jpg",
			"/images/7.jpg",
		],
		[]
	)
	const textures = useTexture(urls) as THREE.Texture[]

	// Camera Z come from zustand store
	const { camera, size } = useThree()
	const zMin = 4 // near
	const zMax = 8 // far
	const cameraZ = useGalleryStore((s) => s.cameraZ)
	const setCameraZ = useGalleryStore((s) => s.setCameraZ)

	// Apply store cameraZ to actual camera
	useEffect(() => {
		const z = THREE.MathUtils.clamp(cameraZ ?? 6, zMin, zMax)
		camera.position.z = z
	}, [camera, cameraZ])

	// Column mode based on camera Z
	const columns = (cameraZ ?? 6) > (zMin + zMax) * 0.5 ? 2 : 1

	const targetWidth = 1.6
	const gap = 0.8

	const sizes = useMemo(() => {
		return textures.map((tex) => {
			// image can be HTMLImageElement, ImageBitmap, or Canvas
			const img: any = tex.image
			const w = img?.naturalWidth ?? img?.width ?? 1
			const h = img?.naturalHeight ?? img?.height ?? 1
			const aspect = w / Math.max(h, 1)
			// const height = targetHeight
			const width = targetWidth
			const height = width / aspect
			// const width = height * aspect
			// Set texture sampling defaults
			tex.minFilter = THREE.LinearMipmapLinearFilter
			tex.magFilter = THREE.LinearFilter
			tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping
			tex.generateMipmaps = true
			tex.needsUpdate = true
			return { width, height }
		})
	}, [textures])

	// Positions depend on column count (1 or 2)
	const positions = useMemo(() => {
		if (columns === 1) {
			// Single centered column
			const totalHeight = sizes.reduce((sum, s) => sum + s.height, 0) + gap * Math.max(sizes.length - 1, 0)
			let cursor = totalHeight / 2
			return sizes.map((s) => {
				const y = cursor - s.height / 2
				cursor -= s.height + gap
				const x = 0
				return { x, y }
			})
		} else {
			// Two columns, distribute items alternately (even -> left, odd -> right)
			const leftIdx: number[] = []
			const rightIdx: number[] = []
			for (let i = 0; i < sizes.length; i++) (i % 2 === 0 ? leftIdx : rightIdx).push(i)
			const colGap = targetWidth + 0.6
			const leftX = -colGap / 2
			const rightX = colGap / 2

			const leftTotalH = leftIdx.reduce((sum, i) => sum + sizes[i].height, 0) + gap * Math.max(leftIdx.length - 1, 0)
			const rightTotalH = rightIdx.reduce((sum, i) => sum + sizes[i].height, 0) + gap * Math.max(rightIdx.length - 1, 0)
			let leftCursor = leftTotalH / 2
			let rightCursor = rightTotalH / 2

			const out = sizes.map(() => ({ x: 0, y: 0 }))
			for (const i of leftIdx) {
				const s = sizes[i]
				const y = leftCursor - s.height / 2
				leftCursor -= s.height + gap
				out[i] = { x: leftX, y }
			}
			for (const i of rightIdx) {
				const s = sizes[i]
				const y = rightCursor - s.height / 2
				rightCursor -= s.height + gap
				out[i] = { x: rightX, y }
			}
			return out
		}
	}, [sizes, gap, targetWidth, columns])

	const meshRefs = useRef<THREE.Mesh[]>([])
	const overlayRefs = useRef<(HTMLDivElement | null)[]>([])
	const captionRefs = useRef<(HTMLDivElement | null)[]>([])

	const tmpV = useMemo(() => new THREE.Vector3(), [])
	const tmpV2 = useMemo(() => new THREE.Vector3(), [])
	const tmpPos = useMemo(() => new THREE.Vector3(), [])

	// Reveal scale (0->1) based on on-screen center; keep as-is
	useFrame(() => {
		for (let i = 0; i < meshRefs.current.length; i++) {
			const m = meshRefs.current[i]
			if (!m) continue
			tmpV.setFromMatrixPosition(m.matrixWorld).project(camera)
			const inView = tmpV.z > -1 && tmpV.z < 1 && Math.abs(tmpV.x) <= 1.05 && Math.abs(tmpV.y) <= 1.05
			const target = inView ? 1 : 0
			const s = THREE.MathUtils.lerp(m.scale.x, target, 0.04)
			m.scale.setScalar(s)
		}
	})

	const [activeIndex, setActiveIndex] = useState<number | null>(null)
	const expandDist = 3.2
	const expandDamp = 0.15
	const dir = useMemo(() => new THREE.Vector3(), [])

	// Animate mesh position to target layout, or track camera if expanded
	useFrame((_state, dt) => {
		const lerpAmt = 1 - Math.pow(1 - 0.2, dt * 60)
		for (let i = 0; i < meshRefs.current.length; i++) {
			const m = meshRefs.current[i]
			if (!m) continue

			if (activeIndex === i) {
				// Expanded: track camera & fill viewport width at expandDist
				camera.getWorldDirection(dir)
				dir.normalize().multiplyScalar(expandDist)
				tmpPos.copy(camera.position).add(dir)
				m.position.lerp(tmpPos, 1 - Math.pow(1 - expandDamp, dt * 60))

				// Scale to viewport width
				const aspect = size.width / size.height
				const cam = camera as THREE.PerspectiveCamera
				const vwHalfH = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)) * expandDist
				const viewportWidth = vwHalfH * 2 * aspect
				const targetScale = viewportWidth / sizes[i].width
				const s = THREE.MathUtils.lerp(m.scale.x, targetScale, 1 - Math.pow(1 - expandDamp, dt * 60))
				m.scale.setScalar(s)

				m.renderOrder = 999
				if (Array.isArray(m.material)) m.material.forEach(mat => { mat.depthTest = false; mat.depthWrite = false })
				else { m.material.depthTest = false; m.material.depthWrite = false }
			} else {
				// Lerp to layout position for current column mode
				const { x, y } = positions[i]
				tmpPos.set(x, y, 0)
				m.position.lerp(tmpPos, lerpAmt)

				m.renderOrder = 0
				if (Array.isArray(m.material)) m.material.forEach(mat => { mat.depthTest = true; mat.depthWrite = true })
				else { m.material.depthTest = true; m.material.depthWrite = true }
			}
		}
	})

	// Update overlays and captions to track projected rect (unchanged logic, works with 1/2 columns)
	useFrame(() => {
		for (let i = 0; i < meshRefs.current.length; i++) {
			const m = meshRefs.current[i]
			const overlay = overlayRefs.current[i]
			const caption = captionRefs.current[i]
			if (!m) continue
			const { width, height } = sizes[i]

			// If mesh too small (not yet revealed) hide overlay & caption
			if (m.scale.x < 0.005) {
				if (overlay) {
					overlay.style.width = "0px"
					overlay.style.height = "0px"
					overlay.style.opacity = "0"
				}
				if (caption) caption.style.opacity = "0"
				continue
			}

			// 4 local corners
			const corners: THREE.Vector3[] = [
				new THREE.Vector3(-width / 2, -height / 2, 0),
				new THREE.Vector3(-width / 2, height / 2, 0),
				new THREE.Vector3(width / 2, -height / 2, 0),
				new THREE.Vector3(width / 2, height / 2, 0),
			]

			let minX = Infinity
			let minY = Infinity
			let maxX = -Infinity
			let maxY = -Infinity

			for (let c = 0; c < 4; c++) {
				tmpV2.copy(corners[c]).applyMatrix4(m.matrixWorld).project(camera)
				const sx = (tmpV2.x * 0.5 + 0.5) * size.width
				const sy = (-tmpV2.y * 0.5 + 0.5) * size.height
				if (sx < minX) minX = sx
				if (sy < minY) minY = sy
				if (sx > maxX) maxX = sx
				if (sy > maxY) maxY = sy
			}

			const w = Math.max(0, maxX - minX)
			const h = Math.max(0, maxY - minY)

			// Overlay frame (4 corner icons) +16px (8 each side)
			if (overlay) {
				// When any image is active (clicked), hide ALL corner overlays
				overlay.style.opacity = activeIndex !== null ? "0" : (m.scale.x > 0.01 ? "1" : "0")
				overlay.style.width = `${w + 16}px`
				overlay.style.height = `${h + 16}px`
			}

			// Caption positioning: anchor at mesh center Html, then push downward
			if (caption) {
				// Hide captions for non‑active when one is expanded
				if (activeIndex !== null && activeIndex !== i) {
					caption.style.opacity = "0"
					continue
				} else {
					caption.style.opacity = "1"
				}
				// Move caption to bottom edge + margin (12px)
				// We are in a center‑anchored container -> use translateY
				const margin = 12
				caption.style.transform =
					`translate(-50%, calc(-50% + ${h / 2 + margin}px))`
				caption.style.width = `${w}px`
			}
		}
	})

	// The slider/grabbing handle is rendered at page level now. ImageInstances no longer renders it.
	return (
		<group>
			{textures.map((tex, i) => {
				const { width, height } = sizes[i]
				const { x, y } = positions[i]
				const meshPos: [number, number, number] = [x, y, 0]
				return (
					<group key={i}>
						<mesh
							ref={(el) => { if (el) meshRefs.current[i] = el }}
							scale={0.01}
							position={meshPos}
							onClick={(e) => { e.stopPropagation(); setActiveIndex(prev => prev === i ? null : i) }}
						>
							<planeGeometry args={[width, height, 1, 1]} />
							<imageInstanceShaderMaterial uMap={tex} uOpacity={1} transparent depthWrite={false} />
						</mesh>

						{/* Corner frame overlay (center anchored) */}
						{pageAnimationStart && <group>
							<Html position={[meshPos[0], meshPos[1], meshPos[2]]} transform={false} pointerEvents="none">
								<div
									//@ts-ignore
									ref={(el) => (overlayRefs.current[i] = el)}
									style={{
										position: "absolute",
										left: "50%",
										top: "50%",
										transform: "translate(-50%, -50%)",
										width: 0,
										height: 0,
										pointerEvents: "none",
										transition: "opacity .3s",
										opacity: 0
									}}
								>
									<ChevronLeftIcon style={cornerStyle("tl")} />
									<ChevronUpIcon style={cornerStyle("tr")} />
									<ChevronDownIcon style={cornerStyle("bl")} />
									<ChevronRightIcon style={cornerStyle("br")} />
								</div>
							</Html>

							{/* Caption overlay (same center anchor) */}
							<Html position={[meshPos[0], meshPos[1] - 0.1, meshPos[2]]} transform={false} pointerEvents="none">
								<div
									//@ts-ignore
									ref={(el) => (captionRefs.current[i] = el)}
									style={{
										position: "absolute",
										left: "50%",
										top: "50%",
										transform: "translate(-50%, -50%)",
										width: 0,
										pointerEvents: "none",
										opacity: 0,
										transition: "opacity .35s"
									}}
								>
									<motion.div
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ duration: 0.6 }}
										style={{
											display: "flex",
											alignItems: "flex-end",
											gap: "6px",
											justifyContent: "flex-start",
											width: "100%"
										}}
									>
										<h3 className="font-chakra font-medium text-white text-sm text-nowrap">
											Armin Morbach,
										</h3>
										<p className="font-manrope font-light text-slate-400 text-[10px] leading-5 text-nowrap">
											Paris, 2024
										</p>
									</motion.div>
								</div>
							</Html>
						</group>}
					</group>
				)
			})}

			{/* slider is moved to page component */}
		</group>
	)
}

// Corner icon style helper
function cornerStyle(pos: "tl" | "tr" | "bl" | "br"): React.CSSProperties {
	const base: React.CSSProperties = {
		position: "absolute",
		width: 18,
		height: 18,
		color: "white",
		opacity: 0.9,
		pointerEvents: "none",
		rotate: '45deg'
	}
	if (pos === "tl") return { ...base, left: 0, top: 0, transform: "translate(-6px, 0px)" }
	if (pos === "tr") return { ...base, right: 0, top: 0, transform: "translate(16px, 0px)" }
	if (pos === "bl") return { ...base, left: 0, bottom: 0, transform: "translate(-6px,12px)" }
	return { ...base, right: 0, bottom: 0, transform: "translate(6px,6px)" }
}
