import { useGalleryStore } from '@/src/lib/store/useGalleryStore'
import { cn } from '@/src/lib/utils/utils'
import React from 'react'

export default function MobileNavbar() {
	const darkMode = useGalleryStore((state) => state.darkMode)
	const nameListToggled = useGalleryStore((state) => state.nameListToggled)
  return (
	  <div className={cn(' fixed top-0 flex w-screen h-12 items-center px-4  z-50 transition-all duration-500', nameListToggled ? 'bg-slate-950' : 'bg-transparent')}>
	  <h1 className={cn(' flex w-full font-elgoc font-black text-xl ',
		  !darkMode && nameListToggled ? 'text-white' : darkMode && !nameListToggled ? 'text-slate-950' : 'text-white',
		 'transition-all duration-700')}>
		Art Factory
	  </h1>
	</div>
  )
}
