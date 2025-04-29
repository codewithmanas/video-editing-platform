"use client";

import { cn } from "@/lib/utils";
import { FileVideo, Upload, X } from "lucide-react";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import {
  setVideoDuration,
  setVideoSource,
  setVideoTitle,
  setVideoUploading,
  setVideoUploadProgress,
} from "@/redux/slices/videoSlice";
import { addClip } from "@/redux/slices/timelineSlice";

const VideoUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const dispatch = useDispatch();

  const uploadFileToDB = async (file: File) => {
    setUploading(true);
    dispatch(setVideoUploading(true));

    // Creating an URL for the video
    const videoUrl = URL.createObjectURL(file);

    // Creating a video element to get video duration
    const video = document.createElement("video");
    video.preload = "metadata";

    video.onloadedmetadata = () => {
      const duration = video.duration;

      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        dispatch(setVideoUploadProgress(progress));

        if (progress >= 100) {
          clearInterval(interval);
          setUploading(false);
          dispatch(setVideoUploading(false));

          // Set video info in state
          dispatch(setVideoSource(videoUrl));
          dispatch(setVideoTitle(file.name));
          dispatch(setVideoDuration(duration));


          // Add the video as a clip to the timeline
          dispatch(addClip({
            startTime: 0,
            endTime: duration,
            sourceStartTime: 0,
            sourceEndTime: duration,
            type: 'video',
            source: videoUrl
          }));                   

          toast("Upload complete");
        }
      }, 100);
    };

    video.src = videoUrl;
  };

  const cancelUpload = () => {
    setUploading(false);
    setUploadFile(null);
    setUploadProgress(0);
  };

  const handleFileUpload = useCallback((acceptedFiles: File[]) => {
    const videoFile = acceptedFiles[0];

    console.log("file: ", videoFile);

    if (!videoFile) return;

    // Check if the file is a video
    if (!videoFile.type.startsWith("video/")) {
      toast("Invalid file type");
      return;
    }

    setUploadFile(videoFile);

    setUploading(true);

    uploadFileToDB(videoFile);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFileUpload,
    accept: {
      "video/*": [],
    },
    maxFiles: 1,
  });

  return (
    <div className="flex flex-col items-center justify-center p-6 ">
      <div
        {...getRootProps()}
        className={cn(
          "w-full max-w-xl h-64 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center p-6 transition-colors cursor-pointer",
          isDragActive
            ? "border-primary bg-primary/5"
            : "hover:border-primary/50 hover:bg-primary/5"
        )}
      >
        <input {...getInputProps()} />
        <div className="w-[36rem]">
          {!uploading ? (
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Upload size={24} className="text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">
                Drag and drop your video
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Supports MP4, WebM, and MOV formats
              </p>
              <Button variant="outline" size="sm">
                Browse files
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center w-[36rem]">
              <div className="flex items-center mb-4">
                <FileVideo size={28} className="text-primary mr-3" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-medium truncate">
                      {uploadFile?.name}
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        cancelUpload();
                      }}
                    >
                      <X size={14} />
                    </Button>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                {uploadProgress < 100
                  ? `Uploading... ${uploadProgress}%`
                  : "Processing video..."}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        <p>Maximum file size: 500MB</p>
      </div>
    </div>
  );
};

export default VideoUpload;
