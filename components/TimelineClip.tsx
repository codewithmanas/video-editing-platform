"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import { TimelineClip as TimelineClipType } from "@/redux/slices/timelineSlice";

interface TimelineClipProps {
  clip: TimelineClipType;
  duration: number;
  isSelected: boolean;
  isDragging: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
  onMove: (newStartTime: number) => void;
  onResize: (newStart: number, newEnd: number) => void;
  onClick: () => void;
}

export default function TimelineClip({
  clip,
  duration,
  isSelected,
  isDragging,
  onDragStart,
  onDragEnd,
  onMove,
  onResize,
  onClick,
}: TimelineClipProps) {
  const clipRef = useRef<HTMLDivElement>(null);
  const startResizeRef = useRef<HTMLDivElement>(null);
  const endResizeRef = useRef<HTMLDivElement>(null);

  // Track drag state
  const dragStartX = useRef<number>(0);
  const initialLeft = useRef<number>(0);
  const resizing = useRef<"start" | "end" | null>(null);
  const initialStart = useRef<number>(0);
  const initialEnd = useRef<number>(0);
  const initialWidth = useRef<number>(0);

  // Calculate clip positioning
  const clipStart = (clip.startTime / duration) * 100;
  const clipEnd = (clip.endTime / duration) * 100;
  const clipWidth = clipEnd - clipStart;

  // Handlers for dragging the clip
  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (
      startResizeRef.current?.contains(e.target as Node) ||
      endResizeRef.current?.contains(e.target as Node)
    ) {
      return;
    }

    dragStartX.current = e.clientX;
    initialLeft.current = clipStart;

    onDragStart();

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!clipRef.current) return;

    const deltaX = e.clientX - dragStartX.current;
    const parentWidth = clipRef.current.parentElement?.clientWidth || 1;
    const deltaPercentage = (deltaX / parentWidth) * 100;

    let newStart = initialLeft.current + deltaPercentage;
    // const clipDuration = clip.endTime - clip.startTime;

    // Ensure the clip stays within the timeline bounds
    newStart = Math.max(0, newStart);
    if (newStart + clipWidth > 100) {
      newStart = 100 - clipWidth;
    }

    // Convert percentage back to time
    const newStartTime = (newStart / 100) * duration;

    onMove(newStartTime);
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    onDragEnd();
  };

  // Handlers for resizing the clip
  const handleResizeStart =
    (type: "start" | "end") => (e: React.MouseEvent) => {
      e.stopPropagation();

      resizing.current = type;
      dragStartX.current = e.clientX;
      initialStart.current = clip.startTime;
      initialEnd.current = clip.endTime;
      initialWidth.current = clipWidth;

      document.addEventListener("mousemove", handleResizeMove);
      document.addEventListener("mouseup", handleResizeEnd);
    };

  const handleResizeMove = (e: MouseEvent) => {
    if (!clipRef.current || !resizing.current) return;

    const deltaX = e.clientX - dragStartX.current;
    const parentWidth = clipRef.current.parentElement?.clientWidth || 1;
    const deltaTime = (deltaX / parentWidth) * duration;

    if (resizing.current === "start") {
      const newStart = Math.max(0, initialStart.current + deltaTime);

      // Ensure start doesn't go past end - 0.5 seconds
      const minGap = 0.5;
      if (newStart < initialEnd.current - minGap) {
        onResize(newStart, initialEnd.current);
      }
    } else {
      const newEnd = Math.min(duration, initialEnd.current + deltaTime);

      // Ensure end doesn't go before start + 0.5 seconds
      const minGap = 0.5;
      if (newEnd > initialStart.current + minGap) {
        onResize(initialStart.current, newEnd);
      }
    }
  };

  const handleResizeEnd = () => {
    document.removeEventListener("mousemove", handleResizeMove);
    document.removeEventListener("mouseup", handleResizeEnd);
    resizing.current = null;
  };

  // Determine colors based on clip type
  let clipColor = "bg-blue-800";
  let clipBorder = "border-blue-600";
  let clipSelectedBorder = "border-blue-400";

  if (clip.type === "text") {
    clipColor = "bg-indigo-800";
    clipBorder = "border-indigo-600";
    clipSelectedBorder = "border-indigo-400";
  } else if (clip.type === "image") {
    clipColor = "bg-purple-800";
    clipBorder = "border-purple-600";
    clipSelectedBorder = "border-purple-400";
  }

  return (
    <div
      ref={clipRef}
      className={cn(
        "absolute top-4 h-10 rounded border-2 cursor-move",
        clipColor,
        clipBorder,
        isSelected && clipSelectedBorder,
        isDragging && "opacity-80"
      )}
      style={{
        left: `${clipStart}%`,
        width: `${clipWidth}%`,
      }}
      onMouseDown={handleMouseDown}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {/* Clip content */}
      <div className="truncate text-xs p-1">{clip.content || clip.type}</div>

      {/* Resize handles */}
      <div
        ref={startResizeRef}
        className="absolute left-0 top-0 w-1.5 h-full cursor-ew-resize opacity-0 hover:opacity-100 bg-primary"
        onMouseDown={handleResizeStart("start")}
      />

      <div
        ref={endResizeRef}
        className="absolute right-0 top-0 w-1.5 h-full cursor-ew-resize opacity-0 hover:opacity-100 bg-primary"
        onMouseDown={handleResizeStart("end")}
      />
    </div>
  );
}
