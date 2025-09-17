import SectionTitle from "./SectionTitle"
import Tracker from "./Tracker"

export default function ScreenLayout() {
  return (
	<div className=" fixed inset-x-0 mx-auto flex flex-col h-screen w-screen justify-center items-center top-0 z-50 pointer-events-none" >
	  <Tracker />
	  <SectionTitle />
	</div>
  )
}
