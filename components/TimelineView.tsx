"use client";

import React, { useRef, useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { ZoomIn, ZoomOut } from "lucide-react";
import { Slider } from "./ui/slider";
import {
    moveClip,
  setPlayHeadPosition,
  setSelectedClip,
  setZoom,
  TimelineState,
  updateClip,
} from "@/redux/slices/timelineSlice";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentTime, VideoState } from "@/redux/slices/videoSlice";
import TimelineClip from "./TimelineClip";

const TimelineView = () => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [draggingClipId, setDraggingClipId] = useState<string | null>(null);
  const dispatch = useDispatch();

  const { clips, zoom, playHeadPosition, selectedClipId } = useSelector(
    (state: { timeline: TimelineState }) => state.timeline
  );

  const duration = useSelector(
    (state: { video: VideoState }) => state.video.duration
  );

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return;

    const rect = timelineRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;

    const newTime = percentage * duration;
    dispatch(setCurrentTime(newTime));
    dispatch(setPlayHeadPosition(newTime));
  };

  const handleZoomChange = (values: number[]) => {
    dispatch(setZoom(values[0]));
  };

  const handleDragStart = (id: string) => {
    setDraggingClipId(id);
    dispatch(setSelectedClip(id));
  };

  const handleDragEnd = () => {
    setDraggingClipId(null);
  };

  const handleClipMove = (id: string, newStartTime: number) => {
    dispatch(moveClip({ id, newStartTime }));
  };

  const handleClipResize = (id: string, newStart: number, newEnd: number) => {
    dispatch(updateClip({
      id,
      changes: {
        startTime: newStart,
        endTime: newEnd
      }
    }));
  };

  // Calculate timeline width based on duration and zoom
  const timelineWidth = duration * zoom * 100;

  return (
    <div className="h-full flex flex-col bg-card border-t border-border">
      <div className="flex items-center justify-between p-2 border-b border-border">
        <h3 className="text-sm font-medium">Timeline</h3>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => dispatch(setZoom(Math.max(0.5, zoom - 0.2)))}
          >
            <ZoomOut size={14} />
          </Button>

          <Slider
            value={[zoom]}
            min={0.5}
            max={4}
            step={0.1}
            onValueChange={handleZoomChange}
            className="w-24"
          />

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => dispatch(setZoom(Math.min(4, zoom + 0.2)))}
          >
            <ZoomIn size={14} />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div
          className="relative min-h-full"
          style={{ width: `${timelineWidth}px` }}
        >
          {/* <TimelineRuler duration={duration} zoom={zoom} /> */}

          <div
            ref={timelineRef}
            className="relative h-full"
            onClick={handleTimelineClick}
          >
            {/* Playhead position indicator */}
            <div
              className="absolute h-full w-0.5 bg-primary z-20 pointer-events-none"
              style={{ left: `${(playHeadPosition / duration) * 100}%` }}
            >
              <div className="w-3 h-3 bg-primary rounded-full -translate-x-1.5 -translate-y-1.5" />
            </div>

            {/* Timeline tracks */}
            <div className="relative pt-12">
              {/* Video track */}
              <div className="h-16 mb-2 bg-card/50 rounded-md border border-border/50 relative">
                <div className="absolute left-2 top-1 text-xs font-medium text-muted-foreground">
                  Video
                </div>

                {clips
                  .filter((clip) => clip.type === "video")
                  .map((clip) => (
                    <TimelineClip
                      key={clip.id}
                      clip={clip}
                      duration={duration}
                      isSelected={selectedClipId === clip.id}
                      isDragging={draggingClipId === clip.id}
                      onDragStart={() => handleDragStart(clip.id)}
                      onDragEnd={handleDragEnd}
                        onMove={(newStartTime) =>
                          handleClipMove(clip.id, newStartTime)
                        }
                        onResize={(newStart, newEnd) =>
                          handleClipResize(clip.id, newStart, newEnd)
                        }
                      onClick={() => dispatch(setSelectedClip(clip.id))}
                    />
                  ))}
              </div>

              {/* Text track */}
              <div className="h-16 mb-2 bg-card/50 rounded-md border border-border/50 relative">
                <div className="absolute left-2 top-1 text-xs font-medium text-muted-foreground">
                  Text
                </div>

                {/* {clips
                  .filter((clip) => clip.type === "text")
                  .map((clip) => (
                    <TimelineClip
                      key={clip.id}
                      clip={clip}
                      duration={duration}
                      isSelected={selectedClipId === clip.id}
                      isDragging={draggingClipId === clip.id}
                      onDragStart={() => handleDragStart(clip.id)}
                      onDragEnd={handleDragEnd}
                      onMove={(newStartTime) =>
                        handleClipMove(clip.id, newStartTime)
                      }
                      onResize={(newStart, newEnd) =>
                        handleClipResize(clip.id, newStart, newEnd)
                      }
                      onClick={() => dispatch(setSelectedClip(clip.id))}
                    />
                  ))} */}
              </div>

              {/* Image track */}
              <div className="h-16 mb-2 bg-card/50 rounded-md border border-border/50 relative">
                <div className="absolute left-2 top-1 text-xs font-medium text-muted-foreground">
                  Image
                </div>

                {/* {clips
                  .filter((clip) => clip.type === "image")
                  .map((clip) => (
                    <TimelineClip
                      key={clip.id}
                      clip={clip}
                      duration={duration}
                      isSelected={selectedClipId === clip.id}
                      isDragging={draggingClipId === clip.id}
                      onDragStart={() => handleDragStart(clip.id)}
                      onDragEnd={handleDragEnd}
                      onMove={(newStartTime) =>
                        handleClipMove(clip.id, newStartTime)
                      }
                      onResize={(newStart, newEnd) =>
                        handleClipResize(clip.id, newStart, newEnd)
                      }
                      onClick={() => dispatch(setSelectedClip(clip.id))}
                    />
                  ))} */}
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default TimelineView;
