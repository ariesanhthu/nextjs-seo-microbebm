"use client";

import { CldImage } from 'next-cloudinary';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, RefreshCw, X } from 'lucide-react';
import { BlogResponseDto } from '@/lib/dto/blog.dto';
import { UsePaginatedFetchReturn } from '@/hooks/use-paginated-fetch';
import Image from 'next/image';


interface OpenBlogDialogProps extends Partial<UsePaginatedFetchReturn<BlogResponseDto>> {
  onSelect: (blog: BlogResponseDto) => void;
  closeDialog: () => void;
  isOpen?: boolean;
}

export default function OpenBlogDialog({ 
  onSelect, 
  closeDialog, 
  isOpen = true,
  data: blogs,
  loading,
  error,
  hasNextPage,
  hasPrevPage,
  goToFirstPage,
  goToNextPage,
  goToPrevPage,
  refresh,
  cacheSize
}: OpenBlogDialogProps) {

  const clearCache = () => {
    if (refresh) {
      refresh(); // This will clear cache and refetch current page
    }
  };

  const handleSelect = (blog: BlogResponseDto) => {
    onSelect(blog);
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
              <p>Error loading blogs: {error}</p>
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
            Thư viện bài viết
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
                {blogs?.map((blog) => (
                  <Button 
                    key={blog.id} 
                    className="flex flex-row gap-5 justify-start bg-transparent hover:bg-muted"
                    onClick={() => handleSelect(blog)}
                  >
                    {/* {
                      blog.thumbnail_url !== ""
                      ?
                        <CldImage
                          src={blog.thumbnail_url}
                          width={50}
                          height={50}
                          alt={`Blog ${blog.title}`}
                          className="rounded-lg object-cover"
                        />
                      :
                        <Image
                          src="/images/no-image.jpg"
                          width={50}
                          height={50}
                          alt={`Blog ${blog.title}`}
                          className="rounded-lg object-cover"
                        />
                    } */}
                    <div className="truncate font-medium text-black overflow-auto">{blog.title}</div>
                  </Button>
                ))}
              </div>

              {blogs?.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No blogs found
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
              {blogs?.length} blogs
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