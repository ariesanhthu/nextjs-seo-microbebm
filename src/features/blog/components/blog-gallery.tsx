"use client";

import { CldImage } from 'next-cloudinary';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, RefreshCw, X } from 'lucide-react';
import { useBlogGallery } from '../context/blog-gallery-context';
import Image from 'next/image';
import { useGlobalAlert } from '@/features/alert-dialog/context/alert-dialog-context';
import { ApiResponseDto } from '@/lib/dto/api-response.dto';
import { BlogResponseDto } from '@/lib/dto/blog.dto';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { useEffect } from 'react';

export default function BlogGallery() {
  const {
    blogs,
    loading,
    error,
    hasNextPage,
    hasPrevPage,
    goToNextPage,
    goToPrevPage,
    refresh,
    cacheSize
  } = useBlogGallery();

  const clearCache = () => {
    refresh(); // Clear cache and refetch current page
  };

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

  const alertDialog = useGlobalAlert();

  const handleDelete = async (id: string) => {
    const choice = await alertDialog.showAlert({
      title: "Xóa bài viết",
      description: "Bạn có chắc chắn muốn xóa bài viết này?",
      actionText: "Đồng ý",
      cancelText: "Hủy"
    });

    if (!choice) {
      return;
    }
    try { 
      const response = await fetch(`/api/blog/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data: ApiResponseDto<BlogResponseDto> = await response.json();

      if (!data.success) {
        toast.error(`Failed to delete blog post\n${data.message}`);
      } else {
        toast.success("Blog post deleted successfully!");
        refresh(); 
      }
    } catch (error) {
      toast.error("An error occurred while deleting the blog post");
    }

  };

  return (
    <Card className='border-4 rounded-2xl m-5'>
      <Toaster richColors position='top-center'/>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Thư viện Blog
          <div className="ml-auto">
            <Button variant="ghost" onClick={clearCache}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>

      </CardHeader>
      <CardContent className="w-full overflow-x-auto overflow-y-auto">
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <>
            <div className="flex flex-col gap-4 justify-center">
              {blogs.map((blog) => (
                <div key={blog.id} className="flex flex-row gap-5 items-center">
                  {
                    blog.thumbnail_url !== "" && blog.thumbnail_url
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
                  }
                  <div className="w-2/3">
                    <div className="truncate">Title: {blog.title}</div>
                  </div>
                  <Button 
                    variant="destructive"
                    className='ml-auto'
                    type='button'
                    onClick={() => handleDelete(blog.id)}
                  >
                    Xóa
                  </Button>
                </div>
              ))}
            </div>
            {blogs.length === 0 && (
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
            {blogs.length} blogs
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