import { configureStore } from "@reduxjs/toolkit";
import videoReducer from "./slices/videoSlice";
import timelineReducer from "./slices/timelineSlice";
import textReducer from "./slices/textSlice";

export const store = configureStore({
  reducer: {
    video: videoReducer,
    timeline: timelineReducer,
    text: textReducer
  },
});
