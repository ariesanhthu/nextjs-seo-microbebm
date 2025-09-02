// pages/admin/products.tsx
"use client"
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

import NavbarAdmin from '@/components/NavbarAdmin';
import ProductGallery from '@/features/product/components/product-gallery';
import { Plus } from 'lucide-react';

export default function AdminProducts() {
  const router = useRouter();
 

  return (
    <div className="space-y-6">
      <NavbarAdmin 
        name="Quản lý sản phẩm"
        description="Xem, chỉnh sửa và quản lý danh sách sản phẩm"
        buttonTool={
          <Button onClick={() => router.push('/admin/product/new')} variant="default">
            <Plus className="mr-2 h-4 w-4" /> Thêm sản phẩm
          </Button>
        }
      />
      <ProductGallery />

      {/* <div className="px-4">
        {products.length === 0 && !isLoading ? (
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
                            onClick={() => confirmDelete(product.id)}
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
          </Card>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {/* <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
      */}
    </div>
  );
}