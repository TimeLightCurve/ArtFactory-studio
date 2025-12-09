import { useEffect, useRef } from "react"
import ImageInstances from "./StudioImages"

export default function FixedCanvasWrapper() {
	const wrapperRef = useRef<HTMLDivElement>(null)
	const targetYRef = useRef(0)
	const currentYRef = useRef(0)
	const rafRef = useRef<number>()

	useEffect(() => {
		const onScroll = () => {
			targetYRef.current = window.scrollY
			if (!rafRef.current) {
				rafRef.current = requestAnimationFrame(apply)
			}
		}
		const apply = () => {
			rafRef.current = 0
			// No smoothing: currentYRef.current = targetYRef.current
			// With smoothing:
			currentYRef.current += (targetYRef.current - currentYRef.current) * 0.25
			if (wrapperRef.current) {
				wrapperRef.current.style.transform = `translateY(${currentYRef.current}px)`
			}
			if (Math.abs(targetYRef.current - currentYRef.current) > 0.1) {
				rafRef.current = requestAnimationFrame(apply)
			}
		}
		window.addEventListener("scroll", onScroll, { passive: true })
		return () => {
			window.removeEventListener("scroll", onScroll)
			if (rafRef.current) cancelAnimationFrame(rafRef.current)
		}
	}, [])

	return (
		<div
			ref={wrapperRef}
			style={{
				position: "absolute",
				top: 0,
				left: 0,
				width: "100vw",
				height: "100vh",
				overflow: "hidden",
				pointerEvents: "none",
				willChange: "transform",
			}}
		>
			<ImageInstances />
		</div>
	)
}