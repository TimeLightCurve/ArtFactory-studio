
import { easing } from 'maath'
import { motion, useMotionValueEvent, useScroll } from "motion/react"
import { useRef, useState } from "react"


const innerNav = ['7', '3', '2', '1.3', '1.12', '7', '3', '2', '1.3', '1.12', '7', '3', '2', '1.3', '1.12']
const mainNav = ['1.00', '0.7', '0.5', '0.38', '0.24', '1.00', '0.7', '0.5', '0.38', '0.24', '1.00', '0.7', '0.5', '0.38', '0.24']
const mainNavItems = ['SERVICES', 'MODELS', 'STUDIO', 'SHOWCASE', 'ARTISTS', 'SERVICES', 'MODELS', 'STUDIO', 'SHOWCASE', 'ARTISTS', 'SERVICES', 'MODELS', 'STUDIO', 'SHOWCASE', 'ARTISTS',]

export default function Navbar() {
	const { scrollYProgress } = useScroll()
	const [navPosition, setNavPosition] = useState(0)
	// const navPosition = useMotionValue(0)
	const navPositionRef = useRef(0)
	const currentVideo = useRef(0)

	useMotionValueEvent(scrollYProgress, "change", (latest) => {
		easing.damp(
			navPositionRef, 'current',
			-latest * 48 * 12, // 48 items, each 12px wide
			0.1,
			0.01,
		)
		setNavPosition(navPositionRef.current)
		const tracker = (latest * 4 + 0.0006)
		currentVideo.current = new Number(tracker.toFixed(2)).valueOf()
		// console.log('currentVideo:', currentVideo.current)
	})

	return (
		<div className="absolute flex  w-screen h-screen justify-center items-end z-50" >


			{/* <div className=" flex w-1/4 h-16 justify-start items-end overflow-hidden">
		{
			new Array(15).fill(0).map((_, i) => (
				<div key={i} className={` ${i%3 === 1 ? 'h-1/3' : 'h-1/4'} flex w-12 border-r shrink-0`}
					style={{ animationDelay: `${i * 0.1}s` }}
				/>
			))
		}
	  </div> */}
				<div className="absolute flex flex-col w-[35%] h-[5rem] justify-start items-end  pb-0 overflow-hidden z-[40] ">
					<div className="flex flex-col w-full shrink-0 ">
						<div className=" flex w-full h-[12px] justify-center items-center ">
							<div className=" ml-0.5 w-[6px] h-full bg-red-800" />
						</div>
						<div className=" flex flex-col w-full h-8 border-t border-slate-100/20 items-end pt-0.5 pb-1 font-manrope" >
							<div className=" flex w-full h-1/2 justify-center items-start">
								{innerNav.map((item, i) => (
									<div key={i} className={`  flex w-36 h-full text-xs text-red-800 shrink-0`}
									>{item}</div>
								))}
							</div>
							<motion.div
								className=" flex w-full h-1/2 justify-center items-start pl-0"
								style={{ x: navPosition }}
							>
								{mainNavItems.map((item, i) => (
									<div key={i} className={` ${currentVideo.current === (i - 2) % 5 ? 'text-slate-100/90 text-sm' : 'text-slate-100/10 text-[0.5rem]'}  flex w-36 h-full justify-center items-center gap-1 shrink-0 transition-all ease-out duration-500`}
									>
										<span className={`${currentVideo.current === (i - 2) % 5 ? 'text-slate-100/10 text-[0.5rem]' : 'text-slate-100/90 text-sm'} transition-all duration-300 ease-in `}>{mainNav[i]}</span>
										{item}
									</div>
								))}
							</motion.div>
						</div>
					</div>

								{/* <motion.div 
							className=" flex w-full h-1/6 pl-0 justify-center items-center mb-2"
							style={{ x: navPosition }}
						>
							{
								new Array(48).fill(0).map((_, i) => (
									<div key={i} className={` ${i % 2 === 0 ? 'h-[10px]' : ' h-[5px]'} flex w-6  border-l border-slate-100/40 shrink-0`}
										
									/>
								))
							}
						</motion.div> */}
					<div className="flex w-full h-[12px] justify-center  ">
						<div className=" ml-0 w-[6px] h-full bg-white/60" />
					</div>

					<motion.div className=" flex w-full h-[12px] justify-center items-end mt-1 "
						style={{ x: navPosition }}
					>
						{
							new Array(96).fill(0).map((_, i) => (
								<div key={i} className={` ${i % 3 === 0 ? 'h-full' : ' h-[70%]'} flex w-6  border-l border-slate-100/40 shrink-0`}
								//   style={{ height: `${i === 12 ? 50 : (Math.abs(i - 12) *  100 / 12) + 40}%` }}
								/>
							))
						}
					</motion.div>
					{/* <div  className=" flex w-[200vw] aspect-square shrink-0 h-[400vh] border border-slate-100/0 rounded-0 overflow-hidden justify-end items-end"> */}

					{/* </div> */}



				</div>

			<div className=' absolute flex w-screen h-screen justify-center items-end'>
				<div className="relative flex w-[45%] h-[20rem] justify-center items-end pb-0 ">
					{/* <div className='progressive-blur-bg absolute top-[40%] flex w-full h-[20rem] justify-center items-end z-10 overflow-visible' /> */}

					<div className="  absolute -left-32 top-[60%] flex items-end w-full h-full pointer-events-none z-50">
						<div className=" mask-radial-core absolute flex w-[30rem] h-[24rem] overflow-visible z-50 " />
					</div>
				</div>
			</div>	
		</div>
	)
}
