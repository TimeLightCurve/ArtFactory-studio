
'use client'

import { usePathname, useRouter } from "next/navigation"
import MobileCanvas from "../canvas/MobileCanvas"
import MobileNavbar from "./MobileNavbar"
import WheelContainer from "./WheelContainer"
import { useEffect, useState } from "react"
import  ToolWheel  from "../ToolWheel"
import { useGalleryStore } from "@/src/lib/store/useGalleryStore"

export default function MobileLayout() {
	// check url params for 'page' param
	const url = usePathname()
	const [showCanvas, setShowCanvas] = useState(true)
	const setWheelOpened = useGalleryStore((state) => state.setWheelOpened)

	useEffect(() => {
		if (url.includes('portfolio')) {
			setShowCanvas(false)
		} else {
			setShowCanvas(true)
		}
	}, [url])
	
	
  return (
	  <div
		  onClick={() => setWheelOpened(false)} 
	  	className="fixed flex flex-col w-full h-full shrink-0 justify-center items-center overflow-hidden z-50"
		// style={{
		// 	height: windowHeight}}
	  >
		  {/* <Image src='/25-2.jpg' alt='Background Texture' width={1080} height={1532} className="absolute w-full h-svh object-cover z-10  opacity-100" />		 */}
		  <MobileNavbar />
		  <ToolWheel />
		  {showCanvas &&
		  <>
		  	<WheelContainer />
		  	<MobileCanvas />
		  </>
		  }

	  </div> 
  )
}
