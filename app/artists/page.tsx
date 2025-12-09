'use client'

import { useWheelStore } from "@/src/lib/store/useWheelStore"
// import { CornerBottomLeftIcon, CornerBottomRightIcon, CornerTopLeftIcon, CornerTopRightIcon } from "@radix-ui/react-icons"
// import { useWindowSize } from "@uidotdev/usehooks"
// import { useLenis } from "lenis/react"
import { useGalleryStore } from '@/src/lib/store/useGalleryStore'
import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import * as THREE from 'three'
// import { useEffect, useState } from "react"


export default function Artists() {
	// const { height } = useWindowSize()


	// const lenis = useLenis()
	const expanded = useWheelStore((state) => state.expanded)
	const titleAnimationDone = useWheelStore((state) => state.titleAnimationDone)
	const setTitleAnimationDone = useWheelStore((state) => state.setTitleAnimationDone)
	const pageAnimationStart = useWheelStore((state) => state.pageAnimationStart)
	const [doOnce, setDoOnce] = useState(false)

	// const [borderFocused, setBorderFocused] = useState(true)

	// useEffect(() => {
	// 	if (lenis) {
	// 		if (!titleAnimationDone) {
	// 			// lenis.stop()
	// 		} else {
	// 			lenis.start()
	// 			lenis.scrollTo(0, {
	// 				// duration: 0.3,
	// 				immediate: false,
	// 				lerp: 0.05,
	// 			})
	// 		}
	// 	}
	// }, [lenis, titleAnimationDone])

	return (
		<div className="relative flex w-lvw h-[5200vh] shrink-0 justify-start items-start overflow-x-hidden overflow-y-scroll  z-10">

				<AnimatePresence>
					{expanded &&
			<div className="fixed flex w-full h-full justify-start items-start pt-48 px-8 z-20  ">

						<motion.div
							className="relative flex w-full h-fit "
						>
							<motion.h1
								initial={{
									x: -200,
									// opacity: 0, 
									// filter: 'blur(30px)'
								}}
								animate={{
									x: -10,
									// opacity: 1, 
									// filter: 'blur(0px)' 
								}}
								exit={{
									x: 0,
									// opacity: 0, 
									// filter: 'blur(50px)',
									transition: {
										delay: 0.6,
										type: "spring",
										visualDuration: 0.5,
										bounce: 0
									}
								}}
								transition={{
									delay: 0.2,
									type: "spring",
									visualDuration: 1.2,
									bounce: 0
								}}
								// onAnimationComplete={() => {
								// 	setTimeout(() => {
								// 		setTitleAnimationDone(true)
								// 	}, 150)
								// }}

								className="flex justify-end items-center w-full h-full text-white font-broadacre font-white font-medium text-[64px] leading-[60px] z-10 "
							>
								ART
							</motion.h1>


							<motion.h1
								initial={{
									x: 200,
									// opacity: 0, 
									// filter: 'blur(30px)'
								}}
								animate={{
									x: -10,
									// opacity: 1, 
									// filter: 'blur(0px)' 
								}}
								exit={{
									x: 0,
									// opacity: 0, 
									// filter: 'blur(50px)',
									transition: {
										delay: 0.6,
										type: "spring",
										visualDuration: 0.5,
										bounce: 0
									}
								}}
								transition={{
									delay: 0.2,
									type: "spring",
									visualDuration: 1.2,
									bounce: 0,
									restDelta: 0.15
								}}
								onUpdate={(value: { x: number }) => {
									// console.log(value)
									if (value.x < 60 && !doOnce) {
										setTitleAnimationDone(true)
										setDoOnce(true)
									}
								}}
								// onAnimationComplete={() => {
								// 	setTimeout(() => {
								// 		console.log('animation done')
								// 		setTitleAnimationDone(true)
								// 	}, 10)
								// }}

								className="flex justify-start items-center w-full h-full text-white font-broadacre font-white font-medium text-[64px] leading-[60px] z-10"
							>
								ISTS
							</motion.h1>




						</motion.div>
					</div>
					}
				</AnimatePresence>


			{/* Fixed grabbing handle (camera Z) */}
			{/* reads/writes cameraZ in zustand store */}
			{pageAnimationStart &&
			<>
				{/* <FixedZoomHandle /> */}
			</>
			}
			
		</div>
	)
}

// function FixedZoomHandle() {
// 	const [mounted, setMounted] = useState(false)
// 	useEffect(() => setMounted(true), [])
// 	const sliderRef = useRef<HTMLDivElement | null>(null)
// 	const knobRef = useRef<HTMLDivElement | null>(null)
// 	const cameraZ = useGalleryStore(s => s.cameraZ)
// 	const setCameraZ = useGalleryStore(s => s.setCameraZ)
// 	const zMin = 4
// 	const zMax = 8

// 	const [nameList, setNameList] = useState(false)

// 	const handleNameClick = () => {
// 		const newVal = !nameList
// 		setNameList(newVal)
// 		window.dispatchEvent(new CustomEvent('toggle-names-update', { detail: newVal }))
// 	}

// 	const onDragStart = useCallback((e: React.PointerEvent) => {
// 		const slider = sliderRef.current
// 		if (!slider) return
// 		const rect = slider.getBoundingClientRect()
// 		const toZ = (clientX: number) => {
// 			const t = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
// 			return THREE.MathUtils.lerp(zMin, zMax, t)
// 		}

// 		const start = (ev: PointerEvent | TouchEvent | MouseEvent) => {
// 			let x = (ev as PointerEvent).clientX
// 			// @ts-ignore
// 			if (ev.touches && ev.touches[0]) x = (ev as TouchEvent).touches[0].clientX
// 			const val = toZ(x)
// 			setCameraZ(val)
// 			window.dispatchEvent(new CustomEvent('camera-zoom-update', { detail: val }))
// 		}
// 		const move = (ev: PointerEvent | TouchEvent | MouseEvent) => {
// 			let x = (ev as PointerEvent).clientX
// 			// @ts-ignore
// 			if (ev.touches && ev.touches[0]) x = (ev as TouchEvent).touches[0].clientX
// 			const val = toZ(x)
// 			setCameraZ(val)
// 			window.dispatchEvent(new CustomEvent('camera-zoom-update', { detail: val }))
// 		}
// 		const up = () => {
// 			window.removeEventListener('pointermove', move as any)
// 			window.removeEventListener('pointerup', up)
// 			window.removeEventListener('touchmove', move as any)
// 			window.removeEventListener('touchend', up)
// 		}
// 		window.addEventListener('pointermove', move as any, { passive: true })
// 		window.addEventListener('pointerup', up)
// 		window.addEventListener('touchmove', move as any, { passive: true })
// 		window.addEventListener('touchend', up)
// 		// prime
// 		// @ts-ignore
// 		start(e.nativeEvent)
// 	}, [setCameraZ])

// 	if (!mounted || typeof document === 'undefined') return null

// 	return createPortal(
// 		<div className=" fixed left-1/2 bottom-6 -translate-x-1/2 w-64 h-9  rounded-lg flex gap-2 items-end justify-center z-[2147483647] pointer-events-auto px-2 py-2 "
// 		>
// 			<div ref={sliderRef}
// 				className=" relative flex w-full h-full items-end  "
// 				onPointerDown={onDragStart}
// 				onTouchStart={(e) => { /* forward to pointer handler */ onDragStart(e as any) }}
// 			>
// 				{new Array(15).fill(0).map((_, i) => (
// 					<div key={i}
// 						className={` flex w-full border-r  ${(i - 1) % 4 === 0 ? 'h-full border-white' : 'h-1/2 border-white/40'}`}
// 						style={{ left: `${(i / 49) * 100}%` }}
// 					/>
// 				))}
// 				<div ref={knobRef}
// 					className=" absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-5 rounded-md border border-white bg-neutral-950 cursor-grab "
// 					style={{ left: `${((cameraZ - zMin) / (zMax - zMin)) * 100}%` }}
// 				/>
// 			</div>
// 			<button
// 				onClick={handleNameClick}
// 				className=" text-white text-base leading-3 ml-2 opacity-75 w-16 font-chakra font- text-left uppercase"
// 			>
// 				{nameList ? 'Hide' : 'Name'}
// 			</button>
// 		</div>,
// 		document.body
// 	)
// }

