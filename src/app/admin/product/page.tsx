// pages/admin/products.tsx
"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Card, 
  CardContent, 
  CardDescription, 
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
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Trash2, Plus, Edit, Eye } from 'lucide-react';
import { 
  Alert, 
  AlertDescription 
} from '@/components/ui/alert';
import { toast } from '@/components/ui/use-toast';
import { ProductResponseDto } from '@/lib/dto/product.dto';
// import { SingleImageDropzoneUsage } from '@/components/SingleImageDropzoneUsage';
export default function AdminProducts() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  // Fetch products from API
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/product');
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
      } else {
        toast({
          title: "Error loading products",
          description: data.message || "Failed to load products",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to the server",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);



  // Handle confirming product deletion
  const confirmDelete = (id: string) => {
    setProductToDelete(id);
    setOpenDeleteDialog(true);
  };

  // Handle deleting a product
  const handleDelete = async () => {
    if (productToDelete === null) return;
    
    setIsLoading(true);
    try {
      const res = await fetch(`/api/product/${productToDelete}`, { 
        method: 'DELETE' 
      });
      
      const data = await res.json();
      
      if (data.success) {
        toast({
          title: "Success",
          description: "Product deleted successfully",
        });
        fetchProducts();
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to delete product",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setOpenDeleteDialog(false);
      setProductToDelete(null);
    }
  };
// Open edit page with product data
const openEdit = (product: ProductResponseDto) => {
  router.push(`/admin/product/new/${product.id}`);
};

  return (
    <div className="container mx-auto p-4 space-y-6">
             <div className="flex justify-between items-center">
         <h1 className="text-2xl font-bold">Quản lý sản phẩm</h1>
         <Button onClick={() => router.push('/admin/product/new')} variant="default">
           <Plus className="mr-2 h-4 w-4" /> Thêm sản phẩm
         </Button>
       </div>

      {products.length === 0 && !isLoading ? (
        <Alert>
          <AlertDescription>
            No products found. Add your first product to get started.
          </AlertDescription>
        </Alert>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
            <CardDescription>
              Manage your product catalog with this interface.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                                 <TableRow>
                   <TableHead>ID</TableHead>
                   <TableHead>Tên</TableHead>
                   <TableHead>Mô tả</TableHead>
                   <TableHead>Thao tác</TableHead>
                 </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-mono text-xs truncate max-w-[20px]">
                      {product.id}
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.description}</TableCell>
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
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
      </Dialog>
     
    </div>
  );
}