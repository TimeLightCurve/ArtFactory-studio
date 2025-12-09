
export default function ToolWheel() {
  return (
	<div className="fixed flex w-[55%] h-[3.5rem] justify-center items-center rounded-full z-30 bottom-10 bg-black/90 backdrop-blur-lg overflow-hidden">
		<div className="relative flex w-full h-full justify-center items-center ">
			<div className="absolute flex w-full h-full justify-between items-center ">
				{
					new Array(64).fill(undefined) .map((_, index) => (
						<div 
						key={index}
						className=" flex flex-col w-2 shrink-0 h-full justify-between "	
						>
							<div className={`flex w-0.5  ${index % 5 === 0 ? 'h-3.5 bg-white/70 ' : 'h-2 bg-white/40'}`}/>
							<div className={`flex w-0.5  ${index % 5 === 0 ? 'h-3.5 bg-white/70 ' : 'h-2 bg-white/40'}`}/>
						</div>
					))
				}
			</div>
		<div className="  w-0.5 h-full bg-red-700">

		</div>
		  </div>
	</div>
  )
}
