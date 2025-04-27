"use client";

import React from "react";
import VideoUpload from "./VideoUpload";
import { useSelector } from "react-redux";
import { VideoState } from "@/redux/slices/videoSlice";
import VideoPreview from "./VideoPreview";
import Navbar from "./Navbar";

const VideoEditorLayout = () => {
  const videoSource = useSelector(
    (state: { video: VideoState }) => state.video.source
  );


  return (
    <div className="overflow-hidden h-full flex flex-col">
        <Navbar />

          <div className="h-full flex min-h-[70%] w-full">
                <div className="h-full flex flex-col">
                  {videoSource ? <VideoPreview /> : <VideoUpload />}
                </div>
          </div>


          <div className="h-full min-h-[30%] border-t border-2 border-border mt-6">timeline</div>


    </div>
  );
};

export default VideoEditorLayout;
