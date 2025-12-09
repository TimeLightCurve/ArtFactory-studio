'use client'

import { motion, MotionValue, useScroll, useSpring, useTransform, useVelocity } from 'motion/react'
import Image from 'next/image'
import { useRef } from 'react'


const imagesUrl = [
	// '/images/IMG_0442.jpeg',
	// '/images/48-eszter-veres-main-book.jpg',
	'/images/1.jpg',
	'/images/2.jpg',
	'/images/3.jpg',
	'/images/4.jpg',
	'/images/5.jpg',
	'/images/6.jpg',
	'/images/7.jpg',
	'/images/8.jpg',
	'/images/9.jpg',
	'/images/1.jpg',
	'/images/2.jpg',
	'/images/3.jpg',
	'/images/4.jpg',
	'/images/5.jpg',
	'/images/6.jpg',
	'/images/7.jpg',
	'/images/8.jpg',
	'/images/9.jpg',
]


export default function Test() {

	const containerRef = useRef<HTMLDivElement>(null)
	// const { scrollY } = useScroll({ container: containerRef })




	return (
		<div ref={containerRef} className='relative flex flex-col w-full h-screen gap-10 px-1 pb-4 overflow-y-scroll overflow-x-hidden'>
			<div className=' flex w-full justify-end '>
				<div className=' flex flex-col w-fit h-96 justify-end items-end bg-neutral-950 px-2'>		
					<motion.h1
						initial={{
							// x: 200,
							// opacity: 0, 
							// filter: 'blur(30px)'
						}}
						animate={{
							// x: 0,
							// opacity: 1,
							// filter: 'blur(0px)',
							transition: {
								duration: 1.5,
								ease: [0.22, 1, 0.36, 1],
							}
						}}
						className=' flex flex-col w-full justify-start items-end text-white font-allegria pl-4'
					>
						<span className=' font-normal text-[2.5rem] leading-[2.5rem]'>Bachir</span>
						<span className='font-semibold text-[4rem] leading-[3.25rem]'>Tayachi</span>
					</motion.h1>
					<motion.h1
						initial={{
							// x: 200,
							// opacity: 0, 
							// filter: 'blur(30px)'
						}}
						animate={{
							// x: 0,
							// opacity: 1,
							// filter: 'blur(0px)',
							transition: {
								duration: 1.5,
								ease: [0.22, 1, 0.36, 1],
							}
						}}
						className=' flex flex-col w-full justify-start items-end text-white font-allegria pl-4'
					>
						<span className=' font-normal text-3xl '>photographer</span>
					</motion.h1>
				</div>
			</div>
			<div className='relative flex flex-col w-full gap-24'>

				<div className='flex w-full h-40' />

				{imagesUrl.map((url, index) => (
					<ImageItem key={index} url={url} index={index} 
					// scrollY={scrollY} 
					/>
				))}

			</div>
		</div>
	)
}

function ImageItem({ url, index }: { url: string, index: number }) {

	// const scrollVelocity = useVelocity(scrollY)
	// const smoothVelocity = useSpring(scrollVelocity, {
	// 	damping: 50 + index * 1,
	// 	stiffness: 400
	// })

	// const y = useTransform(smoothVelocity, (latestVelocity) => {
	// 	// Adjust the multiplier to control the strength of the lag
	// 	return latestVelocity * (0.11 - index * 0.01)
	// })

	return (
		<div className="flex flex-col w-full gap-1">
			<motion.div
				initial={{
					width: '98%', 
					height: '90%',
					scale: 1.2,
					filter: 'blur(10px)',
					opacity: 0.2,
					// x: -80,
				}}
				whileInView={{
					width: '100%',
					height: '100%',
					scale: 1,
					filter: 'blur(0px)',
					opacity: 1,
					// x:0,
				}}
				transition={{
					duration: 1.2,
					bounce: 0,
					// ease: [0.22, 1, 0.36, 1],
				}}
				// viewport={{ once: true }}
				// style={{ y }}
				className=' flex flex-col w-full h-full overflow-hidden '
			>
				<Image
					src={url}
					alt='Bachir Tayachi Artwork'
					width={0}
					height={0}
					sizes="100vw"
					className="w-full h-auto object-contain"
				/>
				<div className=' flex items-center font-allegria text-2xl gap-1 pl-1'>
					<div className=' flex w-3 h-3 justify-center items-center  bg-[#0e0e0e] text-white'>
					</div>
					<span className=' text-2xl'>
						eszter veres
					</span>
				</div>
			</motion.div>
		</div>
	)
}


{/* <div className=' flex w-full justify-start items-start '>
	<motion.h1
	initial={{
		// x: 200,
		// opacity: 0, 
			// filter: 'blur(30px)'
		}}
		animate={{
			// x: 0,
			// opacity: 1,
			// filter: 'blur(0px)',
			transition: {
				duration: 1.5,
				ease: [0.22, 1, 0.36, 1],
			}
		}}
		className=' flex flex-col w-full justify-start items-end text-slate-950 font-allegria pl-4'
	>
		<span className=' font-normal text-[2.5rem] leading-[2.5rem]'>photographer</span>
	</motion.h1>
	<motion.h1
		initial={{
			// x: 200,
			// opacity: 0, 
			// filter: 'blur(30px)'
		}}
		animate={{
			// x: 0,
			// opacity: 1,
			// filter: 'blur(0px)',
			transition: {
				duration: 1.5,
				ease: [0.22, 1, 0.36, 1],
			}
		}}
		className=' flex flex-col w-full justify-start items-end text-slate-950 font-allegria pl-4'
	>
		<span className=' font-normal text-[2.5rem] leading-[2.5rem]'>Bachir</span>
		<span className='font-semibold text-[4rem] leading-[3.25rem]'>Tayachi</span>
	</motion.h1>
</div> */}