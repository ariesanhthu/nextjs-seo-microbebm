"use client";

import { CldImage } from 'next-cloudinary';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, RefreshCw, X } from 'lucide-react';
import { ImageMetadataResponseDto } from '@/lib/dto/image-metadata.dto';
import { useImageGallery } from '../context/image-gallery-context';
import { useEffect } from 'react';

export default function ImageGallery() {
  const {
    imageMetadatas: images,
    loading,
    error,
    hasNextPage,
    hasPrevPage,
    goToNextPage,
    goToPrevPage,
    refresh,
    cacheSize
  } = useImageGallery();

  const clearCache = () => {
    refresh(); // Clear cache and refetch current page
  };

  useEffect(() => {
      refresh();
  }, []);

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-500">
              <p>Error loading images: {error}</p>
              <Button onClick={refresh} className="mt-2">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    // <div className="">
      <Card className='w-full border-4 rounded-2xl'>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Thư viện ảnh
            {/* <div className="ml-auto">
              <Button variant="ghost" onClick={clearCache}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div> */}
          </CardTitle>

        </CardHeader>
        <CardContent className="w-full overflow-x-auto overflow-y-auto">
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {images.map((image) => (
                  <div key={image.id} className="space-y-2">
                    <CldImage
                      src={image.public_id}
                      width={300}
                      height={200}
                      alt={`Image ${image.id}`}
                      className="rounded-lg object-cover w-full h-48"
                    />
                    <div className="text-xs text-muted-foreground">
                      <div className="truncate">ID: {image.public_id}</div>
                      <div>Size: {image.width} × {image.height}</div>
                    </div>
                  </div>
                ))}
              </div>
              {images.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No images found
                </div>
              )}
            </>
          )}
        </CardContent>
        <CardFooter className='flex flex-row justify-center items-center mt-6 gap-5'>
          <Button
            variant="outline"
            onClick={goToPrevPage}
            disabled={!hasPrevPage || loading}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          <div className="flex items-center">
            <Badge variant="outline">
              {images.length} images
            </Badge>
          </div>
          
          <Button
            variant="outline"
            onClick={goToNextPage}
            disabled={!hasNextPage || loading}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>

        </CardFooter>
      </Card>
  );
}