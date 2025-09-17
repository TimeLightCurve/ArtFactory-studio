import { create } from "zustand"

type IntroState = {
	visible: boolean
	setVisible: (visible: boolean) => void
	introCompleted: boolean
	setIntroCompleted: (completed: boolean) => void
	videoClicked: { clicked: boolean, videoIndex: number }
	setVideoClicked: (clicked: { clicked: boolean, videoIndex: number }) => void
	logoAnimationDone?: boolean
	setLogoAnimationDone?: (done: boolean) => void

}
export const useIntroStore = create<IntroState>((set) => ({
	visible: false,
	setVisible: (visible) => set({ visible }),
	introCompleted: false,
	setIntroCompleted: (completed) => set({ introCompleted: completed }),
	videoClicked: { clicked: false, videoIndex: 0 },
	setVideoClicked: (clicked) => set({ videoClicked: clicked }),
	logoAnimationDone: false,
	setLogoAnimationDone: (done) => set({ logoAnimationDone: done}),
	
}))