"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ImageUploader from '@/features/image-storage/components/image-uploader';
import ImageFetcher from '@/features/image-storage/components/image-fetcher';

export default function CloudinaryTestPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Cloudinary storage</h1>
      </div>

      <Tabs defaultValue="uploader" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="uploader">Image Uploader</TabsTrigger>
          <TabsTrigger value="fetcher">Image Fetcher</TabsTrigger>
        </TabsList>
        
        <TabsContent value="uploader" className="space-y-6">
          <ImageUploader />
        </TabsContent>
        
        <TabsContent value="fetcher" className="space-y-6">
          <ImageFetcher />
        </TabsContent>
      </Tabs>
    </div>
  );
}
