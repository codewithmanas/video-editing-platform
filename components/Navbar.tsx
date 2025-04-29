"use client";

import {
  Download,
  PauseCircle,
  PlayCircle,
  Save,
  Settings,
  Upload,
} from "lucide-react";
import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { DarkModeToggle } from "./DarkModeToggle";

const Navbar = () => {
  const [projectName, setProjectName] = useState("Untitled Project");
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="h-14 flex items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
            VEVideo
          </h1>
          <div className="h-6 w-px bg-border mx-2" />
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="bg-transparent border-none focus:outline-none focus:ring-0 text-sm font-medium"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="ghost"
            className="text-muted-foreground hover:text-foreground cursor-pointer"
            onClick={togglePlayback}
          >
            {isPlaying ? <PauseCircle size={18} /> : <PlayCircle size={18} />}
          </Button>



          <div className="h-6 w-px bg-border mx-2" />

          <Button size="sm" variant="outline" className="gap-1 cursor-pointer">
            <Upload size={16} />
            <span className="hidden sm:inline">Import</span>
          </Button>

          <Button size="sm" variant="outline" className="gap-1 cursor-pointer">
            <Save size={16} />
            <span className="hidden sm:inline">Save Project</span>
          </Button>

          <Button
            size="sm"
            variant="default"
            className="gap-1 cursor-pointer"
            // onClick={handleExport}
          >
            <Download size={16} />
            <span className="hidden sm:inline">Export</span>
          </Button>

          <DarkModeToggle />

          <div className="h-6 w-px bg-border mx-2" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost" className="cursor-pointer">
                <Settings size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Preferences</DropdownMenuItem>
              <DropdownMenuItem>Keyboard Shortcuts</DropdownMenuItem>
              <DropdownMenuItem>Project Settings</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
