'use client'

import Image from "next/image"

export default function BgTexture() {
  return (
	  <div className=" absolute -top-20 flex w-full h-[900px] shrink-0 z-30 ">
		  <Image src={'/black-paper-texture.jpg'} alt="black-paper-texture" width={2599} height={3888} className=" object-cover" />
	  </div>
  )
}
