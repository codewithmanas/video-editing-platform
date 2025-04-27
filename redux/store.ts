import { configureStore } from "@reduxjs/toolkit";
import videoReducer from "./slices/videoSlice";

export const store = configureStore({
  reducer: {
    video: videoReducer,
  },
});
