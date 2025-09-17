'use client'

import IntroText from "@/src/assets/svg/logo/IntroText"
import LogoIcon from "@/src/assets/svg/logo/LogoIcon"
import LogoText from "@/src/assets/svg/logo/LogoText"
import { useIntroStore } from "@/src/lib/store/useIntroStore"
import {motion} from "motion/react"
import { useState } from "react"

export default function Intro() {
	const [textComplete, setTextComplete] = useState(false);
	const [logoAnimationDone, setLogoAnimationDone] = useState(false);
	// const setVisible = useIntroStore((state) => state.setVisible)


	return (
		<div className="absolute flex w-screen h-screen top-0 left-0 pointer-events-none ">

			

			{/* -------- logo icon -------------*/}
			<div className=" z-40 flex fixed w-screen h-screen justify-center items-center gap-8">
				{textComplete &&
					<motion.div 
						initial={{ 
							opacity: 0, 
							filter: "blur(5px)",
							y: 0,
							scale: 1
						}} 
						animate={{ 
							opacity: [0, 1, 0, 0, 0.6], 
							filter: ["blur(2px)", "blur(0px)", "blur(10px)", "blur(6px)", "blur(0px)"],
							y: '-100%',
							scale: 0.25
						}} 
						transition={{
							// rotate:{duration: 60, repeat: Infinity, ease:"linear"},
							opacity: {duration: 10.5, times:[0, 0.2, 0.6, 0.85, 1], ease: "easeInOut"},
							filter: {duration: 10.5, times:[0, 0.2, 0.6, 0.8, 1], ease: "easeInOut"},
							y: {duration: 1.5, ease: [0.283, 0.542, 0.453, 0.948], delay: 7.5},
							scale: {duration: 1.5, ease: [0.283, 0.542, 0.453, 0.948], delay: 7.5},
							// x: {type: "spring", duration: 2.5, bounce: 0.08, delay: 1.2}
						}}
						onAnimationStart={()=>{
							setTimeout(() => {
								setLogoAnimationDone(true)
							}, 50);
						}}
						className="relative flex flex-col w-[20%] aspect-square h-auto shrink-0"
					>
						<LogoIcon />
					</motion.div>
				}
			</div>

			{/* -------- intro text -------------*/}
			<div className="absolute flex w-screen h-screen justify-center items-center">
				
					<motion.div
					initial={{ opacity: 1, filter: "blur(0px)", x: 0 }}
					animate={{ opacity: 0, filter: "blur(10px)", x: -30 }}
					transition={{ duration: 1.5, ease: "easeInOut", delay: 3.0 }}
					onAnimationStart={() => {
						setTimeout(() => {
							setTextComplete(true)
						}, 2500)
					}
					}
					className="flex h-fit w-[30%] justify-center items-center px-auto ">
					<IntroText />
				</motion.div>
				
			</div>

			{/* -------- logo text -------------*/}

			{logoAnimationDone && 
			 <motion.div 
				initial={{opacity: 1, filter: "blur(0px)"}}
				animate={{opacity: 0.0, filter: "blur(0px)"}}
				transition={{duration: 1.5, ease: "easeInOut", delay: 3.2}}
				// onAnimationComplete={() => {
				// 	setVisible(true)
				// }
				// }
			 	className=" z-50 absolute flex w-[20%] h-[20%] bottom-32 left-20"
			>
				<LogoText />
			</motion.div>}
		</div>
	)
}
