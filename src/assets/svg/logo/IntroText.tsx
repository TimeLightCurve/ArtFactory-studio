'use client'

import { motion } from 'motion/react'
import { useMemo } from 'react'

// Source text (keep trailing spaces if you want a pause at the end)
const introText = ["“Art is not what you see,", "but what you make others see.”", "--Edgar Degas"]

// Motion variants for staggered letter animation
const containerVariants = {
	hidden: {},
	show: {
		transition: {
			staggerChildren: 0.105,
			// delay: 2
		},
	},
}

const letterVariants = {
	hidden: { opacity: 0, y: '0.15em', filter: 'blur(10px)' }, // move up from below relative to font size
	show: {
		opacity: 0.8,
		y: 0,
		filter: 'blur(0px)',
		transition: {
			duration: 1.58,
			ease: [0.25, 0.4, 0.25, 1],
			// delay: 2
		},
	},
}

export default function IntroText() {

	// Pre-split characters once; convert normal spaces to \u00A0 when we want them preserved
	const words = useMemo(() => introText.map((sentence, index) => (
		sentence.split(' ')
	)), [])

	return (
		<motion.div
			variants={containerVariants}
			initial="hidden"
			animate="show"
			className="w-full h-full justify-center whitespace-pre-wrap leading-relaxed text-slate-200 font-semibold text-3xl"
			aria-label={introText.join(' ')}
		>
			{words.map((wordSent, i) => {
				return (
					<div key={`${wordSent}-${i}-container`} className=' inline-block '>
						<motion.div
							key={`${wordSent}-${i}`}
							initial={{ x: i % 2 === 0 ? -40 : 40 }}
							animate={{ x: 0 }}
							transition={{ duration: 1.5, type: "spring", bounce: 0.1, delay: i * 0.9 }}
							className={` ${i === words.length - 1 ? ' font-thin text-2xl ' : ''} inline-block`}
						>
							{wordSent.map((char, index) => (
								<motion.span
									key={`${char}-${i}-${index}`}
									variants={letterVariants as any}
									className={` inline-block align-baseline will-change-transform select-none`}
									style={{
										// Prevent layout shift when translating from below
										perspective: 400,
									}}
								>
									{char + ' '}
								</motion.span>)
							)}

						</motion.div>
						<br key={`${wordSent}-${i}-br`}/>
					</div>
				)
			})}
		</motion.div>
	)
}
