import { useEffect } from "react"
import Scene from "../canvas/Scene"
import Intro from "../intro/Intro"
import ScreenLayout from "./ScreenLayout"

export default function DesktopLayout() {

	useEffect(() => {
		window.scrollTo(0, 0)
	}, [])
	return (
		<main className="relative flex w-screen h-[520vh] items-center justify-center bg-neutral-900">
			<Scene
				style={{
					position: 'fixed',
					top: 0,
					left: 0,
					width: '100vw',
					height: '100vh',
					pointerEvents: 'none',
					zIndex: 20,
				}}
			/>
			<Intro />
			<ScreenLayout />
		</main>
	)
}
