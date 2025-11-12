'use client'

import { gsap } from 'gsap'
import { useEffect, useId, useRef, useState } from 'react'

type GooeyMenuItemProps = {
	className?: string
	// next title to morph into
	nextTitle: string
}

export default function GooeyMenuItem({ className, nextTitle }: GooeyMenuItemProps) {
	// text1 is the stored/current title
	const [currentTitle, setCurrentTitle] = useState<string>('')

	const svgRef = useRef<SVGSVGElement | null>(null)
	const gRef = useRef<SVGGElement | null>(null)
	const text1Ref = useRef<SVGTextElement | null>(null)
	const text2Ref = useRef<SVGTextElement | null>(null)
	const feBlurRef = useRef<SVGFEGaussianBlurElement | null>(null)
	const tl1Ref = useRef<gsap.core.Timeline | null>(null)
	const tl2Ref = useRef<gsap.core.Timeline | null>(null)
	const primitiveValuesRef = useRef({ stdDeviation: 0 })
	const pendingTitleRef = useRef<string>(nextTitle) // always the latest requested title

	const filterId = useId()

	const applyFilter = (on: boolean) => {
		const g = gRef.current
		if (!g) return
		g.style.filter = on ? `url(#${filterId})` : 'none'
	}

	// Build timelines once
	useEffect(() => {
		const g = gRef.current
		const text1 = text1Ref.current
		const text2 = text2Ref.current
		const feBlur = feBlurRef.current
		if (!g || !text1 || !text2 || !feBlur) return

		// initial state
		gsap.set(text1, { opacity: 1, x: 0 })
		gsap.set(text2, { opacity: 0, x: 0 })
		feBlur.setAttribute('stdDeviation', '0')

		const primitiveValues = primitiveValuesRef.current

		const tl1 = gsap.timeline({
			paused: true,
			onStart: () => {
				primitiveValues.stdDeviation = 0
				feBlur.setAttribute('stdDeviation', '0')
				applyFilter(true)
			},
			onUpdate: () => {
				feBlur.setAttribute('stdDeviation', String(primitiveValues.stdDeviation))
			},
			onComplete: () => {
				// start reveal with the latest title value (do not change state yet)
				// React already updated <text2>{nextTitle}</text2> via prop; we just run tl2 from 0
				const t2 = tl2Ref.current
				if (!t2) return
				// reset primitive for fresh blur cycle
				primitiveValues.stdDeviation = 0
				feBlur.setAttribute('stdDeviation', '0')
				t2.play(0)
			},
		})

		const tl2 = gsap.timeline({
			paused: true,
			onStart: () => {
				applyFilter(true)
			},
			onUpdate: () => {
				feBlur.setAttribute('stdDeviation', String(primitiveValues.stdDeviation))
			},
			onComplete: () => {
				// finalize: commit the latest title and reset visuals
				setCurrentTitle(pendingTitleRef.current)
				requestAnimationFrame(() => {
					applyFilter(false)
					feBlur.setAttribute('stdDeviation', '0')
					gsap.set(text1, { opacity: 1, x: 0 })
					gsap.set(text2, { opacity: 0, x: 0 })
				})
			},
		})

		// tl1: fade current out + slight move, with blur pulse
		tl1
			.to(primitiveValues, { duration: 0.5, ease: 'none', startAt: { stdDeviation: 0 }, stdDeviation: 1.5 }, 0)
			.to(primitiveValues, { duration: 0.5, ease: 'none', stdDeviation: 0 }, 0.5)
			.to(text1, { duration: 0.6, ease: 'none', opacity: 0 }, 0)
			.to(text1, { duration: 0.6, ease: 'power2.inOut', x: 8 }, 0)

		// tl2: reveal next in + slight move back, with blur pulse
		tl2
			.to(primitiveValues, { duration: 0.5, ease: 'none', startAt: { stdDeviation: 0 }, stdDeviation: 1.5 }, 0)
			.to(primitiveValues, { duration: 0.5, ease: 'none', stdDeviation: 0 }, 0.5)
			.to(text2, { duration: 0.8, ease: 'none', opacity: 1 }, 0)
			.to(text2, { duration: 0.8, ease: 'power2.inOut', startAt: { x: -8 }, x: 0 }, 0)

		tl1Ref.current = tl1
		tl2Ref.current = tl2

		return () => {
			tl1.kill()
			tl2.kill()
			tl1Ref.current = null
			tl2Ref.current = null
		}
	}, []) // build once

	// Orchestrate on prop changes with interrupt handling
	useEffect(() => {
		if (!nextTitle || nextTitle === currentTitle) return
		pendingTitleRef.current = nextTitle

		const tl1 = tl1Ref.current
		const tl2 = tl2Ref.current
		const feBlur = feBlurRef.current
		if (!tl1 || !tl2 || !feBlur) return

		// Case: currently revealing (tl2 active). Just swap text (prop already did) and keep going.
		if (tl2.isActive()) {
			// ensure it keeps playing forward
			tl2.play()
			return
		}

		// Case: currently fading out (tl1 active). Do nothing; let it finish,
		// tl1.onComplete will start tl2 with the latest pendingTitleRef.
		if (tl1.isActive()) {
			// console.log('progress', tl1.progress())
			return
		}

		// Case: idle. Start from the beginning of the sequence: tl1 then tl2.
		primitiveValuesRef.current.stdDeviation = 0
		feBlur.setAttribute('stdDeviation', '0')
		tl1.play(0)
	}, [nextTitle, currentTitle])

	return (
		<nav className={`flex w-full h-12 justify-center items-center text-base z-50 ${className || ''}`}>
			<a className="relative flex w-full h-full justify-center items-center cursor-pointer">
				<svg
					ref={svgRef}
					className="menu__text absolute flex w-full h-full justify-center items-center fill-white font-elgoc font-bold"
					viewBox="0 0 110 20"
					preserveAspectRatio="xMidYMid meet"
				>
					<defs>
						<filter id={filterId}>
							<feGaussianBlur
								ref={feBlurRef}
								in="SourceGraphic"
								stdDeviation="1"
								result="blur"
							/>
							<feColorMatrix
								in="blur"
								mode="matrix"
								values="1 0 0 0 0  0 1 0 0 0  1 0 1 0 0  0 0 0 16 -7"
								result="goo"
							/>
							<feComposite in="SourceGraphic" in2="goo" operator="atop" />
						</filter>
					</defs>
					<g ref={gRef} >
						{/* text1 = stored/current title */}
						<text
							ref={text1Ref}
							x="50%"
							y="50%"
							textAnchor="middle"
							dominantBaseline="middle"
						>
							{currentTitle}
						</text>
						{/* text2 = incoming/next title */}
						<text
							ref={text2Ref}
							x="50%"
							y="50%"
							textAnchor="middle"
							dominantBaseline="middle"
						>
							{nextTitle}
						</text>
					</g>
				</svg>
			</a>
		</nav>
	)
}