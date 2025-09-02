// pages/admin/products.tsx
"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Trash2, Plus, Edit, Eye, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { 
  Alert, 
  AlertDescription 
} from '@/components/ui/alert';
import { toast } from 'sonner';
import { ProductResponseDto } from '@/lib/dto/product.dto';
import { useProductGallery } from '@/features/product/context/product-gallery-context';
import { ApiResponseDto } from '@/lib/dto/api-response.dto';
import { Badge } from '@/components/ui/badge';
import { useGlobalAlert } from '@/features/alert-dialog/context/alert-dialog-context';

export default function ProductGallery() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    products,
    loading,
    error,
    hasNextPage,
    hasPrevPage,
    goToNextPage,
    goToPrevPage,
    refresh,
    cacheSize
  } = useProductGallery();

  const alertDialog = useGlobalAlert();

  useEffect(() => {
    if (!products || products.length === 0) {
      refresh();
    }
  }, []);

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    try {
      const choice = await alertDialog.showAlert({
        title: "Xóa sản phẩm",
        description: "Bạn có chắc chắn muốn xóa sản phẩm này?",
        actionText: "Đồng ý",
        cancelText: "Hủy"
      });

      if (!choice) {
        return;
      }
      try { 
        const response = await fetch(`/api/product/id/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data: ApiResponseDto<ProductResponseDto> = await response.json();

        if (!data.success) {
          toast.error(`Failed to delete product\n${data.message}`);
        } else {
          toast.success("Product deleted successfully!");
          refresh(); 
        }
      } catch (error) {
        toast.error("An error occurred while deleting the product");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Open edit page with product data
  const openEdit = (product: ProductResponseDto) => {
    router.push(`/admin/product/new/${product.id}`);
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

  return (
    <div className="space-y-6">
      <div className="px-4">
        {products.length === 0 && !loading && !isLoading ? (
          <Alert>
            <AlertDescription>
              Không tìm thấy sản phẩm nào. Thêm sản phẩm đầu tiên để bắt đầu.
            </AlertDescription>
          </Alert>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Danh sách sản phẩm</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên</TableHead>
                    <TableHead>Mô tả</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody >
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      
                      <TableCell className="font-medium truncate">{product.name}</TableCell>
                      <TableCell className='truncate max-w-[20rem]'>{product.description}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/product/${product.slug}`)}
                            title="Xem sản phẩm"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEdit(product)}
                            title="Chỉnh sửa"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(product.id)}
                            title="Xóa"
                          >
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
                {products.length} sản phẩm
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
    </div>
  );
}