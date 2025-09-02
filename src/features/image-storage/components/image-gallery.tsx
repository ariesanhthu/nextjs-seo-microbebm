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
import { ChevronLeft, ChevronRight, RefreshCw, Trash2, X } from 'lucide-react';
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
      <Card>
        <CardHeader className='flex flex-row justify-center items-center'>
          <div className='flex flex-col gap-2'>
            <CardTitle>Danh sách ảnh</CardTitle>
            <CardDescription>Quản lý ảnh</CardDescription>
          </div>
          <Button variant="ghost" onClick={refresh} className='ml-auto mr-5'>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <ImageUploader refreshGallery={refresh} />
        </CardHeader>
        <CardContent>

          {imageMetadatas.length === 0 && !loading ? (
            <>
              Chưa có ảnh nào.
            </>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {imageMetadatas.map((imageMetadata) => (

                <Card  
                  key={imageMetadata.id}
                >
                  <CardHeader className='flex flex-row h-1/5 items-center justify-center space-y-0 py-0'>
                    <p className='font-sm text-sm line-clamp-1 mr-auto'> 
                      {imageMetadata.public_id}
                    </p>
                    <Button variant="ghost" onClick={() => handleDelete(imageMetadata.id)} className='ml-auto p-0'>
                      <X className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className='flex h-4/5 min-h-4/5 justify-center items-center p-2 mb-0'>
                    {imageMetadata.url
                      ? <CldImage
                          id={imageMetadata.id}
                          src={imageMetadata.url}
                          width={100}
                          height={100}
                          alt={`${imageMetadata.public_id}`}
                          className="w-full h-full border rounded-2xl"
                        />
                      : <Image
                          id={imageMetadata.id}
                          src="/images/no-image.jpg"
                          width={100}
                          height={100}
                          alt={`Blog ${imageMetadata.public_id}`}
                          className="w-full h-full border rounded-2xl"
                        />}
                  </CardContent>
                </Card>
              ))}
            </div>
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