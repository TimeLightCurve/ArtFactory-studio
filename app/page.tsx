'use client'

import Scene from "@/src/components/canvas/Scene"
import Intro from "@/src/components/intro/Intro"
import { cancelFrame, frame } from 'motion/react'
import { ReactLenis, LenisRef } from 'lenis/react'
import { useEffect, useRef } from "react"
import ScreenLayout from "@/src/components/screen-layout/ScreenLayout"
// import Image from "next/image";

export default function Home() {
  const lenisRef = useRef<LenisRef>(null)

  useEffect(() => {
    function update(data: { timestamp: number }) {
      const time = data.timestamp
      lenisRef.current?.lenis?.raf(time)
    }

    frame.update(update, true)

    return () => cancelFrame(update)
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
      },[])

  return (
    <>
     <ReactLenis root options={{ autoRaf: false }} ref={lenisRef} />
    <main className="relative flex w-screen h-[520vh] items-center justify-center bg-neutral-900">
      {/* <div className=" absolute inset-0 w-screen h-screen " >
        <Image
          src="/Paper-Texture-4.jpg"
          alt="Background Image"
          fill
          className=" object-cover opacity-80"
          priority
        />
      </div> */}
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
    </>
  );
}

