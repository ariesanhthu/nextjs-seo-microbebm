"use client";

import { useState, useEffect } from 'react';
import { CldImage } from 'next-cloudinary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

interface ImageMetadata {
  id: string;
  public_id: string;
  url: string;
  width: number;
  height: number;
  created_at: string;
}

interface ApiResponse {
  success: boolean;
  data: ImageMetadata[];
  nextCursor?: string;
  hasNextPage: boolean;
  count: number;
}

interface CachedPage {
  cursor: string | null;
  data: ImageMetadata[];
  nextCursor?: string;
  hasNextPage: boolean;
}

export default function ImageFetcher() {
  const [images, setImages] = useState<ImageMetadata[]>([]);
  const [currentCursor, setCurrentCursor] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [cursors, setCursors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Add cache for pages
  const [pageCache, setPageCache] = useState<Map<string, CachedPage>>(new Map());

  const getCacheKey = (cursor: string | null) => cursor || 'first-page';

  const fetchImages = async (cursor: string | null) => {
    const cacheKey = getCacheKey(cursor);
    
    // Check cache first
    const cachedPage = pageCache.get(cacheKey);
    if (cachedPage) {
      console.log('📦 Loading from cache:', cacheKey);
      setImages(cachedPage.data);
      setNextCursor(cachedPage.nextCursor || null);
      setHasNextPage(cachedPage.hasNextPage);
      setCurrentCursor(cursor || null);
      return;
    }

    setLoading(true);
    try {
      let url = `/api/image-metadata?limit=10`;
      if (cursor) {
        url += `&cursor=${cursor}`;
      }
      
      const response = await fetch(url);
      const data: ApiResponse = await response.json();
      
      if (data.success) {
        // Cache the page data
        const pageData: CachedPage = {
          cursor,
          data: data.data,
          nextCursor: data.nextCursor,
          hasNextPage: data.hasNextPage
        };
        
        setPageCache(prev => new Map(prev).set(cacheKey, pageData));
        
        setImages(data.data);
        setNextCursor(data.nextCursor || null);
        setHasNextPage(data.hasNextPage);
        setCurrentCursor(cursor || null);
      }
    } catch (error) {
      console.error('Failed to fetch images:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages(currentCursor);
  }, []);

  const handlePrevPage = () => {
    if (cursors.length > 0) {
      const prevCursor = cursors[cursors.length - 1];
      setCursors(prev => prev.slice(0, -1));
      fetchImages(prevCursor);
    }
  };

  const handleNextPage = () => {
    if (hasNextPage && nextCursor) {
      setCursors(prev => [...prev, currentCursor || '']);
      fetchImages(nextCursor);
    }
  };

  const clearCache = () => {
    setPageCache(new Map());
    fetchImages(currentCursor); // Refetch current page
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Image Gallery
            {pageCache.size > 0 && (
              <Badge variant="secondary" className="ml-2">
                {pageCache.size} pages cached
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
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
              
              <div className="flex items-center justify-between mt-6">
                <Button
                  variant="outline"
                  onClick={handlePrevPage}
                  disabled={cursors.length === 0 || loading}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {images.length} images
                  </Badge>
                  {/* {pageCache.size > 1 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={clearCache}
                      className="text-xs"
                    >
                      Clear Cache
                    </Button>
                  )} */}
                </div>
                
                <Button
                  variant="outline"
                  onClick={handleNextPage}
                  disabled={!hasNextPage || loading}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}