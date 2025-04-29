"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ImageIcon, Layers, Music, Settings, Text } from "lucide-react";
import MediaPanel from "./MediaPanel";
import TextPanel from "./TextPanel";
import AudioPanel from "./AudioPanel";
import ImagePanel from "./ImagePanel";
import EffectsPanel from "./EffectsPanel";

const EditingOptions = () => {
  const [activeTab, setActiveTab] = useState("media");

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="h-full flex flex-col"
    >
      <div className="border-b border-border px-4">
        <TabsList className="h-10 w-full justify-start">
          <TabsTrigger value="media" className="flex items-center gap-1">
            <Layers size={16} />
            <span className="hidden sm:inline">Media</span>
          </TabsTrigger>
          <TabsTrigger value="text" className="flex items-center gap-1">
            <Text size={16} />
            <span className="hidden sm:inline">Text</span>
          </TabsTrigger>
          <TabsTrigger value="audio" className="flex items-center gap-1">
            <Music size={16} />
            <span className="hidden sm:inline">Audio</span>
          </TabsTrigger>
          <TabsTrigger value="image" className="flex items-center gap-1">
            <ImageIcon size={16} />
            <span className="hidden sm:inline">Image</span>
          </TabsTrigger>
          <TabsTrigger value="effects" className="flex items-center gap-1">
            <Settings size={16} />
            <span className="hidden sm:inline">Effects</span>
          </TabsTrigger>
        </TabsList>
      </div>

      <div className="flex-1 overflow-auto">
        <TabsContent value="media" className="h-full m-0 p-0">
          <MediaPanel />
        </TabsContent>
        <TabsContent value="text" className="h-full m-0 p-0">
          <TextPanel />
        </TabsContent>
        <TabsContent value="audio" className="h-full m-0 p-0">
          <AudioPanel />
        </TabsContent>
        <TabsContent value="image" className="h-full m-0 p-0">
          <ImagePanel />
        </TabsContent>
        <TabsContent value="effects" className="h-full m-0 p-0">
          <EffectsPanel />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default EditingOptions;
