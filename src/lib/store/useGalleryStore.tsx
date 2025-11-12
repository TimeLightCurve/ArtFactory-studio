import { create} from 'zustand'


type GalleryState = {
	cameraZ: number
	setCameraZ: (cameraZ: number) => void

}

export const useGalleryStore = create<GalleryState>((set) => ({
	cameraZ: 6,
	setCameraZ: (cameraZ) => set({ cameraZ }),

}))