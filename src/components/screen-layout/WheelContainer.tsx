'use client'

import Triangle from "@/src/assets/svg/logo/Triangle"
import Wheel from "@/src/assets/svg/Wheel"
import { useWheelStore } from "@/src/lib/store/useWheelStore"
import { animate, motion, useMotionValue, useVelocity, AnimatePresence } from 'motion/react'
import { TouchEvent, useRef, useState } from "react"
import { MathUtils } from "three"
import GooeyMenuItem from "../GooeyMenuItem"
import { useRouter } from "next/navigation"



export default function WheelContainer() {

	const sectionTitles = [
		"Studio",
		"Artists",
		"test",
		"Models",
		"About Us",
	]

	const router = useRouter()

	const [title, setTitle] = useState(sectionTitles[0])
	const [ centerTitle, setCenterTitle ] = useState("Art Factory Studio")

	const setSectionIndex = useWheelStore((state) => state.setSectionIndex)
	const setVideoClicked = useWheelStore((state) => state.setVideoClicked)
	const setVideoTitle = useWheelStore((state) => state.setVideoTitle)
	const videoClicked = useWheelStore((state) => state.videoClicked)
	const expanded = useWheelStore((state) => state.expanded)

	const rotate = useMotionValue(0)
	const targetRef = useRef(0)

	const touchMove =useMotionValue(0)
	const touchMoveVelocity = useVelocity(touchMove)

	const doOnceRef = useRef(false)
	const currentAngleRef = useRef(0)
	const currentTouchXRef = useRef(0)

	const handleTouchEnd = (): void => {
		doOnceRef.current = false
		targetRef.current += rotate.get() + touchMove.get()

		animate(rotate, targetRef.current, {
			type: 'decay',
			ease: [0.559, 0.215, 0.553, 0.803],
			velocity: touchMoveVelocity.get() * 0.15,
			timeConstant: 300,

			modifyTarget: (target) => {
				// snap to nearest 36 degrees
				const newTarget = target + touchMove.get() * 0.1
				const remainder = newTarget % 36
				// console.log('target:', target )
				
				if (remainder > 0) {

					if (remainder < 18) {
						const titleIndex = (newTarget - remainder) / 36 % 5
						setSectionIndex(titleIndex)
						setTitle(sectionTitles.at(-titleIndex)!)
						return newTarget - remainder

					} else {
						const titleIndex = (newTarget + (36 - remainder)) / 36 % 5
						setSectionIndex(titleIndex)
						setTitle(sectionTitles.at(-titleIndex)!)
						return newTarget + (36 - remainder)
					}
				}
				else if (remainder < 0) {

					if (remainder < 0 && remainder > -18) {
						const titleIndex = (newTarget - remainder) / 36 % 5
						setSectionIndex(titleIndex)
						setTitle(sectionTitles.at(-titleIndex)!)
						return newTarget - remainder
					}

					else {
						const titleIndex = (newTarget - (36 + remainder)) / 36 % 5
						setSectionIndex(titleIndex)
						setTitle(sectionTitles.at(-titleIndex)!)
						return newTarget - (36 + remainder)
					}
				}
				else {
					return newTarget
				}
			}
		})

	}

	const handleDrag = (e: TouchEvent): void => {
		if (!doOnceRef.current) {
			currentAngleRef.current = rotate.get()
			currentTouchXRef.current = e.touches[0].clientX
			doOnceRef.current = true
		}
		const touch = e.touches[0]
		// console.log('touch.clientX:', (touch.clientX - currentTouchXRef.current))
		const touchDeltaX =  (touch.clientX - currentTouchXRef.current)
		const touchSensitivity = Math.abs(touchDeltaX) > 250 ? 0.5 : Math.abs(touchDeltaX) > 150 ? 0.3 : 0.2
		const rotationTarget = currentAngleRef.current + touchDeltaX * touchSensitivity 
		touchMove.set(touchDeltaX * touchSensitivity)
		const titleIndex = MathUtils.euclideanModulo(Math.round(-rotationTarget / 36), sectionTitles.length)
		setCenterTitle(sectionTitles[titleIndex])
		rotate.set(rotationTarget)
	}

	const handleClick = () => {
		setVideoClicked(!videoClicked)
		setVideoTitle(title.toLowerCase())
		router.push(`/${title.toLowerCase()}`)
		// router.push(`/studio`)
	}

	return (
		<>
		{ !expanded &&	
			<>
				<motion.div 
					initial={{ opacity: 1, y: 0 }}
					animate={{ 
						opacity: videoClicked ? 0.0 : 1,
						y: videoClicked ? -50 : 0
					}}
					
					transition={{
						y:{
							type: "spring",
							stiffness: 162,
							damping: 45,
							mass: 1.0,
							restDelta: 0.04
						},
						opacity: { duration: 0.2 }

					}}

					className=" fixed top-10 left-0 w-full h-36 flex flex-col justify-center items-center z-50"
				>
					<div className="  flex flex-col w-full h-36 shrink-0 justify-end items-center pb-0 gap-1">
						<div className=" flex w-fit h-fit  shrink-0 rotate-180 ">
							<Triangle />
						</div>
						<GooeyMenuItem nextTitle={title} />		
						{/* <div className="  flex w-fit h-fit shrink-0 z-50 mt-[85%] text-center px-4 "
						>
						<h2 className=" font-chakra font-extrabold text-white text-5xl leading-tight w-48  ">
						{centerTitle}
						</h2>
						</div> */}
					</div>
				</motion.div>
				<div className=" fixed top-0 left-0 flex flex-col w-full h-svh justify-center items-center z-40">
					<div className="mask-wheel  flex flex-col justify-start items-center bg-transparent w-[130%] h-auto aspect-square shrink-0 z-50 pt-16">
						<motion.div
							onTouchEnd={() => handleTouchEnd()}
							onTouchMove={(e) => handleDrag(e)}
							onClick={() => handleClick()}
							initial={{ scale: 1 }}
							animate={{
								scale: videoClicked ? 2 : 1,
								opacity: videoClicked ? 0.0 : 1
							}}
							transition={{
								type: "spring",
								stiffness: 162,
								damping: 45,
								mass: 1.0,
								restDelta: 0.04,
							}}
							className=" flex w-full h-full  shrink-0 z-50 "
							style={{ rotate: rotate }}
						>
							<Wheel />
						</motion.div>
					</div>
				</div>

			</>
			}
		</>

	)
}
