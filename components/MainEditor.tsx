"use client";

import React from "react";
import VideoPreview from "./VideoPreview";
import VideoUpload from "./VideoUpload";
import TimelineView from "./TimelineView";
import EditingOptions from "./EditingOptions";

const MainEditor = () => {

  return (
    <div className="flex-1 overflow-hidden">
      <div className="flex justify-between items-start">
        <div className="flex gap-2 justify-between items-start">
            <VideoUpload />
            <VideoPreview />
        </div>
        <EditingOptions />

      </div>
        <TimelineView />
    </div>
  );
};

export default MainEditor;
