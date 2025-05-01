import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

export interface TextOverlay {
  id: string;
  content: string;
  startTime: number;
  endTime: number;
  position: { x: number; y: number };
  type: "title" | "caption";
}

export interface TextState {
  overlays: TextOverlay[];
  selectedOverlayId: string | null;
}

const initialState: TextState = {
  overlays: [],
  selectedOverlayId: null,
};

export const textSlice = createSlice({
  name: "text",
  initialState,
  reducers: {
    addTextOverlay: (state, action: PayloadAction<Omit<TextOverlay, "id">>) => {
      const newOverlay = {
        ...action.payload,
        id: uuidv4(),
      };
      state.overlays.push(newOverlay);
    },
    updateTextOverlay: (
      state,
      action: PayloadAction<{ id: string; changes: Partial<TextOverlay> }>
    ) => {
      const { id, changes } = action.payload;
      const overlayIndex = state.overlays.findIndex(
        (overlay) => overlay.id === id
      );
      if (overlayIndex !== -1) {
        state.overlays[overlayIndex] = {
          ...state.overlays[overlayIndex],
          ...changes,
        };
      }
    },
    removeTextOverlay: (state, action: PayloadAction<string>) => {
      state.overlays = state.overlays.filter((overlay) => overlay.id !== action.payload);
      if (state.selectedOverlayId === action.payload) {
        state.selectedOverlayId = null;
      }
    },
    setSelectedTextOverlay: (state, action: PayloadAction<string | null>) => {
      state.selectedOverlayId = action.payload;
    },
    moveTextOverlay: (
      state,
      action: PayloadAction<{ id: string; position: { x: number; y: number } }>
    ) => {
      const { id, position } = action.payload;
      const overlayIndex = state.overlays.findIndex(
        (overlay) => overlay.id === id
      );
      if (overlayIndex !== -1) {
        state.overlays[overlayIndex].position = position;
      }
    },
    resetText: () => {
      return initialState;
    },
  },
});

export const {
  addTextOverlay,
  updateTextOverlay,
  removeTextOverlay,
  setSelectedTextOverlay,
  moveTextOverlay,
  resetText,
} = textSlice.actions;

export default textSlice.reducer;
