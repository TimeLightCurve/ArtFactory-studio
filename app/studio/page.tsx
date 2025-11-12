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


export default function Studio() {
	// const { height } = useWindowSize()


	// const lenis = useLenis()
	const expanded = useWheelStore((state) => state.expanded)
	const titleAnimationDone = useWheelStore((state) => state.titleAnimationDone)
	const setTitleAnimationDone = useWheelStore((state) => state.setTitleAnimationDone)
	const pageAnimationStart = useWheelStore((state) => state.pageAnimationStart)

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
		<div className="relative flex w-lvw h-[600vh] shrink-0 justify-start items-start overflow-x-hidden overflow-y-scroll  z-10">
			<div className="absolute flex w-full h-full justify-start items-start pt-48 z-10 ">
				<motion.div
					className="relative -left-8 flex flex-col w-fit h-fit -rotate-90  "
				>
					<AnimatePresence>
						{expanded && !titleAnimationDone &&
							<>
								<motion.h1
									initial={{ x: -300, opacity: 0 }}
									animate={{ x: 0, opacity: 1 }}
									exit={{
										x: -300, opacity: 0,
										transition: {
											delay: 0.0,
											type: "spring",
											visualDuration: 0.6,
											bounce: 0
										}
									}}
									transition={{
										delay: 0.3,
										type: "spring",
										visualDuration: 0.8,
										bounce: 0
									}}

									className=" text-white font-elgoc font-white font-thin text-[70px] leading-[60px] z-10  "
								>
									ART
								</motion.h1>
								<motion.h1
									initial={{ x: -300, opacity: 0 }}
									animate={{ x: 0, opacity: 1 }}
									exit={{
										x: -300, opacity: 0,
										transition: {
											delay: 0.1,
											type: "spring",
											visualDuration: 0.6,
											bounce: 0
										}
									}}
									transition={{
										delay: 0.4,
										type: "spring",
										visualDuration: 0.8,
										bounce: 0
									}}
									className=" text-white font-elgoc font-white font-thin text-[70px] leading-[60px] z-10  "
								>
									FACTORY
								</motion.h1>
								<motion.h1
									initial={{ x: -300, opacity: 0 }}
									animate={{ x: 0, opacity: 1 }}
									exit={{
										x: -300, opacity: 0,
										transition: {
											delay: 0.2,
											type: "spring",
											visualDuration: 0.6,
											bounce: 0
										}
									}}
									transition={{
										delay: 0.5,
										type: "spring",
										visualDuration: 0.8,
										bounce: 0

									}}
									onAnimationComplete={() => {
										setTimeout(() => {
											setTitleAnimationDone(true)
										}, 150)
									}}
									className=" text-white font-elgoc font-white font-thin text-[70px] leading-[60px] z-10  "
								>
									STUDIO
								</motion.h1>
							</>
						}
					</AnimatePresence>
				</motion.div>
			</div>

			{/* <div className="relative flex w-full h-full justify-center items-center ">
				<motion.div
					initial={{ scale: 0.2, opacity: 0.5 }}
					animate={borderFocused ? { scale: 0.7, opacity: 1 } : { scale: 1.2, opacity: 0.2 }}
					exit={{ opacity: 0, scale: 1.2 }}
					transition={{ type: "spring", stiffness: 50, damping: 10, duration: 1.5 }}
					className=' absolute flex-col w-12 h-12 text-slate-200/50 '
				>
					<div className=' flex w-full h-1/2 justify-between items-start'>
						<CornerTopLeftIcon className=' size-6' />
						<CornerTopRightIcon className=' size-6' />
					</div>
					<div className=' flex w-full h-1/2 justify-between items-end'>
						<CornerBottomLeftIcon className=' size-6' />
						<CornerBottomRightIcon className=' size-6' />
					</div>
				</motion.div>
			</div> */}
			{/* Fixed grabbing handle (camera Z) */}
			{/* reads/writes cameraZ in zustand store */}
			{pageAnimationStart && 
				<FixedZoomHandle />
			}
		</div>
	)
}

function FixedZoomHandle() {
	const [mounted, setMounted] = useState(false)
	useEffect(() => setMounted(true), [])
	const sliderRef = useRef<HTMLDivElement | null>(null)
	const knobRef = useRef<HTMLDivElement | null>(null)
	const cameraZ = useGalleryStore(s => s.cameraZ)
	const setCameraZ = useGalleryStore(s => s.setCameraZ)
	const zMin = 4
	const zMax = 8

	const onDragStart = useCallback((e: React.PointerEvent) => {
		const slider = sliderRef.current
		if (!slider) return
		const rect = slider.getBoundingClientRect()
		const toZ = (clientX: number) => {
			const t = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
			return THREE.MathUtils.lerp(zMin, zMax, t)
		}

		const start = (ev: PointerEvent | TouchEvent | MouseEvent) => {
			let x = (ev as PointerEvent).clientX
			// @ts-ignore
			if (ev.touches && ev.touches[0]) x = (ev as TouchEvent).touches[0].clientX
			setCameraZ(toZ(x))
		}
		const move = (ev: PointerEvent | TouchEvent | MouseEvent) => {
			let x = (ev as PointerEvent).clientX
			// @ts-ignore
			if (ev.touches && ev.touches[0]) x = (ev as TouchEvent).touches[0].clientX
			setCameraZ(toZ(x))
		}
		const up = () => {
			window.removeEventListener('pointermove', move as any)
			window.removeEventListener('pointerup', up)
			window.removeEventListener('touchmove', move as any)
			window.removeEventListener('touchend', up)
		}
		window.addEventListener('pointermove', move as any, { passive: true })
		window.addEventListener('pointerup', up)
		window.addEventListener('touchmove', move as any, { passive: true })
		window.addEventListener('touchend', up)
		// prime
		// @ts-ignore
		start(e.nativeEvent)
	}, [setCameraZ])

	if (!mounted || typeof document === 'undefined') return null

	return createPortal(
		<div style={{ position: 'fixed', left: '50%', bottom: 24, transform: 'translateX(-50%)', width: 260, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2147483647, pointerEvents: 'auto' }}>
			<div ref={sliderRef}
				style={{ position: 'relative', width: '100%', height: 6, background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(4px)', borderRadius: 999 }}
				onPointerDown={onDragStart}
				onTouchStart={(e) => { /* forward to pointer handler */ onDragStart(e as any) }}
			>
				<div ref={knobRef}
					style={{ position: 'absolute', top: '50%', transform: 'translate(-50%,-50%)', left: `${((cameraZ - zMin) / (zMax - zMin)) * 100}%`, width: 20, height: 20, borderRadius: '50%', background: 'linear-gradient(135deg,#fff,#d2d2d2)', boxShadow: '0 2px 10px rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.6)', cursor: 'grab' }} />
			</div>
			<div style={{ color: 'white', fontSize: 12, marginLeft: 10, opacity: 0.8, fontFamily: 'monospace' }}>{cameraZ.toFixed(2)} · {cameraZ > (zMin + zMax) / 2 ? '2 cols' : '1 col'}</div>
		</div>,
		document.body
	)
}

