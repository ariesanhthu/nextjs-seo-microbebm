"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, X, Plus, BookOpen, ChevronLeft, ChevronRight } from "lucide-react"
import { ProductResponseDto } from "@/lib/dto/product.dto"

interface ProductSelectionDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (selectedProducts: ProductResponseDto[]) => void
  currentSelected: ProductResponseDto[]
  numberSelection?: number
  // Data props
  products: ProductResponseDto[]
  loading: boolean
  error: string | null
  hasNextPage: boolean
  hasPrevPage: boolean
  goToNextPage: () => void
  goToPrevPage: () => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  isSearching: boolean
  refresh: () => void
}

export default function ProductSelectionDialog({
  isOpen,
  onClose,
  onConfirm,
  currentSelected,
  numberSelection,
  products,
  loading,
  error,
  hasNextPage,
  hasPrevPage,
  goToNextPage,
  goToPrevPage,
  searchQuery,
  setSearchQuery,
  isSearching,
  refresh
}: ProductSelectionDialogProps) {
  const [selectedProducts, setSelectedProducts] = useState<ProductResponseDto[]>(currentSelected)

  useEffect(() => {
    if (isOpen) {
      setSelectedProducts(currentSelected)
      refresh()
    }
  }, [isOpen, currentSelected])

  const toggleProductSelection = (product: ProductResponseDto) => {
    const isSelected = selectedProducts.some(b => b.id === product.id)
    if (isSelected) {
      // Always allow removing selected products
      setSelectedProducts(selectedProducts.filter(b => b.id !== product.id))
    } else {
      // Check if we've reached the selection limit
      if (numberSelection && selectedProducts.length >= numberSelection) {
        // If numberSelection is 1, replace the current selection
        if (numberSelection === 1) {
          setSelectedProducts([product])
        }
        // For other limits, don't add more (could show a toast/message here)
        return
      }
      setSelectedProducts([...selectedProducts, product])
    }
  }

  const removeSelectedProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter(b => b.id !== productId))
  }

  const handleConfirm = () => {
    onConfirm(selectedProducts);
    onClose();
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            <div>
              <h2 className="text-xl font-semibold">Chọn bài viết</h2>
              {numberSelection && (
                <p className="text-sm text-gray-500">
                  {numberSelection === 1 
                    ? "Chỉ có thể chọn 1 bài viết" 
                    : `Tối đa ${numberSelection} bài viết`
                  }
                </p>
              )}
            </div>
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
                <Label htmlFor="search">Tìm kiếm bài viết</Label>
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="search"
                    placeholder="Nhập tiêu đề hoặc nội dung bài viết..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              {/* Pagination Controls */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToPrevPage}
                    disabled={!hasPrevPage || loading || isSearching}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Trước
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToNextPage}
                    disabled={!hasNextPage || loading || isSearching}
                  >
                    Sau
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                {(loading || isSearching) && (
                  <div className="text-sm text-foreground">
                    {isSearching ? "Đang tìm kiếm..." : "Đang tải..."}
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-4 pt-2 overflow-y-auto h-full">
              {loading || isSearching ? (
                <div className="text-center py-8 text-foreground">
                  {isSearching ? "Đang tìm kiếm..." : "Đang tải..."}
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">
                  <p>Có lỗi xảy ra: {error}</p>
                  <Button variant="outline" size="sm" onClick={refresh} className="mt-2">
                    Thử lại
                  </Button>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-8 text-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>Không tìm thấy bài viết nào</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {products.map((product) => {
                    const isSelected = selectedProducts.some(b => b.id === product.id)
                    return (
                      <Card
                        key={product.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                        }`}
                        onClick={() => toggleProductSelection(product)}
                      >
                        <CardContent className="p-5">
                          
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-sm truncate">{product.name}</h3>
                              <p className="text-xs text-foreground truncate">
                                {product.description || "Không có mô tả"}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant={isSelected ? "default" : "secondary"} className="text-xs">
                                  {isSelected ? "Đã chọn" : "Chưa chọn"}
                                </Badge>
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
              <h3 className="font-medium">Bài viết đã chọn ({selectedProducts.length})</h3>
            </div>
            
            <div className="p-4 pt-2 overflow-y-auto h-full">
              {selectedProducts.length === 0 ? (
                <div className="text-center py-8 text-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-2 text-foreground" />
                  <p>Chưa có bài viết nào được chọn</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedProducts.map((product) => (
                    <Card key={product.id} className="relative">
                      <CardContent className="p-5">
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{product.name}</h4>
                            <p className="text-xs text-foreground truncate">
                              {product.description || "Không có mô tả"}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-red-500 hover:text-red-700"
                            onClick={() => removeSelectedProduct(product.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
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
            Xác nhận ({selectedProducts.length}{numberSelection ? `/${numberSelection}` : ''})
          </Button>
        </div>
      </div>
    </div>
  )
}
