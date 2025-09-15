"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Package } from "lucide-react"
import { HomepageResponseDto } from "@/lib/dto/homepage.dto"
import { ProductResponseDto } from "@/lib/dto/product.dto"
import { useProductGallery } from "@/features/product/context/product-gallery-context"
import { toast } from "sonner"

interface ProductsSectionProps {
  form: HomepageResponseDto | null
  setForm: (form: HomepageResponseDto | null) => void
}

export default function ProductsSection({ form, setForm }: ProductsSectionProps) {
  const productGallery = useProductGallery()

  const handleProductSelection = () => {
    productGallery.openSelectionDialog(form?.products || [], (selected) => {
      if (form) {
        setForm({
          ...form,
          products: selected
        })
        toast.success(`Đã chọn ${selected.length} sản phẩm nổi bật`)
      }
    })
  }

  const removeProduct = (productId: string) => {
    if (form) {
      setForm({
        ...form,
        products: (form.products || []).filter(p => p.id !== productId)
      })
      toast.success("Đã xóa sản phẩm khỏi danh sách nổi bật")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Package className="h-5 w-5" /> Sản phẩm nổi bật</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-foreground">
            Đã chọn {form?.products?.length || 0} sản phẩm
          </div>
          <Button variant="outline" onClick={handleProductSelection}>
            <Plus className="h-4 w-4 mr-2" />
            {form?.products?.length ? "Chỉnh sửa" : "Thêm sản phẩm"}
          </Button>
        </div>

        {(form?.products || []).length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(form?.products || []).map((product) => (
              <Card key={product.id} className="relative">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 min-w-0 ">
                      <h4 className="font-medium text-sm truncate">{product.name}</h4>
                      <p className="text-xs text-gray-500 truncate">
                        {product.description || "Không có mô tả"}
                      </p>
                      {product.categories && product.categories.length > 0 && (
                        <span className="text-xs text-blue-600 font-medium">
                          {product.categories[0].name}
                        </span>
                      )}
                    </div>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="h-6 w-6 text-white"
                      onClick={() => removeProduct(product.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center text-foreground py-8">
            <Package className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>Chưa có sản phẩm nào được chọn</p>
            <p className="text-sm">Nhấn "Thêm sản phẩm" để bắt đầu</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
