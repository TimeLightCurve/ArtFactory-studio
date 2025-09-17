
import { useIntroStore } from '@/src/lib/store/useIntroStore'
import { useLenis } from 'lenis/react'
import {AnimatePresence, motion, useMotionValueEvent, useScroll} from 'motion/react'
import { title } from 'process'
import { useEffect, useRef, useState } from 'react'


const titles = [
	"ART   FAC TO  RY",
	"SHOWCASE",
	"ARTISTS",
	"SERVICES",
	"MODELS",
	// "OUR STORY",
	// "JOURNALS"
]



export default function SectionTitle() {

	const introCompleted = useIntroStore((state) => state.introCompleted)
	const { scrollYProgress } = useScroll()

	const sections = titles.length
	const lastIndexRef = useRef(-1)
	const [heroTitle, setHeroTitle] = useState(titles[0])
	const [animationStart, setAnimationStart] = useState(false)
	const [scrollDirection, setScrollDirection] = useState(1) // 1 down, -1 up
	const lenis = useLenis()

	useMotionValueEvent(scrollYProgress, 'change', (p) => {
		// p is 0..1

		// indexTracker.current = (scrollYProgress / (1 / 6))
		// scrollProgressRef.current = (indexTracker.current % 1) 
		const raw = p * sections // 0..sections
		const idx = Math.min(sections - 1, Math.floor(raw)) // clamp
		const frac = Math.floor(raw) % 1 // fractional part 0..1
		

		if (lastIndexRef.current !== idx) {
			lastIndexRef.current = idx
			setHeroTitle(titles[idx])
		}
		if(lenis){
			setScrollDirection(lenis.direction)
		}
		setAnimationStart(frac < 0.05 || frac > 0.95)

	})

	const containerVariants = {
		hidden: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
		show: { transition: { staggerChildren: 0.03, staggerDirection: 1 } },
		hide: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
	} as const

	const charVariants = {
		hidden: { x: scrollDirection === 1 ? 200 : -200},
		show: { x: 0, transition: { type: 'spring', bounce: 0.15, duration: 0.5 } },
		hide: { x: scrollDirection === 1 ? -200 : 200, transition: { duration: 0.4 } },
	} as const



	return (
		<div className="flex flex-row w-[54%] aspect-video h-auto gap-16 flex-wrap pl-10 shrink-0">
			<AnimatePresence mode="wait" initial={false}>
				{introCompleted && animationStart && (
					<motion.div
						key={heroTitle} // Force unmount/mount on title change for exit/enter to run
						className="flex w-full h-full justify-start items-center flex-wrap gap-10"
						variants={containerVariants}
						initial="hidden"
						animate="show"
						exit="hide"
					>
						{heroTitle.split('').map((ch, index) => (
							<>
							<motion.div
								key={`${heroTitle}-${index}`}
								className="flex w-fit h-fit justify-start items-center font-bold text-[12rem] leading-[9rem] font-chakra text-slate-100/40 overflow-hidden"
								// variants={charVariants}
							>
								<motion.span
									key={index}
									variants={charVariants}
								>
									{ch}
								</motion.span>
							</motion.div>
							{	Math.ceil(heroTitle.length / 2) === index + 1 && (
									<div key={`${index+'space'}`} className=" flex w-[60%] h-16 " />
								)
							}
							</>
						))}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}