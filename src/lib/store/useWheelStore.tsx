import { create } from "zustand";

interface WheelStore {
  sectionIndex: number;
  setSectionIndex: (index: number) => void;
  videoClicked: boolean
  setVideoClicked: (videoClicked: boolean) => void
  videoTitle: string
  setVideoTitle: (title: string) => void
  expanded: boolean
  setExpanded: (expanded: boolean) => void
  titleAnimationDone: boolean
  setTitleAnimationDone: (done: boolean) => void
  pageAnimationStart: boolean
  setPageAnimationStart: (start: boolean) => void
}

export const useWheelStore = create<WheelStore>((set) => ({
  sectionIndex: 0,
  setSectionIndex: (index: number) => set({ sectionIndex: index }),
  videoClicked: false,
  setVideoClicked: (videoClicked) => set({ videoClicked }),
  videoTitle: '',
  setVideoTitle: (title) => set({ videoTitle: title }),
  expanded: false,
  setExpanded: (expanded) => set({expanded}),
  titleAnimationDone: false,
  setTitleAnimationDone: (done) => set({titleAnimationDone: done}),
  pageAnimationStart: false,
  setPageAnimationStart: (start) => set({pageAnimationStart: start}),
}));