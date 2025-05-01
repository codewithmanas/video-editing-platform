"use client";

interface TimelineRulerProps {
  duration: number;
  zoom: number;
}

export default function TimelineRuler({ duration, zoom }: TimelineRulerProps) {
  const tickMarks = [];
  const timeLabels = [];

  // Calculate appropriate intervals based on zoom level and duration
  let interval = 1; // 1 second

  if (duration > 60 || zoom < 1) {
    interval = 5;
  }

  if (duration > 300 || zoom < 0.5) {
    interval = 15;
  }

  if (duration > 600) {
    interval = 30;
  }

  if (duration > 1800) {
    interval = 60;
  }

  // Generate tick marks and labels
  for (let i = 0; i <= duration; i += interval) {
    const position = (i / duration) * 100;

    // Create tick mark
    tickMarks.push(
      <div
        key={`tick-${i}`}
        className="absolute h-3 w-px bg-border"
        style={{ left: `${position}%` }}
      />
    );

    // Create time label
    const minutes = Math.floor(i / 60);
    const seconds = i % 60;

    timeLabels.push(
      <div
        key={`label-${i}`}
        className="absolute text-xs text-muted-foreground"
        style={{ left: `${position}%`, transform: "translateX(-50%)" }}
      >
        {`${minutes}:${seconds.toString().padStart(2, "0")}`}
      </div>
    );
  }

  return (
    <div className="absolute top-0 left-0 w-full h-12 bg-muted/30 border-b border-border">
      <div className="relative h-full">
        {/* Tick marks */}
        <div className="absolute bottom-0 left-0 w-full">{tickMarks}</div>

        {/* Time labels */}
        <div className="absolute top-2 left-0 w-full">{timeLabels}</div>
      </div>
    </div>
  );
}
