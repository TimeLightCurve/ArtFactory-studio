import Triangle from '@/src/assets/svg/logo/Triangle'
import { useIntroStore } from '@/src/lib/store/useIntroStore'
import { CornerBottomLeftIcon, CornerBottomRightIcon, CornerTopLeftIcon, CornerTopRightIcon } from '@radix-ui/react-icons'
import { motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useState } from 'react'

export default function Tracker() {

	const { scrollYProgress } = useScroll()
	const [borderFocused, setBorderFocused] = useState(true)
	useMotionValueEvent(scrollYProgress, "change", (scrollYProgress) => {
		let x = (scrollYProgress  / (1 / 4)) % 1
		// console.log('x:', x)
		if (x < 0.02 || x > 0.98) {
			setBorderFocused(true)
		}
		else {
			setBorderFocused(false)
		}
	})
	const introCompleted = useIntroStore((state) => state.introCompleted)

	return (
		<>
		{introCompleted ?
			(	
				<>	
					<div className=' absolute flex w-screen h-screen justify-center items-start pointer-events-none '>
						<motion.div
							initial={{ height: '0%'}}
							animate={{ height: '100%'}}
							transition={{ ease: [0.283, 0.542, 0.453, 0.948], duration: 0.7, delay: 1.2 }}
							className="absolute flex w-[1px] bg-slate-400/20 invert" 
							/>
						<motion.div 
							initial={{opacity: 0, filter: "blur(3px)", y: -10, rotate:180}}
							animate={{opacity: 1, filter: "blur(0px)", y: 0, rotate:180}}	
							transition={{duration: 1.5, ease: "easeInOut", delay: 1.5}}
							className=" absolute flex w-fit bottom-24 h-fit my-auto z-50 rotate-180 "
						>
							<Triangle />
						</motion.div>
					</div>


					<motion.div
						initial={{ scale: 1, opacity: 0.5 }}
						animate={borderFocused ? { scale: 1., opacity: 1 } : { scale: 1.2, opacity: 0.2 }}
						transition={{ type: "spring", stiffness: 50, damping: 10, duration: 1.5 }}
						className=' absolute flex-col w-[39%] h-auto aspect-[16/9.5] text-slate-200/50 '
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
				</>
			)
			:
			<></>
		}
		</>
	)
}
