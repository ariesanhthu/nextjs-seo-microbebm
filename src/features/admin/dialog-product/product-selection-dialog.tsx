"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, X, Plus, Package } from "lucide-react"
import { ProductResponseDto } from "@/lib/dto/product.dto"

interface ProductSelectionDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (selectedProducts: ProductResponseDto[]) => void
  currentSelected: ProductResponseDto[]
}

export default function ProductSelectionDialog({
  isOpen,
  onClose,
  onConfirm,
  currentSelected
}: ProductSelectionDialogProps) {
  const [products, setProducts] = useState<ProductResponseDto[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProducts, setSelectedProducts] = useState<ProductResponseDto[]>(currentSelected)

  useEffect(() => {
    if (isOpen) {
      fetchProducts()
      setSelectedProducts(currentSelected)
    }
  }, [isOpen, currentSelected])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/product", { cache: "no-store" })
      const data = await res.json()
      if (data?.success) {
        setProducts(data.data || [])
      }
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleProductSelection = (product: ProductResponseDto) => {
    const isSelected = selectedProducts.some(p => p.id === product.id)
    if (isSelected) {
      setSelectedProducts(selectedProducts.filter(p => p.id !== product.id))
    } else {
      setSelectedProducts([...selectedProducts, product])
    }
  }

  const removeSelectedProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId))
  }

  const handleConfirm = () => {
    onConfirm(selectedProducts)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Chọn sản phẩm nổi bật</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left side - Product list */}
          <div className="flex-1 border-r overflow-hidden">
            <div className="p-4 pb-0">
              <div>
                <Label htmlFor="search">Tìm kiếm sản phẩm</Label>
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="search"
                    placeholder="Nhập tên hoặc mô tả sản phẩm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
            
            <div className="p-4 pt-2 overflow-y-auto h-full">
              {loading ? (
                <div className="text-center py-8 text-gray-500">Đang tải...</div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {filteredProducts.map((product) => {
                    const isSelected = selectedProducts.some(p => p.id === product.id)
                    return (
                      <Card
                        key={product.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                        }`}
                        onClick={() => toggleProductSelection(product)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center gap-3">
                            <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-md flex items-center justify-center">
                              <Package className="h-8 w-8 text-gray-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-sm truncate">{product.name}</h3>
                              {/* <p className="text-xs text-gray-500 truncate">
                                {product.description || "Không có mô tả"}
                              </p> */}
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant={isSelected ? "default" : "secondary"} className="text-xs">
                                  {isSelected ? "Đã chọn" : "Chưa chọn"}
                                </Badge>
                                {product.categories && product.categories.length > 0 && (
                                  <span className="text-xs text-blue-600 font-medium">
                                    {product.categories[0].name}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right side - Selected products */}
          <div className="w-80 overflow-hidden">
            <div className="p-4 pb-0">
              <h3 className="font-medium">Sản phẩm đã chọn ({selectedProducts.length})</h3>
            </div>
            
            <div className="p-4 pt-2 overflow-y-auto h-full">
              {selectedProducts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>Chưa có sản phẩm nào được chọn</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedProducts.map((product) => (
                    <Card key={product.id} className="relative">
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          {/* <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded-md flex items-center justify-center">
                            <Package className="h-6 w-6 text-gray-600" />
                          </div> */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-red-500 hover:text-red-700"
                            onClick={() => removeSelectedProduct(product.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{product.name}</h4>
                            {product.categories && product.categories.length > 0 && (
                              <p className="text-xs text-blue-600 font-medium">
                                {product.categories[0].name}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50 flex-shrink-0">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleConfirm}>
            Xác nhận ({selectedProducts.length})
          </Button>
        </div>
      </div>
    </div>
  )
}
