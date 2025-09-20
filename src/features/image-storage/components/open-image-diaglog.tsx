"use client";

import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, RefreshCw, X } from 'lucide-react';
import { UsePaginatedFetchReturn } from '@/hooks/use-paginated-fetch';
import { ImageMetadataResponseDto } from '@/lib/dto/image-metadata.dto';


interface OpenImageMetadataDialogProps extends Partial<UsePaginatedFetchReturn<ImageMetadataResponseDto>> {
  onSelect: (imageMetadata: ImageMetadataResponseDto) => void;
  closeDialog: () => void;
  isOpen?: boolean;
}

export default function OpenImageMetadataDialog({ 
  onSelect, 
  closeDialog, 
  isOpen = true,
  data: imageMetadatas,
  loading,
  error,
  hasNextPage,
  hasPrevPage,
  goToNextPage,
  goToPrevPage,
  refresh,
  cacheSize
}: OpenImageMetadataDialogProps) {

  const clearCache = () => {
    if (refresh) {
      refresh();
    }
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
    <Card className='w-4/5 max-w-4xl h-4/5 max-h-[600px] border-2 rounded-xl shadow-lg'>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          Thư viện ảnh
          <div className="ml-auto flex gap-2">
            <Button variant="ghost" size="sm" onClick={clearCache}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={closeDialog}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="max-h-[400px] overflow-y-auto px-6">
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <>
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 w-full">
                {imageMetadatas?.map((imageMetadata) => (
                  <Button 
                    key={imageMetadata.id} 
                    className="flex bg-transparent hover:bg-gray-100 p-1 h-auto aspect-square"
                    onClick={() => handleSelect(imageMetadata)}
                  >
                    <Image
                      src={imageMetadata.url}
                      width={100}
                      height={100}
                      alt={`Image ${imageMetadata.id}`}
                      className="rounded-lg object-cover w-full h-full"
                    />
                  </Button>
                ))}
              </div>
              
              {imageMetadatas?.length === 0 && (
                <div className="text-center py-8 text-foreground">
                  No images found
                </div>
              )}
            </>
          )}
        </CardContent>
        <CardFooter className='flex flex-row justify-between items-center pt-4 border-t'>
          <Button
            variant="outline"
            size="sm"
            onClick={goToPrevPage}
            disabled={!hasPrevPage || loading}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Trước
          </Button>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {imageMetadatas?.length} ảnh
            </Badge>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={!hasNextPage || loading}
          >
            Sau
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </CardFooter>
      </Card>
  );
}