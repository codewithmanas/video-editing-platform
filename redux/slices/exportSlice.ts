import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ExportState {
  isExporting: boolean;
  progress: number;
  exportedUrl: string | null;
  format: "mp4" | "webm" | "mov";
  quality: "low" | "medium" | "high";
  resolution: "720p" | "1080p" | "4k";
}

const initialState: ExportState = {
  isExporting: false,
  progress: 0,
  exportedUrl: null,
  format: "mp4",
  quality: "high",
  resolution: "1080p",
};

export const exportSlice = createSlice({
  name: "export",
  initialState,
  reducers: {
    startExport: (state) => {
      state.isExporting = true;
      state.progress = 0;
      state.exportedUrl = null;
    },
    updateExportProgress: (state, action: PayloadAction<number>) => {
      state.progress = action.payload;
    },
    completeExport: (state, action: PayloadAction<string>) => {
      state.isExporting = false;
      state.progress = 100;
      state.exportedUrl = action.payload;
    },
    cancelExport: (state) => {
      state.isExporting = false;
      state.progress = 0;
    },
    setExportFormat: (state, action: PayloadAction<"mp4" | "webm" | "mov">) => {
      state.format = action.payload;
    },
    setExportQuality: (
      state,
      action: PayloadAction<"low" | "medium" | "high">
    ) => {
      state.quality = action.payload;
    },
    setExportResolution: (
      state,
      action: PayloadAction<"720p" | "1080p" | "4k">
    ) => {
      state.resolution = action.payload;
    },
    resetExport: () => {
      return initialState;
    },
  },
});

export const {
  startExport,
  updateExportProgress,
  completeExport,
  cancelExport,
  setExportFormat,
  setExportQuality,
  setExportResolution,
  resetExport,
} = exportSlice.actions;

export default exportSlice.reducer;
