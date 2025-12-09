import { create} from 'zustand'


type GalleryState = {
	cameraZ: number
	setCameraZ: (cameraZ: number) => void
	wheelOpened: boolean
	setWheelOpened: (opened: boolean) => void

}

export const useGalleryStore = create<GalleryState>((set) => ({
	cameraZ: 4,
	setCameraZ: (cameraZ) => set({ cameraZ }),
	wheelOpened: false,
	setWheelOpened: (opened) => set({ wheelOpened: opened }),

}))