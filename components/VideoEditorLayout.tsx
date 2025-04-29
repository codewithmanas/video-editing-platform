"use client";

import React from "react";
import Navbar from "./Navbar";
import MainEditor from "./MainEditor";
import { ReduxProvider } from "@/redux/provider";

const VideoEditorLayout = () => {
  return (
    <ReduxProvider>
      <div className="h-screen flex flex-col bg-background">
        <Navbar />
        <MainEditor />
      </div>
    </ReduxProvider>
  );
};

export default VideoEditorLayout;
