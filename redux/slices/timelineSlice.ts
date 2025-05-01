import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

export interface TimelineClip {
  id: string;
  startTime: number;
  endTime: number;
  sourceStartTime: number;
  sourceEndTime: number;
  type: "video" | "image" | "text";
  source?: string;
  content?: string;
}

export interface TimelineState {
  clips: TimelineClip[];
  selectedClipId: string | null;
  zoom: number;
  playHeadPosition: number;
}

const initialState: TimelineState = {
  clips: [],
  selectedClipId: null,
  zoom: 1,
  playHeadPosition: 0,
};

export const timelineSlice = createSlice({
  name: "timeline",
  initialState,
  reducers: {
    addClip: (state, action: PayloadAction<Omit<TimelineClip, "id">>) => {
      const newClip = {
        ...action.payload,
        id: uuidv4(),
      };
      state.clips.push(newClip);
    },
    updateClip: (
      state,
      action: PayloadAction<{ id: string; changes: Partial<TimelineClip> }>
    ) => {
      const { id, changes } = action.payload;
      const clipIndex = state.clips.findIndex((clip) => clip.id === id);
      if (clipIndex !== -1) {
        state.clips[clipIndex] = { ...state.clips[clipIndex], ...changes };
      }
    },
    removeClip: (state, action: PayloadAction<string>) => {
      state.clips = state.clips.filter((clip) => clip.id !== action.payload);
      if (state.selectedClipId === action.payload) {
        state.selectedClipId = null;
      }
    },
    setSelectedClip: (state, action: PayloadAction<string | null>) => {
      state.selectedClipId = action.payload;
    },
    setZoom: (state, action: PayloadAction<number>) => {
      state.zoom = action.payload;
    },
    setPlayHeadPosition: (state, action: PayloadAction<number>) => {
      state.playHeadPosition = action.payload;
    },
    moveClip: (
      state,
      action: PayloadAction<{ id: string; newStartTime: number }>
    ) => {
      const { id, newStartTime } = action.payload;
      const clipIndex = state.clips.findIndex((clip) => clip.id === id);

      if (clipIndex !== -1) {
        const clip = state.clips[clipIndex];
        const duration = clip.endTime - clip.startTime;

        // Update the clip with new timing
        state.clips[clipIndex] = {
          ...clip,
          startTime: newStartTime,
          endTime: newStartTime + duration,
        };
      }
    },
    reorderClips: (state, action: PayloadAction<TimelineClip[]>) => {
      state.clips = action.payload;
    },
    resetTimeline: () => {
      return initialState;
    },
  },
});

export const {
  addClip,
  updateClip,
  removeClip,
  setSelectedClip,
  setZoom,
  setPlayHeadPosition,
  moveClip,
  reorderClips,
  resetTimeline,
} = timelineSlice.actions;

export default timelineSlice.reducer;
