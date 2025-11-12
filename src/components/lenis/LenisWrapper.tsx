'use client'

import ReactLenis, { LenisRef } from "lenis/react"
import { cancelFrame, frame } from "motion/react"
import { useEffect, useRef } from "react"

export default function LenisWrapper() {

	const lenisRef = useRef<LenisRef>(null)

	useEffect(() => {
		function update(data: { timestamp: number }) {
			const time = data.timestamp
			lenisRef.current?.lenis?.raf(time)
		}

		frame.update(update, true)

		return () => cancelFrame(update)
	}, [])

  return (
	  <ReactLenis root options={{ autoRaf: false }} ref={lenisRef} />

  )
}
