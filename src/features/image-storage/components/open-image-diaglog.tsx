"use client";

import { CldImage } from 'next-cloudinary';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, RefreshCw, X } from 'lucide-react';
import { usePaginatedFetch, ESort } from '@/hooks/use-paginated-fetch';
import { ImageMetadataResponseDto } from '@/lib/dto/image-metadata.dto';


interface OpenImageMetadataDialogProps {
  onSelect: (imageMetadata: ImageMetadataResponseDto) => void;
  closeDialog: () => void;
  isOpen?: boolean;
}

export default function OpenImageMetadataDialog({ onSelect, closeDialog, isOpen = true }: OpenImageMetadataDialogProps) {
  const {
    data: imageMetadatas,
    loading,
    error,
    hasNextPage,
    hasPrevPage,
    goToNextPage,
    goToPrevPage,
    refresh,
    cacheSize
  } = usePaginatedFetch<ImageMetadataResponseDto>('/api/image-metadata', {
    limit: 10,
    sort: ESort.DESC,
    autoFetch: true
  });

  const clearCache = () => {
    refresh(); // This will clear cache and refetch current page
  };

  const handleSelect = (imageMetadata: ImageMetadataResponseDto) => {
    onSelect(imageMetadata);
    closeDialog();
  };

  // Don't render content when closed 
  if (!isOpen) {
    return null;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-500">
              <p>Error loading imageMetadatas: {error}</p>
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
      <Card className='w-1/3 h-120 min-h-100 border-4 rounded-2xl'>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Thư viện ảnh
            <div className="ml-auto">
              <Button variant="ghost" onClick={clearCache}>
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button variant="ghost" onClick={closeDialog}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>

        </CardHeader>
        <CardContent className="max-h-2/3 min-h-2/3 overflow-x-auto overflow-y-auto">
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <>
              <div className="flex flex-col gap-4 w-full">
                {imageMetadatas.map((imageMetadata) => (
                  <Button 
                    key={imageMetadata.id} 
                    className="flex flex-row gap-5 justify-start bg-transparent hover:bg-muted"
                    onClick={() => handleSelect(imageMetadata)}
                  >
                    <CldImage
                      src={imageMetadata.public_id}
                      width={50}
                      height={50}
                      alt={`ImageMetadata ${imageMetadata.public_id}`}
                      className="rounded-lg object-cover"
                    />
                    <div className="truncate font-medium text-black overflow-auto">{imageMetadata.public_id}</div>
                  </Button>
                ))}
              </div>
              
              {imageMetadatas.length === 0 && (
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
              {imageMetadatas.length} images
            </Badge>
            {/* {cacheSize > 1 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearCache}
                className="text-xs"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Refresh
              </Button>
            )} */}
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