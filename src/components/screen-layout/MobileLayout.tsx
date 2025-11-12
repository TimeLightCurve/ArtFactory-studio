
'use client'

import MobileCanvas from "../canvas/MobileCanvas"
import MobileNavbar from "./MobileNavbar"
import WheelContainer from "./WheelContainer"

export default function MobileLayout() {
  return (
	  <div className="absolute flex flex-col w-full h-svh shrink-0 justify-center items-center  overflow-x-hidden overflow-y-scroll z-50"
	  // style={{
	  // 	height: windowHeight}}
	  >
		  <MobileNavbar />
		  <WheelContainer />
		  <MobileCanvas />
	  </div> 
  )
}
