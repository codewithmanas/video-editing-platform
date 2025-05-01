"use client";

import React from "react";
import VideoPreview from "./VideoPreview";
import VideoUpload from "./VideoUpload";
import TimelineView from "./TimelineView";
import EditingOptions from "./EditingOptions";
import { useSelector } from "react-redux";
import { ExportState } from "@/redux/slices/exportSlice";
import ExportDialog from "./ExportDialog";

const MainEditor = () => {
  const isExporting = useSelector((state: { export: ExportState }) => state.export.isExporting);

  return (
    <div className="flex-1 overflow-hidden">
      <div className="flex justify-between items-start gap-8">
        <div className="flex-1 flex gap-4 justify-between items-start">
            <VideoUpload />
            <VideoPreview />
        </div>
        <EditingOptions />

      </div>
        <TimelineView />

        {isExporting && <ExportDialog />}
    </div>
  );
};

export default MainEditor;
