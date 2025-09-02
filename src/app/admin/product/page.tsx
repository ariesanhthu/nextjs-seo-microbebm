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
    </div>
  );
}