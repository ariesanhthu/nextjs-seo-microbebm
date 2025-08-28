"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ImageUploader from '@/features/image-storage/components/image-uploader';
import ImageGallery from './components/image-gallery';
import { useState } from 'react';

export default function Page() {
  const [activeTab, setActiveTab] = useState("uploader");

  return (
    <div className="flex flex-col gap-10 mx-10 py-8">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="uploader">Image Uploader</TabsTrigger>
          <TabsTrigger value="fetcher">Image Fetcher</TabsTrigger>
        </TabsList>        
      </Tabs>

      {/* Render both components (hidden/show) to keep cached*/}
      <div className="">
        <div className={activeTab === "uploader" ? "block" : "hidden"}>
          <ImageUploader />
        </div>
        
        <div className={activeTab === "fetcher" ? "block" : "hidden"}>
          <ImageGallery />
        </div>
      </div>
    </div>
  );
}
