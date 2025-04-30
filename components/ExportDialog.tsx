"use client";

import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  updateExportProgress,
  completeExport,
  cancelExport,
  ExportState,
} from "@/redux/slices/exportSlice";
import { Button } from "@/components/ui/button";
import { X, Download, Settings } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

export default function ExportDialog() {
  const dispatch = useDispatch();
  const { isExporting, progress, format, quality, resolution } =
    useSelector((state: { export: ExportState }) => state.export);

  // Simulate export progress
  useEffect(() => {
    if (isExporting && progress < 100) {
      const interval = setInterval(() => {
        const nextProgress = Math.min(progress + 10, 100);
        dispatch(updateExportProgress(nextProgress));

        if (nextProgress === 100) {
          clearInterval(interval);

          setTimeout(() => {
            dispatch(completeExport("/exported-video.mp4"));
            toast("Export complete");
          }, 1000);
        }
      }, 500);

      return () => clearInterval(interval);
    }
  }, [isExporting, progress, dispatch]);

  const handleCancel = () => {
    dispatch(cancelExport());
    toast("Export cancelled");
  };

  return (
    <Dialog open={isExporting} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Exporting Video</DialogTitle>
          <DialogDescription>
            {progress < 100
              ? "Please wait while your video is being processed."
              : "Your video has been successfully exported."}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="flex justify-between items-center mb-4 text-xs text-muted-foreground">
            <div className="flex items-center">
              <Settings size={14} className="mr-1" />
              <span>Format: {format.toUpperCase()}</span>
            </div>
            <span>Quality: {quality}</span>
            <span>Resolution: {resolution}</span>
          </div>

          <Progress value={progress} className="h-2 mb-2" />
          <p className="text-sm text-muted-foreground text-center">
            {progress < 100
              ? `Processing... ${progress}%`
              : "Processing complete"}
          </p>
        </div>

        <div className="flex justify-end space-x-2">
          {progress < 100 ? (
            <Button variant="outline" onClick={handleCancel}>
              <X size={16} className="mr-1" />
              Cancel
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => dispatch(cancelExport())}
              >
                <X size={16} className="mr-1" />
                Close
              </Button>
              <Button variant="default">
                <Download size={16} className="mr-1" />
                Download
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
