import { AnimatePresence, motion, useAnimationFrame, useMotionValue, useMotionValueEvent, useScroll } from "motion/react"
import { useCallback, useEffect, useRef, useState } from "react"
import * as THREE from "three"
import Footer from "../assets/svg/Footer"
import Poster from "../assets/svg/Poster"
import { useGalleryStore } from "../lib/store/useGalleryStore"
import { useLenis } from "lenis/react"
import { useWheelStore } from "../lib/store/useWheelStore"

export default function ToolWheel() {
	// const [clicked, setClicked] = useState(false)
	const [isDragging, setIsDragging] = useState(false)

	const wheelOpened = useGalleryStore(s => s.wheelOpened)
	const setWheelOpened = useGalleryStore(s => s.setWheelOpened)
	const titleAnimationDone = useWheelStore(s => s.titleAnimationDone)

	const numLines = 24
	const rectWidth = 240
	const radius = 90

	const [darkMode, setDarkMode] = useState(true)
	const [draggingTimeline, setDraggingTimeline] = useState(false)
	const [mounted, setMounted] = useState(false)
	useEffect(() => setMounted(true), [])

	const sliderRef = useRef<HTMLDivElement | null>(null)
	const cameraZ = useGalleryStore(s => s.cameraZ)
	const setCameraZ = useGalleryStore(s => s.setCameraZ)
	const zMin = 4
	const zMax = 8

	// Calculate indicator position
	const t = (cameraZ - zMin) / (zMax - zMin)


	// Define the arc range (centered at top = 270 degrees)
	const startAngle = 250
	const fixedEndAngle = 450
	// Dynamic end angle based on t for compression effect on lines only
	// const linesEndAngle = THREE.MathUtils.lerp(350, 330, t)
	const endAngleRef = useRef(fixedEndAngle)
	const endAngleMotion = useMotionValue(fixedEndAngle)
	useAnimationFrame((time, delta) => {
		endAngleRef.current = fixedEndAngle - t * 60
		endAngleMotion.set(endAngleRef.current - 270)
	})


	// Linear state
	const xIndRect = (t - 0.5) * rectWidth
	const yIndRect = -10 // Slightly above lines
	const rIndRect = 0 // Points down (default SVG orientation)

	// Circular state
	// Use fixedEndAngle for indicator so it moves linearly and smoothly with the mouse/value
	const angleInd = THREE.MathUtils.lerp(startAngle, fixedEndAngle - 106, t)
	const radInd = (angleInd * Math.PI) / 180
	const indRadius = radius - 0 // Inside the tick marks
	const xIndCircle = Math.cos(radInd) * indRadius
	const yIndCircle = Math.sin(radInd) * indRadius
	// Triangle points down by default. 
	// To point outward from center:
	// At angle 270 (Top), we want it pointing Up (180 deg rotation from default Down).
	// 270 - 90 = 180. Correct.
	const rIndCircle = angleInd - 270

	const [nameList, setNameList] = useState(false)

	const handleNameClick = () => {
		const newVal = !nameList
		setNameList(newVal)
		window.dispatchEvent(new CustomEvent('toggle-names-update', { detail: newVal }))
	}

	const handleDarkModeClick = () => {
		setDarkMode(prev => !prev)
		window.dispatchEvent(new CustomEvent('toggle-darkmode-update', { detail: !darkMode }))
	}
	const onDragStart = useCallback((e: React.PointerEvent) => {
		const slider = sliderRef.current
		if (!slider || !wheelOpened) return
		const rect = slider.getBoundingClientRect()

		// Determine if the click is within the "degree lines area"
		// Center of the circle relative to the viewport
		const centerX = rect.left + rect.width / 2
		// The circle center is pushed down by `y: wheelOpened ? '60vw' : 0` + internal offsets.
		// Based on the render logic: yCircle + 214. The center of rotation is roughly at y=214 inside the container.
		const centerY = rect.top - 40

		const clickX = e.clientX
		const clickY = e.clientY

		// Calculate radial distance from the center of the "wheel"
		const dx = clickX - centerX
		const dy = clickY - centerY
		const distanceFromCenter = Math.sqrt(dx * dx + dy * dy)

		// The lines are at radius = 100. The longest line is ~30px.
		// We want to allow clicks roughly between radius (100) and radius + length (130).
		// Adding a bit of padding for usability: 190 to 240.
		// const isOnRim = distanceFromCenter > 100 && distanceFromCenter < 140
		const isOnRim = distanceFromCenter > 70 && distanceFromCenter < 240

		// If wheel is open, only allow click if on the rim.
		// If closed, the whole element is the target.
		const isInside = !wheelOpened || isOnRim

		if (wheelOpened && !isInside) return

		setIsDragging(true)

		const startX = e.clientX
		const startCameraZ = cameraZ

		const move = (ev: PointerEvent | TouchEvent | MouseEvent) => {
			let x = (ev as PointerEvent).clientX
			// @ts-ignore
			if (ev.touches && ev.touches[0]) x = (ev as TouchEvent).touches[0].clientX

			const deltaX = x - startX
			const deltaZ = (deltaX / rect.width) * (zMax - zMin)

			let newZ = startCameraZ + deltaZ
			newZ = Math.max(zMin, Math.min(zMax, newZ))

			setCameraZ(newZ)
			window.dispatchEvent(new CustomEvent('camera-zoom-update', { detail: newZ }))
		}
		const up = () => {
			setIsDragging(false)
			window.removeEventListener('pointermove', move as any)
			window.removeEventListener('pointerup', up)
			window.removeEventListener('touchmove', move as any)
			window.removeEventListener('touchend', up)
		}
		window.addEventListener('pointermove', move as any, { passive: true })
		window.addEventListener('pointerup', up)
		window.addEventListener('touchmove', move as any, { passive: true })
		window.addEventListener('touchend', up)
	}, [setCameraZ, wheelOpened, cameraZ])


	const x = useMotionValue(0)
	const lenis = useLenis()
	const { scrollY } = useScroll()

	useMotionValueEvent(scrollY, "change", (latest) => {
		x.set(latest * 0.02)
	})


	const onPanStart = useCallback((e: React.TouchEvent) => {
		// if(isDragging) return
		
		// console.log('pan start', e)
		const startX = e.touches[0].clientX
		const move = (ev: PointerEvent | TouchEvent | MouseEvent) => {
			let x = (ev as PointerEvent).clientX
			// @ts-ignore
			if (ev.touches && ev.touches[0]) x = (ev as TouchEvent).touches[0].clientX

			const deltaX = x - startX
			// console.log('deltaX:', lenis?.scroll)
			// scrollY.set(lenis?.dimensions.height! - deltaX * 5)
			lenis?.scrollTo(lenis?.actualScroll - deltaX * 20, { 
				immediate: false,
				// lerp: 0.1,
				// easing: (t) => t * t ,
				duration: 0.8,
				onStart: () => {
					setDraggingTimeline(true)
				},
				onComplete: () => {
					setDraggingTimeline(false)
				},
				// lock: true,

			 } )
			
			
		}
		const up = () => {
			// setDraggingTimeline(false)
			window.removeEventListener('pointermove', move as any)
			window.removeEventListener('pointerup', up)
			window.removeEventListener('touchmove', move as any)
			window.removeEventListener('touchend', up)
		}
		window.addEventListener('pointermove', move as any, { passive: true })
		window.addEventListener('pointerup', up)
		window.addEventListener('touchmove', move as any, { passive: true })
		window.addEventListener('touchend', up)
	}, [lenis])

	// const onPanEnd = () => {
	// 	setDraggingTimeline(false)
	// }

	const sortButtonClick = useCallback((button: string) => {

		const move = () => {
			let newZ = 4
			if(button === 'poster') {
				newZ = 8
			} else if(button === 'footer') {
				newZ = 4
			}
			newZ = Math.max(zMin, Math.min(zMax, newZ))

			window.dispatchEvent(new CustomEvent('camera-zoom-update', { detail: newZ }))
			setCameraZ(newZ)
		}
		const up = () => {
			// setIsDragging(false)
			window.removeEventListener('pointermove', move as any)
			window.removeEventListener('pointerup', up)
			window.removeEventListener('touchmove', move as any)
			window.removeEventListener('touchend', up)
		}
		window.addEventListener('pointermove', move as any, { passive: true })
		window.addEventListener('pointerup', up)
		window.addEventListener('touchmove', move as any, { passive: true })
		window.addEventListener('touchend', up)

	}, [setCameraZ])

	if (!mounted || typeof document === 'undefined' || !titleAnimationDone) return null


	return (
		<>
		<div className=" fixed flex top-4 right-4 z-50 ">		
			<motion.div
				initial={{ y: 0 }}
				animate={{ y: wheelOpened ? 120 : 0,
					opacity: (draggingTimeline || wheelOpened) ? 0.0 : 1.0
				}}
				transition={{ type: "spring", visualDuration: 0.8, bounce: 0, opacity: { duration: 0.3 } }}
				className=" flex w-fit h-fit justify-center gap-2 "
			>
				
				<motion.button
					onPointerDown={(e) => {
						e.stopPropagation()						
						handleNameClick()
					}}
					animate={{ 
						color: darkMode ? 'rgb(2, 6, 23 , 0.7)' : 'rgb(241, 245, 249 , 1)' 
					}}
					transition={{ type: 'spring', visualDuration: 0.5, bounce: 0, delay: 0.2 }}
					className= {'flex  text-xl w-9 h-9 justify-center items-center font-manrope font-semibold text-left bg-slate-950/0 rounded-lg py-2 px-2 z-50 ' }
				>
					Aa
				</motion.button>
				<div 
					className=" flex w-9 h-9 bg-slate-950/0 rounded-lg "
					onPointerDown={() => {
						sortButtonClick('poster')
					}}
				>
						<Poster className={`${!darkMode ? 'fill-slate-100/70' : 'fill-slate-950/70'}  transition-all duration-300 delay-300`}/>
				</div>

				<div 
					onPointerDown={() => sortButtonClick('footer')}
					className=" flex w-9 h-9 bg-slate-950/0 rounded-lg "
				>
						<Footer className={`${!darkMode ? 'fill-slate-100/70' : 'fill-slate-950/70'} transition-all duration-300 delay-300`} />
				</div>

				<div
					onPointerDown={() => handleDarkModeClick()}
					className=" flex w-9 h-9 justify-center items-center "
				>
					<motion.div
						initial={{ backgroundColor: 'rgba(2, 6, 23, 0.0)' }}
						animate={{ backgroundColor: darkMode ? 'rgba(2, 6, 23, 0.9)' : 'rgba(255, 255, 255, 0.7)' }}
						transition={{ type: 'spring', visualDuration: 0.5, bounce: 0}}
						className=" flex w-4 h-4 rounded-full " />
				</div>

			</motion.div>
		</div>

		<motion.div className=' fixed flex flex-col w-screen h-fit justify-end items-center z-[30] bottom-0'>
			
			
			<motion.div
				ref={sliderRef}
				onPointerDown={onDragStart}
				onTouchStart={(e) => { /* forward to pointer handler */ onDragStart(e as any) }}
				onClick={(e) => {
					e.stopPropagation()
					setWheelOpened(true)
				}}
				initial={{
					borderRadius: 0,
					height: 64,
					y: 0,
					x: 0,

				}}
				animate={{
					borderRadius: wheelOpened ? 400 : 0,
					height: wheelOpened ? 236 : draggingTimeline ? 900 : 40,
					width: wheelOpened ? 236 : '100vw',
					y: wheelOpened ? '10vw' : 0,
					x: wheelOpened ? 0 : 0,
					backgroundColor: wheelOpened ? 'linear-gradient(to top, rgba(255, 255, 255, 0.0) 0%, rgba(255, 255, 255, 0.0) 100%)' : 'linear-gradient(to top, rgba(255, 255, 255, 0.0) 0%, rgba(255, 255, 255, 0) 100%)',
					// maskImage: wheelOpened
					// 	?
					// 	`radial-gradient( ellipse at 50% 120%,
					// 						rgba(255, 255, 255, 1) 0%,
					// 						rgba(255, 255, 255, 1) 40%,
					// 						rgba(255, 255, 255, 1) 70%,
					// 						rgba(255, 255, 255, 1) 100%)`
					// 	: `radial-gradient( ellipse at 50% 100%,
					// 						rgba(255, 255, 255, 1) 0%,
					// 						rgba(255, 255, 255, 0.6) 50%,
					// 						rgba(255, 255, 255, 0.05) 80%,
					// 						rgba(255, 255, 255, 0) 92%)`,
					// // borderColor: wheelOpened ? 'black' : 'transparent',
				}}
				transition={{
					type: "spring",
					visualDuration: 0.8,
					bounce: 0,
					delay: 0.0,
					// ease: [0.43, 0.13, 0.23, 0.96],				
					height: {type:'spring', visualDuration: draggingTimeline ? 0.2 : 0.8 , bounce: 0},
					// borderRadius: { visualDuration: 0.7, delay: 0.0 },
					// type: "tween" 

				}}
				className={` relative flex gap-4 shrink-0  items-start justify-center bg-gradient-to-t from-slate-100/0 to-transparent overflow-hidden  z-[9999999999990] pb-0`}
			// style={{ backdropFilter: 'blur(16px)' }}
			>
				{/* Indicator Triangle */}
				<AnimatePresence>
					{wheelOpened ?
						<>
							<motion.div
								className="absolute z-50 flex flex-col w-6 h-12 gap-2 justify-center items-center pointer-events-none"
								initial={{
									x: xIndRect,
									y: yIndRect,
									rotate: rIndRect,
								}}
								animate={{
									x: xIndCircle + 4,
									y: yIndCircle + 110,
									rotate: rIndCircle,
								}}
								exit={{
									x: xIndRect,
									y: yIndRect,
									rotate: rIndRect,
								}}
								transition={isDragging ? { duration: 0 } : {
									type: "spring",
									visualDuration: 0.8,
									bounce: 0,
								}}
							>
								<svg viewBox="0 0 24 24" className="flex w-full h-5 drop-shadow-md fill-red-800 pointer-events-none">
									<path d="M12 22 L2 2 L22 2 Z" />
								</svg>
								<div className=" flex w-full h-4 rotate-0 justify-center items-center pointer-events-none">
									<span className=" text-black font-chakra text-sm ">{(12 - cameraZ).toFixed(2)}</span>
								</div>
							</motion.div>

							{Array.from({ length: numLines }).map((_, i) => {
								// 1. Calculate Rectangle State (Linear)
								// Map index to a position across the width
								const xRect = ((i) / (numLines - 1)) * rectWidth - rectWidth / 2
								const yRect = 10 // Offset towards bottom
								const rRect = 0

								// 2. Calculate Circle State (Radial)
								// Map index to the defined arc range
								// Use linesEndAngle here for the compression effect
								const angle = THREE.MathUtils.lerp(startAngle, endAngleRef.current, i / (numLines - 1))

								const rad = (angle * Math.PI) / 180
								// Convert polar to cartesian coordinates
								const xCircle = Math.cos(rad) * radius
								const yCircle = Math.sin(rad) * radius
								// Rotate line to point outwards (tangent + 90deg)
								const rCircle = angle - 270

								return (
									<motion.div
										key={i}
										className={`absolute w-0.5 h-5 bg-black  `}
										initial={{
											x: xRect,
											y: yRect,
											rotate: rRect,
											// height: (wheelOpened && (i + 1) % 4 === 0) ? 20 : wheelOpened ? 12 : 5,
											scale: wheelOpened ? 1 : 1,
											width: 10,
											opacity: 0.0,
										}}
										animate={{
											x: xCircle,
											y: yCircle + 110,
											rotate: rCircle,
											scale: (i % 4 === 0) ? 1.5 : 1,
											width: (i % 4 === 0) ? 1 : 2,
											opacity: (i % 4 === 0) ? 1 : 0.2,
										}}
										exit={{
											x: xRect,
											y: yRect,
											rotate: rRect,
											// height: (wheelOpened && (i + 1) % 4 === 0) ? 20 : wheelOpened ? 12 : 5,
											scale: 1,
											width: 10,
											opacity: 0.06,
										}}
										transition={isDragging ? { duration: 0 } : {
											type: "spring",
											visualDuration: 0.6,
											bounce: 0,
										}}
									/>
								)
							})}

						</>
						:
						<motion.div
							initial={{
								// x: -500,
								y: 10,
								rotate: 90,
							}}
							animate={{
								// x: 0,
								y: -10,
								rotate: 0,

							}}
							transition={{
								type: "spring",
								visualDuration: 0.8,
								bounce: 0,
								rotate: { duration: 0.01 },
							}}
							className=" relative flex w-full h-full justify-center items-center "
						>
							<motion.div 
								// onTouchMove={(e)=>onPanStart(e as any)}
								onTouchStart={(e) => onPanStart(e as any)}
								// onTouchEnd={onPanEnd}
								className=" absolute flex w-full h-full justify-end items-center mr-72 mb-8"
								style={{ x: x }}
							>
								{
									new Array(116).fill(undefined).map((_, index) => (
										<div
											key={index}
											className=" flex flex-col w-2 shrink-0 h-full justify-end "
										>
											<div className={`flex w-0.5  ${index % 5 === 0 ? (!darkMode ? 'h-3.5 bg-white/60' : 'h-3.5 bg-black/60 ') : (!darkMode ? 'h-2 bg-white/30' : 'h-2 bg-black/30')} transition-all duration-500 delay-500`} />
											{/* <div className={`flex w-0.5  ${index % 5 === 0 ? 'h-3.5 bg-white/70 ' : 'h-2 bg-white/40'}`} /> */}
										</div>
									))
								}
							</motion.div>
							<div className="  w-[2px] h-full min-h-20 bg-red-700 z-40 mb-6">

							</div>
						</motion.div>
					}
				</AnimatePresence>
			</motion.div>

		</motion.div>
		</>
	)
}
