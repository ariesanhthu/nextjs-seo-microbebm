"use client";

import { CldImage } from 'next-cloudinary';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useImageGallery } from '../context/image-gallery-context';
import Image from 'next/image';
import { useGlobalAlert } from '@/features/alert-dialog/context/alert-dialog-context';
import { ApiResponseDto } from '@/lib/dto/api-response.dto';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeft, ChevronRight, RefreshCw, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ImageMetadataResponseDto } from '@/lib/dto/image-metadata.dto';
import ImageUploader from './image-uploader';

export default function ImageGallery() {
  const {
    imageMetadatas,
    loading,
    error,
    hasNextPage,
    hasPrevPage,
    goToNextPage,
    goToPrevPage,
    refresh,
    cacheSize
  } = useImageGallery();

  useEffect(() => {
    if (!imageMetadatas || imageMetadatas.length === 0) {
      refresh();
    }
  }, []);

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

  const alertDialog = useGlobalAlert();

  const handleDelete = async (id: string) => {
    const choice = await alertDialog.showAlert({
      title: "Xóa ảnh",
      description: "Bạn có chắc chắn muốn xóa ảnh này?",
      actionText: "Đồng ý",
      cancelText: "Hủy"
    });

    if (!choice) {
      return;
    }
    try { 
      const response = await fetch(`/api/image-metadata/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data: ApiResponseDto<ImageMetadataResponseDto> = await response.json();

      if (!data.success) {
        toast.error(`Xảy ra lỗi khi xóa ảnh: \n${data.message}`);
      } else {
        toast.success("Ảnh được xóa thành công!");
        refresh(); 
      }
    } catch (error) {
      toast.error("Xảy ra lỗi khi xóa ảnh");
    }

  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quản lý ảnh</h1>
      </div>

      <Card>
        <CardHeader className='flex flex-row justify-center items-center'>
          <div className='flex flex-col gap-2'>
            <CardTitle>Danh sách ảnh</CardTitle>
            <CardDescription>Quản lý ảnh</CardDescription>
          </div>
          <div className='ml-auto'>
            <ImageUploader />
          </div>
        </CardHeader>
        <CardContent>
          {imageMetadatas.length === 0 && !loading ? (
            <>
              Chưa có ảnh nào.
            </>
          ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Ảnh</TableHead>
                  <TableHead>Public ID</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {imageMetadatas.map((imageMetadata) => (
                    <TableRow key={imageMetadata.id}>
                      <TableCell className="font-mono text-xs">{imageMetadata.id}</TableCell>
                      <TableCell>
                      {
                        imageMetadata.url
                        ?
                          <Image
                            src={imageMetadata.url}
                            width={50}
                            height={50}
                            alt={`${imageMetadata.public_id}`}
                            className="rounded-lg object-cover"
                          />
                        :
                          <Image
                            src="/images/no-image.jpg"
                            width={50}
                            height={50}
                            alt={`Blog ${imageMetadata.public_id}`}
                            className="rounded-lg object-cover"
                          />
                      }
                      </TableCell>
                      <TableCell className="font-medium">{imageMetadata.public_id}</TableCell>
                      <TableCell>{imageMetadata.url}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {/* <Link href={`/admin/imageMetadata/new/${imageMetadata.id}`} className="inline-flex">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link> */}
                          <Button variant="destructive" size="sm" className="text-white" onClick={() => handleDelete(imageMetadata.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
          )}
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
              {imageMetadatas.length} ảnh
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
  </div>
);
}