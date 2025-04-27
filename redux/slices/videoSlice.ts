import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface VideoState {
  source: string | null;
  thumbnail: string | null;
  duration: number;
  title: string;
  isPlaying: boolean;
  currentTime: number;
  volume: number;
  muted: boolean;
  uploadProgress: number;
  uploading: boolean;
}

const initialState: VideoState = {
  source: null,
  thumbnail: null,
  duration: 0,
  title: "",
  isPlaying: false,
  currentTime: 0,
  volume: 1,
  muted: false,
  uploadProgress: 0,
  uploading: false,
};

export const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    setVideoSource: (state, action: PayloadAction<string>) => {
      state.source = action.payload;
    },
    setVideoThumbnail: (state, action: PayloadAction<string>) => {
      state.thumbnail = action.payload;
    },
    setVideoTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    setVideoDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
    },
    setPlayingState: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    setCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload;
    },
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = action.payload;
    },
    setMuted: (state, action: PayloadAction<boolean>) => {
      state.muted = action.payload;
    },
    setVideoUploadProgress: (state, action: PayloadAction<number>) => {
      state.uploadProgress = action.payload;
    },
    setVideoUploading: (state, action: PayloadAction<boolean>) => {
      state.uploading = action.payload;
    },
    resetVideo: () => {
      return initialState;
    },
  },
});

export const {
  setVideoSource,
  setVideoThumbnail,
  setVideoTitle,
  setVideoDuration,
  setPlayingState,
  setCurrentTime,
  setVolume,
  setMuted,
  setVideoUploadProgress,
  setVideoUploading,
  resetVideo,
} = videoSlice.actions;

export default videoSlice.reducer;
