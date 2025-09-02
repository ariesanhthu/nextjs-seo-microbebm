"use client";

import { CldImage } from 'next-cloudinary';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBlogGallery } from '../context/blog-gallery-context';
import Image from 'next/image';
import { useGlobalAlert } from '@/features/alert-dialog/context/alert-dialog-context';
import { ApiResponseDto } from '@/lib/dto/api-response.dto';
import { BlogResponseDto } from '@/lib/dto/blog.dto';
import { toast } from '@/hooks/use-toast';
import { useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Edit, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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

  useEffect(() => {
    if (!blogs || blogs.length === 0) {
      refresh();
    }
  }, []);

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
        toast({
          variant: "destructive",
          title: "Xóa thất bại",
          description: `Failed to delete blog post: ${data.message}`,
        });
      } else {
        toast({
          title: "Đã xóa",
          description: "Blog post deleted successfully!",
        });
        refresh(); 
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "An error occurred while deleting the blog post",
      });
    }

  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quản lý bài viết</h1>
        <Link href="/admin/blog/new">
          <Button>
            <Plus className="mr-2 h-4 w-4"/> Tạo mới
          </Button>
        </Link>
      </div>

      {blogs.length === 0 && !loading ? (
        <Alert>
          <AlertDescription>Chưa có bài viết nào.</AlertDescription>
        </Alert>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Danh sách bài viết</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ảnh</TableHead>
                  <TableHead>Tiêu đề</TableHead>
                  <TableHead>Tác giả</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blogs.map((blog) => (
                  <TableRow key={blog.id}>
                    <TableCell>
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
                    </TableCell>
                    <TableCell className="font-medium">{blog.title}</TableCell>
                    <TableCell>{blog.author}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Link href={`/admin/blog/new/${blog.id}`} className="inline-flex">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="destructive" size="sm" className="text-white" onClick={() => handleDelete(blog.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className='flex flex-row justify-center items-center mt-6 gap-5'>
            <Button
              variant="outline"
              onClick={goToPrevPage}
              disabled={!hasPrevPage || loading}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Trước đó
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
              Kế tiếp
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>

          </CardFooter>
        </Card>
      )}
    </div>
  );
}