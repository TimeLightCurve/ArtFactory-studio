'use client'

import { useIntroStore } from "@/src/lib/store/useIntroStore"
import { motion, Variants } from "motion/react"

export default function LogoText() {

	const setVisible = useIntroStore((state) => state.setVisible)

	const draw: Variants = {
		hidden: {
			pathLength: 0,
			opacity: 0,
			fill: "rgba(255, 255, 255, 0.0)",
			width: '100%',
			height: '100%',
			filter: 'blur(8px)',
		},
		visible: (i: number) => {
			const delay = i * 0.8
			return {
				pathLength: 1,
				opacity: 1,
				fill: "rgba(255, 255, 255, 0.9)",
				filter: 'blur(0px)',
				transition: {
					pathLength: {
						delay: delay * 1.2, 
						duration: 1.5,
						ease: [0.58, 0.009, 0.902, 0.397] 
					},
					opacity: { 
						delay:  delay * 1.2, 
						duration: 2 , 
						ease: [0.58, 0.009, 0.902, 0.397] 
					},
					fill: { 
						delay: 0.9 + delay * 1.0,
						duration: 2.0,
						ease: [0.58, 0.009, 0.902, 0.397] 
					},
					filter: { 
						delay: delay * 1.8 + 0.2, 
						duration: 0.6,
						ease: [0.58, 0.009, 0.902, 0.397] 
					}
				},
			}
		},
	}



	return (
		<div className=" flex flex-row w-full  gap-8">
			<div className=" flex h-full items-end ">
				<motion.svg
					id="Layer_2"
					data-name="Layer 2"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 220.44 232.6"
					initial="hidden"
					animate="visible"
					style={{
						height: '74%',
					}}

				>
					<motion.g
						id="Layer_1-2"
						data-name="Layer 1"
						style={{
							fill: "rgba(255, 255, 255, 0.0)",
							stroke: "rgba(255, 255, 255, 0.3)",
							strokeMiterlimit: 10,
							strokeWidth: 2,
							scale: 1,
						}}
					// initial={{ fill: "rgba(255, 255, 255, 0.0)"}}
					// animate={{fill: "rgba(255, 255, 255, 1.0)", transition: { delay: 1.2, duration: 2.5 }}}
					>
						<motion.path
							d="M200.41,212.86C182.66,186.39,111.39,5.29,105.54.8l-53.75,133.25c-9.67,24-19.05,52.13-31.55,74.39-4.92,8.76-11.55,16.23-18.97,22.95,16.99.38,34.23.67,51.2-.07-8.41-4.01-16.53-8.31-19.84-17.69-5.17-14.68,6.31-34.8,11.83-48.26,23.83-.19,47.66-.23,71.5-.13h6.73c5.7,13.92,17.71,34.96,11.32,50.09-3.56,8.43-11.27,12.68-19.34,16.01,34.54.69,69.76,1.3,104.27.01-7.29-5.13-13.53-11.04-18.53-18.49ZM84.78,160.65h-38.32s36.87-92.15,36.87-92.15c4.87,7.95,8.02,19.19,11.54,27.95l25.72,64.15-35.81.05Z"
							variants={draw}
							custom={0}

						/>
					</motion.g>
				</motion.svg>

				<motion.svg
					id="Layer_2"
					data-name="Layer 2"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 126.82 162.94"
					initial="hidden"
					animate="visible"
					style={{
						height: '50%'
					}}
				>
					<motion.g
						id="Layer_1-2"
						data-name="Layer 1"
						style={{
							fill: "rgba(255, 255, 255, 0.0)",
							stroke: "rgba(255, 255, 255, 0.3)",
							strokeMiterlimit: 10,
							strokeWidth: 2,
							scale: 1,
						}}
					// initial={{ fill: "rgba(255, 255, 255, 0.0)"}}
					// animate={{fill: "rgba(255, 255, 255, 1.0)", transition: { delay: 1.5, duration: 2.5 }}}
					>
						<motion.path
							d="M87.48,63.05c.35-14.31.38-34.07-6.92-46.79-2.16-3.76-7.33-10.49-11.76-11.6-1.4-.36-1.73-.15-2.94.59-1.86,4.87-.59,60.66-.57,70.48.08,17.48-2.07,47.71.99,63.56,2.07,10.75,7.56,16.6,16.3,22.51-26.79,1.06-54.08.62-80.89,0,4.69-2.92,9.06-5.97,12.2-10.61,2.83-4.17,3.91-8.27,4.57-13.2,2.37-17.79.99-37.1.99-55.07.01-18.48,1.86-44.57-1.6-62.08C15.97,11.38,9.71,6.21,2.08,1.1c15.64-.83,31.57-.25,47.25-.27,13.17-.02,27.47-1.14,40.46.84,6.72,1.03,13.31,3.09,18.94,6.99,11.4,7.9,15.19,20.09,17.54,33.09-12.87,7.21-25.8,14.31-38.79,21.3Z"
							variants={draw}
							custom={0.1}
						/>
					</motion.g>
				</motion.svg>

				<motion.svg
					id="Layer_2"
					data-name="Layer 2"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 104.46 217.7"
					initial="hidden"
					animate="visible"
					style={{
						height: '68%'
					}}
				>
					<motion.g
						id="Layer_1-2"
						data-name="Layer 1"
						style={{
							fill: "rgba(255, 255, 255, 0.0)",
							stroke: "rgba(255, 255, 255, 0.3)",
							strokeMiterlimit: 10,
							strokeWidth: 2,
							scale: 1,
						}}
					// initial={{ fill: "rgba(255, 255, 255, 0.0)"}}
					// animate={{fill: "rgba(255, 255, 255, 1.0)", transition: { delay: 1.5, duration: 2.5 }}}
					>
						<motion.path
							d="M102.76,216.21c-11.23,1.49-23.08,1.04-34.35.25-13.22-.51-29.67-3.66-39.34-13.23-5.32-5.28-7.64-12.7-8.87-19.93-2.58-15.05-1.28-31.46-1.27-46.71l.02-76.52c-6.07-.03-12.39.25-18.34-1.09.69-2.8,15.58-7.5,18.96-9.08C39.36,40.6,53.81,19.52,64.28,1.16c2.32,6.03.72,45.16.73,54.18,8.66-.03,19.53-1.2,27.7,1.72l.33.94c-6.49,3.68-20.64,2.06-28.1,2.08.23,22.89-.03,45.81-.05,68.69-.01,17.05-2.29,42.95,3.15,58.85,5.29,15.44,21.16,21.95,34.72,28.59Z"
							variants={draw}
							custom={0.2}
						/>
					</motion.g>
				</motion.svg>
			</div>
			{/* <div className=" flex w-10 h-full bg-white border border-white flex-shrink-0 " /> */}
			<div className=" flex h-full items-end ">
				<motion.svg
					id="Layer_2"
					data-name="Layer 2"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 178.43 227.4"
					initial="hidden"
					animate="visible"
					style={{
						height: '74%',
					}}
				>
					<motion.g
						id="Layer_1-2"
						data-name="Layer 1"
						style={{
							fill: "rgba(255, 255, 255, 0.0)",
							stroke: "rgba(255, 255, 255, 0.3)",
							strokeMiterlimit: 10,
							strokeWidth: 2,
							scaleX: 0.9,
							scaleY: 1,
						}}
					// initial={{ fill: "rgba(255, 255, 255, 0.0)"}}
					// animate={{fill: "rgba(255, 255, 255, 1.0)", transition: { delay: 1.5, duration: 2.5 }}}
					>
						<motion.path
							d="M77.11,5.34l-.02,96.11c9.17.13,18.88.77,27.62-2.49,15.48-5.79,22.02-21.52,28.4-35.45.54,17.34.19,34.77.2,52.12,0,11.76-.05,23.51-.16,35.27-4.56-12.15-9.03-25.75-18.63-34.94-10.79-10.33-23.53-9.93-37.48-9.66.2,17.91-.07,35.85-.1,53.77-.01,12.9-1.44,27.66,2,40.1,3.43,12.38,11.39,19.84,22.31,25.97-32.91,1.22-66.53.78-99.46.03,7.6-4.39,14.13-9.22,18.71-16.88,3.4-5.69,4.77-11.09,5.43-17.63,2.03-20.18.58-46.2.6-67.1v-54.98c.01-13.47,1.52-29.16-1.82-42.3C21.6,15.04,12.25,7.04,1.88.85c20.84-.61,41.78-.24,62.63-.24l108.19.02c1.62,24.02,2.64,48.15,4.82,72.12-5.92-18.5-13.19-38.65-27.3-52.61C130.64.78,102.3,5.15,77.11,5.34Z"
							variants={draw}
							custom={0.3}
						/>
					</motion.g>
				</motion.svg>

				<motion.svg
					id="Layer_2"
					data-name="Layer 2"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 147.93 166.3"
					initial="hidden"
					animate="visible"
					style={{
						height: '50%',
						position: 'relative',
						left: '-10px'
					}}
				>
					<motion.g
						id="Layer_1-2"
						data-name="Layer 1"
						style={{
							fill: "rgba(255, 255, 255, 0.0)",
							stroke: "rgba(255, 255, 255, 0.3)",
							strokeMiterlimit: 10,
							strokeWidth: 2,
							scale: 1,
						}}
					// initial={{ fill: "rgba(255, 255, 255, 0.0)"}}
					// animate={{fill: "rgba(255, 255, 255, 1.0)", transition: { delay: 1.9, duration: 2.5 }}}
					>
						<motion.path
							d="M130.06,141.89c-2.11-10.94-1.11-23.04-1.07-34.17l.18-51.88c.02-9.86.79-20.38-1.87-29.95-2.04-7.33-6.35-13.8-12.65-18.13C106.32,2.03,93.31-.25,83.28.72c-16.46.63-32.85,2.45-49.04,5.45C24.62,18.74,14,31.43,5.61,44.81,19.62,32.72,48.5,4.93,67.96,6.27c4.35.3,8.28,2.38,11.12,5.66,4.79,5.53,6.57,14.96,5.97,22.06-.85,10.06-6.51,17.83-14.06,24.17C49.15,76.49,3.62,89.76.7,122.32c-.35,3.83-.21,7.57.22,11.37,2.64,10.92,7.61,20.54,17.51,26.51,9.14,5.53,21.37,6.95,31.66,4.34,12.18-3.09,24.1-11.23,33.57-19.34l.09,19.07c20.85.02,41.78.46,62.62-.21-9.01-6.08-14.16-11.1-16.31-22.17ZM83.34,131.75c-.74,4.71-2.26,9.48-5.48,13.11-2.86,3.24-6.51,4.7-10.75,4.93-6.13.34-9.65-2.39-13.98-6.23-.07-.08-.14-.17-.21-.25-9.04-11.06-9.97-24.59-8.58-38.24,2.52-24.7,20.9-36.79,38.63-51.19l.69,1.12c.47,13.04-.13,26.13-.01,39.18.11,11.99,1.55,25.76-.31,37.57Z"
							variants={draw}
							custom={0.4}
						/>
					</motion.g>
				</motion.svg>

				<motion.svg
					id="Layer_2"
					data-name="Layer 2"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 137.14 167.19"
					initial="hidden"
					animate="visible"
					style={{
						height: '50%',
						position: 'relative',
						left: '-10px'
					}}
				>
					<motion.g
						id="Layer_1-2"
						data-name="Layer 1"
						style={{
							fill: "rgba(255, 255, 255, 0.0)",
							stroke: "rgba(255, 255, 255, 0.3)",
							strokeMiterlimit: 10,
							strokeWidth: 2,
							scale: 1,
						}}
					// initial={{ fill: "rgba(255, 255, 255, 0.0)"}}
					// animate={{fill: "rgba(255, 255, 255, 1.0)", transition: { delay: 1.9, duration: 2.5 }}}
					>
						<motion.path
							d="M135.89,109.13c-3.81,10.46-8.66,20.03-15.49,28.87-10.64,13.77-25.54,26.07-43.33,28.26-16.72,2.06-34.09-3.43-47.26-13.74C12.99,139.36,3.91,119.44,1.34,98.62c-2.97-24.09,1.74-49.6,16.97-69.01C31.41,12.9,49.71,3.39,70.62.86c7.5-1,16.12.16,23.27,2.42,18.07,5.7,29.67,18.85,38.19,35.13-17.41,8.74-34.86,17.38-52.36,25.92,3.56-13.6,5.53-27.79,2.52-41.72-1.26-5.8-3.21-12.2-8.59-15.51-2.26-1.39-5.01-2.08-7.62-1.4-4.76,1.25-8.26,5.45-10.7,9.5-11.19,18.65-11.76,55.53-6.43,76.36,3.4,13.31,10.46,26.34,22.64,33.48,12.03,7.05,24.52,6.08,37.48,2.75,10.96-4.55,18.58-10.36,26.87-18.66Z"
							variants={draw}
							custom={0.5}
						/>
					</motion.g>
				</motion.svg>

				<motion.svg
					id="Layer_2"
					data-name="Layer 2"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 104.46 217.7"
					initial="hidden"
					animate="visible"
					style={{
						height: '68%',
						position: 'relative',
						left: '-10px'
					}}
				>
					<motion.g
						id="Layer_1-2"
						data-name="Layer 1"
						style={{
							fill: "rgba(255, 255, 255, 0.0)",
							stroke: "rgba(255, 255, 255, 0.3)",
							strokeMiterlimit: 10,
							strokeWidth: 2,
							scale: 1,
						}}
					// initial={{ fill: "rgba(255, 255, 255, 0.0)"}}
					// animate={{fill: "rgba(255, 255, 255, 1.0)", transition: { delay: 1.9, duration: 2.5 }}}
					>
						<motion.path
							d="M102.76,216.21c-11.23,1.49-23.08,1.04-34.35.25-13.22-.51-29.67-3.66-39.34-13.23-5.32-5.28-7.64-12.7-8.87-19.93-2.58-15.05-1.28-31.46-1.27-46.71l.02-76.52c-6.07-.03-12.39.25-18.34-1.09.69-2.8,15.58-7.5,18.96-9.08C39.36,40.6,53.81,19.52,64.28,1.16c2.32,6.03.72,45.16.73,54.18,8.66-.03,19.53-1.2,27.7,1.72l.33.94c-6.49,3.68-20.64,2.06-28.1,2.08.23,22.89-.03,45.81-.05,68.69-.01,17.05-2.29,42.95,3.15,58.85,5.29,15.44,21.16,21.95,34.72,28.59Z"
							variants={draw}
							custom={0.6}
						/>
					</motion.g>
				</motion.svg>

				<motion.svg
					id="Layer_2"
					data-name="Layer 2"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 164.13 164.02"
					initial="hidden"
					animate="visible"
					style={{
						height: '50%',

						position: 'relative',
						left: '-10px'
					}}
				>
					<motion.g
						id="Layer_1-2"
						data-name="Layer 1"
						style={{
							fill: "rgba(255, 255, 255, 0.0)",
							stroke: "rgba(255, 255, 255, 0.3)",
							strokeMiterlimit: 10,
							strokeWidth: 2,
							scale: 1,
						}}
					// initial={{ fill: "rgba(255, 255, 255, 0.0)"}}
					// animate={{fill: "rgba(255, 255, 255, 1.0)", transition: { delay: 2, duration: 2.5 }}}
					>
						<motion.path
							d="M163.06,72.52C157.81,27.75,117.19-4.26,72.4,1.08,27.74,6.41-4.18,46.86,1.06,91.5c5.24,44.64,45.65,76.62,90.33,71.48,44.81-5.16,76.93-45.69,71.67-90.46ZM108.74,137.19c-2.56,9.78-6.32,19.2-15.38,24.5-1.82.24-3.96.18-5.76-.26-7.42-1.79-13.3-8.69-17.17-14.86-18.96-30.22-23.53-83.26-15.56-117.44,2.48-10.62,6.28-20.9,15.88-26.86,1.91-.16,4.05-.13,5.92.32,8.05,1.96,14.31,9.96,18.29,16.72,17.94,30.49,22.65,84.01,13.78,117.88Z"
							variants={draw}
							custom={0.7}
						/>
					</motion.g>
				</motion.svg>

				<motion.svg
					id="Layer_2"
					data-name="Layer 2"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 126.82 162.94"
					initial="hidden"
					animate="visible"
					style={{
						height: '50%',
						position: 'relative',
						left: '-10px'
					}}
				>
					<motion.g
						id="Layer_1-2"
						data-name="Layer 1"
						style={{
							fill: "rgba(255, 255, 255, 0.0)",
							stroke: "rgba(255, 255, 255, 0.3)",
							strokeMiterlimit: 10,
							strokeWidth: 2,
							scale: 1,
						}}
					// initial={{ fill: "rgba(255, 255, 255, 0.0)"}}
					// animate={{fill: "rgba(255, 255, 255, 1.0)", transition: { delay: 2.2, duration: 2.5 }}}
					>
						<motion.path
							d="M87.48,63.05c.35-14.31.38-34.07-6.92-46.79-2.16-3.76-7.33-10.49-11.76-11.6-1.4-.36-1.73-.15-2.94.59-1.86,4.87-.59,60.66-.57,70.48.08,17.48-2.07,47.71.99,63.56,2.07,10.75,7.56,16.6,16.3,22.51-26.79,1.06-54.08.62-80.89,0,4.69-2.92,9.06-5.97,12.2-10.61,2.83-4.17,3.91-8.27,4.57-13.2,2.37-17.79.99-37.1.99-55.07.01-18.48,1.86-44.57-1.6-62.08C15.97,11.38,9.71,6.21,2.08,1.1c15.64-.83,31.57-.25,47.25-.27,13.17-.02,27.47-1.14,40.46.84,6.72,1.03,13.31,3.09,18.94,6.99,11.4,7.9,15.19,20.09,17.54,33.09-12.87,7.21-25.8,14.31-38.79,21.3Z"
							variants={draw}
							custom={0.8}
						/>
					</motion.g>
				</motion.svg>

				<motion.svg
					id="Layer_2"
					data-name="Layer 2"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 141.3 223.97"
					initial="hidden"
					animate="visible"
					style={{
						height: '68%',
						left: '-10px',
						// marginTop: '20px',
						position: 'relative',
						top: '34px'
					}}
				>
					<motion.g
						id="Layer_1-2"
						data-name="Layer 1"
						style={{
							fill: "rgba(255, 255, 255, 0.0)",
							stroke: "rgba(255, 255, 255, 0.3)",
							strokeMiterlimit: 10,
							strokeWidth: 2,
							scale: 1,
						}}
					// initial={{ fill: "rgba(255, 255, 255, 0.0)"}}
					// animate={{fill: "rgba(255, 255, 255, 1.0)", transition: { delay: 2.2, duration: 2.5 }}}
					>
						<motion.path
							d="M140.8.73v.71c-10.2,9.3-17.04,32.68-22.13,45.73l-34.47,88.44c-7.46,19.14-14.34,39.16-23.91,57.36-4.02,7.65-8.95,15.81-15.63,21.39-10.48,8.77-23.03,9.91-36.15,8.71-.89-18.61-2.45-37.18-3.11-55.8,4.47,4.2,8.81,7.89,14.42,10.56,9.44,4.5,21.05,5.45,30.96,1.87,10.54-3.81,16.1-11.96,20.64-21.67-12.11-27.83-23.45-56.05-35.15-84.06C27.42,52.81,15.47,17.38,1.08.85c25.83-.61,51.9-.33,77.74.12-5.77,2.71-12.05,5.39-14.71,11.63-1.64,3.86-.87,8.77.03,12.74,2.27,10.06,6.82,19.95,10.53,29.56l18.52,47.32c5.66-16.4,12.22-32.59,18.34-48.82,3.25-8.61,7.08-17.34,9.03-26.35.94-4.35,1.62-9.62.02-13.89-2.52-6.69-9.01-9.49-15.05-12.26l35.27-.17Z"
							variants={draw}
							custom={0.9}
							onAnimationStart={() => {
								setTimeout(() => {	
									setVisible(true)
								}, 3500)
							}
							}				
						/>
					</motion.g>
				</motion.svg>
			</div>
		</div>
	)
}
