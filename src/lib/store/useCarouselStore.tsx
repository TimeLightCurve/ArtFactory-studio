import { create } from 'zustand'


type CarouselState = {
	hovered: boolean
	setHovered: (hovered: boolean) => void

}

export const useCarouselStore = create<CarouselState>((set) => ({
	hovered: false,
	setHovered: (hovered) => set({ hovered }),

}))