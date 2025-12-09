'use client'

import { useIsClient, useWindowSize } from "@uidotdev/usehooks"
import DesktopLayout from "./DesktopLayout"
import MobileLayout from "./MobileLayout"

export default function MainLayout() {
	// const { width } = useWindowSize()
	const isClient = useIsClient()



	if (!isClient) return null
	// const [isMobile, setIsMobile] = useState(false)

	// useEffect(() => {
	// 	if (width && width <= 768) {
	// 		setIsMobile(true)
	// 	} else {
	// 		setIsMobile(false)
	// 	}
	// }, [width])
	const width = window.innerWidth
	const isMobile = width && width <= 768

	return (
		<main className="fixed flex w-full h-full  ">
			{isMobile ?
				<MobileLayout />
				:
				<DesktopLayout />

			}
		</main>
	)
}
