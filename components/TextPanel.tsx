"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Type, Trash } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { VideoState } from "@/redux/slices/videoSlice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { toast } from "sonner";
import {
  addTextOverlay,
  removeTextOverlay,
  setSelectedTextOverlay,
  TextState,
  updateTextOverlay,
} from "@/redux/slices/textSlice";
import { addClip } from "@/redux/slices/timelineSlice";
import { Separator } from "./ui/separator";

export default function TextPanel() {
  const dispatch = useDispatch();
  const textOverlays = useSelector(
    (state: { text: TextState }) => state.text.overlays
  );
  const selectedOverlayId = useSelector(
    (state: { text: TextState }) => state.text.selectedOverlayId
  );

  const {
    duration,
    currentTime,
    source: videoSource,
  } = useSelector((state: { video: VideoState }) => state.video);

  const [textContent, setTextContent] = useState("");
  const [textType, setTextType] = useState<"title" | "caption">("title");

  const handleAddText = () => {
    if (!videoSource) {
      toast("Please upload a video first.");
      return;
    }

    if (!textContent.trim()) {
      toast("Please enter some text content.");
      return;
    }

    // Create text overlay
    const newOverlay = {
      content: textContent,
      startTime: currentTime,
      endTime: Math.min(currentTime + 5, duration),
      position: { x: 50, y: 50 },
      type: textType,
    };

    dispatch(addTextOverlay(newOverlay));

    // Add to timeline as a clip
    dispatch(
      addClip({
        startTime: newOverlay.startTime,
        endTime: newOverlay.endTime,
        sourceStartTime: 0,
        sourceEndTime: 0,
        type: "text",
        content: textContent,
      })
    );

    toast("Text added");
    setTextContent("");
  };

  const handleUpdateText = () => {
    if (!selectedOverlayId) return;

    dispatch(
      updateTextOverlay({
        id: selectedOverlayId,
        changes: {
          content: textContent,
          type: textType,
        },
      })
    );

    toast("Text updated");

    setTextContent("");
    setTextType("title");

    dispatch(setSelectedTextOverlay(null));
  };

  const handleDeleteText = () => {
    if (!selectedOverlayId) return;

    dispatch(removeTextOverlay(selectedOverlayId));

    toast("Text removed");
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Text Overlay</h3>
          <p className="text-xs text-muted-foreground mb-4">
            Add titles and captions to your video.
          </p>
        </div>

        <div className="space-y-3">
          <div>
            <Label htmlFor="text-type">Text Type</Label>
            <Select
              value={textType}
              onValueChange={(value: "title" | "caption") => setTextType(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="caption">Caption</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="text-content">Text Content</Label>
            <Textarea
              id="text-content"
              placeholder="Enter your text here..."
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              className="resize-none"
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-between pt-2">
          {selectedOverlayId ? (
            <>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteText}
              >
                <Trash size={16} className="mr-1" />
                Delete
              </Button>

              <Button variant="default" size="sm" onClick={handleUpdateText}>
                Update Text
              </Button>
            </>
          ) : (
            <Button
              variant="default"
              onClick={handleAddText}
              className="ml-auto"
            >
              <Type size={16} className="mr-1" />
              Add Text
            </Button>
          )}
        </div>

        <Separator className="my-4" />

        <div>
          <h3 className="text-sm font-medium mb-2">Text Overlays</h3>

          <div className="space-y-2">
            {textOverlays.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No text overlays added yet.
              </p>
            ) : (
              textOverlays.map((overlay) => (
                <div
                  key={overlay.id}
                  className={`p-2 rounded border ${
                    selectedOverlayId === overlay.id
                      ? "border-primary"
                      : "border-border"
                  } cursor-pointer hover:bg-muted/30 transition-colors`}
                  onClick={() => {
                    setTextContent(overlay.content);
                    setTextType(overlay.type);
                    dispatch(setSelectedTextOverlay(overlay.id));
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-medium truncate flex-1">
                      {overlay.content.substring(0, 30)}
                      {overlay.content.length > 30 ? "..." : ""}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {Math.floor(overlay.startTime)}s -{" "}
                      {Math.floor(overlay.endTime)}s
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
