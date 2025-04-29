"use client";

import { useEffect, useRef } from "react";
import {
  Play,
  Pause,
  VolumeX,
  Volume2,
  Maximize2,
  RefreshCw,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentTime,
  setMuted,
  setPlayingState,
  setVolume,
  VideoState,
} from "@/redux/slices/videoSlice";
import { setPlayHeadPosition } from "@/redux/slices/timelineSlice";

export default function VideoPreview() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const dispatch = useDispatch();

  const { source, isPlaying, currentTime, volume, muted, duration } =
    useSelector((state: { video: VideoState }) => state.video);

  // Handle playback state changes
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Handle volume and mute changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
      videoRef.current.muted = muted;
    }
  }, [volume, muted]);

  // Handle seeking to specific time
  useEffect(() => {
    if (
      videoRef.current &&
      Math.abs(videoRef.current.currentTime - currentTime) > 0.5
    ) {
      videoRef.current.currentTime = currentTime;
    }
  }, [currentTime]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime;
      dispatch(setCurrentTime(time));
      dispatch(setPlayHeadPosition(time));
    }
  };

  const handleVideoEnded = () => {
    dispatch(setPlayingState(false));
  };

  const handleSeek = (value: number[]) => {
    const newTime = value[0];
    dispatch(setCurrentTime(newTime));
  };

  const togglePlay = () => {
    dispatch(setPlayingState(!isPlaying));
  };

  const toggleMute = () => {
    dispatch(setMuted(!muted));
  };

  const handleVolumeChange = (value: number[]) => {
    dispatch(setVolume(value[0]));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div className="w-[50%] flex-1 flex flex-col bg-black/90">
      <div className="relative flex justify-center items-center h-80">
        {source && (
          <>
            <video
              ref={videoRef}
              src={source}
              className="max-h-full max-w-full"
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleVideoEnded}
            />
          </>
        )}
      </div>

      <div className="w-full p-3 bg-card border-t border-border">
        <div className="flex flex-col space-y-2">
          <Slider
            value={[currentTime]}
            min={0}
            max={duration || 100}
            step={0.01}
            onValueChange={handleSeek}
            className="cursor-pointer"
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={togglePlay}
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </Button>

              <div className="flex items-center space-x-2">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={toggleMute}
                >
                  {muted || volume === 0 ? (
                    <VolumeX size={16} />
                  ) : (
                    <Volume2 size={16} />
                  )}
                </Button>

                <Slider
                  value={[muted ? 0 : volume]}
                  min={0}
                  max={1}
                  step={0.01}
                  onValueChange={handleVolumeChange}
                  className="w-20"
                />
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              {formatTime(currentTime)} / {formatTime(duration || 0)}
            </div>

            <div className="flex items-center space-x-2">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={() => dispatch(setCurrentTime(0))}
              >
                <RefreshCw size={16} />
              </Button>

              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={toggleFullscreen}
              >
                <Maximize2 size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
