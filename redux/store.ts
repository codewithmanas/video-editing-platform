import { configureStore } from "@reduxjs/toolkit";
import videoReducer from "./slices/videoSlice";
import timelineReducer from "./slices/timelineSlice";
import textReducer from "./slices/textSlice";
import exportReducer from "./slices/exportSlice";

export const store = configureStore({
  reducer: {
    video: videoReducer,
    timeline: timelineReducer,
    text: textReducer,
    export: exportReducer,
  },
});
