"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Save, Trash2, Image as ImageIcon, Images, FolderTree, ArrowLeft } from "lucide-react"
import OpenImageMetadataDialog from "@/features/image-storage/components/open-image-diaglog"
import ImageUploader from "@/features/image-storage/components/image-uploader"
import { CldImage } from "next-cloudinary"
import { useToast } from "@/hooks/use-toast"
import ContentEditor from "@/features/blog/components/content-editor"
import { CreateProductDto, UpdateProductDto } from "@/lib/dto/product.dto"
import NavbarAdmin from "@/components/NavbarAdmin"

type CategoryItem = { id: string; name: string }

export default function AdminCreateProductPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const id = params?.id?.[0] // Lấy id từ dynamic route
  
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showGallery, setShowGallery] = useState<null | "main" | "sub">(null)
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([])

  // Sử dụng form state duy nhất với DTO
  const [formData, setFormData] = useState<CreateProductDto>({
    name: "",
    description: "",
    content: "",
    main_img: "",
    sub_img: [],
    category_ids: []
  })

  const isEditMode = Boolean(id)

  // Auto-save draft to localStorage
  useEffect(() => {
    const draftData = {
      ...formData,
      timestamp: Date.now()
    }
    
    if (formData.name || formData.description || formData.content) {
      localStorage.setItem('product-draft', JSON.stringify(draftData))
    }
  }, [formData])

  // Load draft from localStorage on mount
  useEffect(() => {
    if (!isEditMode) {
      const savedDraft = localStorage.getItem('product-draft')
      if (savedDraft) {
        try {
          const draft = JSON.parse(savedDraft)
          // Chỉ load draft nếu không có dữ liệu hiện tại
          if (!formData.name && !formData.description && !formData.content) {
            setFormData({
              name: draft.name || "",
              description: draft.description || "",
              content: draft.content || "",
              main_img: draft.main_img || "",
              sub_img: draft.sub_img || [],
              category_ids: draft.category_ids || []
            })
            setSelectedCategoryIds(draft.category_ids || [])
          }
        } catch (e) {
          console.error('Error loading draft:', e)
        }
      }
    }
  }, [isEditMode, formData.name, formData.description, formData.content])

  // Clear content draft when switching between products
  useEffect(() => {
    if (isEditMode && id) {
      // Clear any existing content draft when editing a product
      localStorage.removeItem('product-content-draft')
    }
  }, [isEditMode, id])

  // Fetch product data if editing
  useEffect(() => {
    if (id) {
      fetchProductData()
    }
  }, [id])

  const fetchProductData = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(`/api/product/${id}`)
      const data = await res.json()
      
      if (data?.success && data.data) {
        const product = data.data
        console.log('📥 Loaded product data:', {
          id: product.id,
          name: product.name,
          contentLength: product.content?.length || 0,
          contentPreview: product.content?.substring(0, 100) + '...'
        })
        
        setFormData({
          name: product.name || "",
          description: product.description || "",
          content: product.content || "",
          main_img: product.main_img || "",
          sub_img: product.sub_img || [],
          category_ids: product.category_ids || []
        })
        setSelectedCategoryIds(product.category_ids || [])
      } else {
        setError(data?.message || "Không thể tải thông tin sản phẩm")
        toast({
          title: "Lỗi",
          description: data?.message || "Không thể tải thông tin sản phẩm",
          variant: "destructive",
        })
      }
    } catch (e) {
      console.error("Error fetching product:", e)
      setError("Không thể tải thông tin sản phẩm")
      toast({
        title: "Lỗi",
        description: "Không thể tải thông tin sản phẩm",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true)
        const res = await fetch("/api/category?limit=100&sort=ASC")
        const data = await res.json()
        if (data?.success) {
          const list = (data.data || []).map((c: any) => ({ id: c.id, name: c.name }))
          setCategories(list)
        }
      } catch (e) {
        console.error(e)
        toast({
          title: "Lỗi",
          description: "Không thể tải danh mục",
          variant: "destructive",
        })
      } finally {
        setCategoriesLoading(false)
      }
    }
    fetchCategories()
  }, [toast])

  const removeSubAt = (idx: number) => {
    const newSubImgs = formData.sub_img.filter((_, i) => i !== idx)
    setFormData(prev => ({ ...prev, sub_img: newSubImgs }))
  }

  const toggleCategory = (id: string) => {
    const newCategoryIds = selectedCategoryIds.includes(id) 
      ? selectedCategoryIds.filter((x) => x !== id) 
      : [...selectedCategoryIds, id]
    
    setSelectedCategoryIds(newCategoryIds)
    setFormData(prev => ({ ...prev, category_ids: newCategoryIds }))
  }

  const updateFormField = (field: keyof CreateProductDto, value: any) => {
    if (field === 'content') {
      console.log('✏️ Content updated:', {
        field,
        valueLength: value.length,
        valuePreview: value.substring(0, 100) + '...',
        timestamp: new Date().toISOString()
      })
    }
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const save = async () => {
    try {
      // Validation
      if (!formData.name.trim()) {
        toast({
          title: "Lỗi",
          description: "Vui lòng nhập tên sản phẩm",
          variant: "destructive",
        })
        return
      }

      // Validation cho content (tùy chọn)
      if (!formData.content.trim()) {
        toast({
          title: "Cảnh báo",
          description: "Nội dung chi tiết đang để trống. Bạn có muốn tiếp tục không?",
          variant: "default",
        })
        // Không return để cho phép lưu với content trống
      }

      setSaving(true)
      
      // Cập nhật category_ids từ selectedCategoryIds
      const payload = {
        ...formData,
        category_ids: selectedCategoryIds
      }

      console.log('💾 Saving product with content length:', formData.content.length)
      console.log('📝 Content preview:', formData.content.substring(0, 100) + '...')

      const url = isEditMode ? `/api/product/${id}` : "/api/product"
      const method = isEditMode ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      
      const data = await res.json()
      if (!data?.success) {
        throw new Error(data?.message || `${isEditMode ? 'Update' : 'Create'} product failed`)
      }

      if (isEditMode) {
        // Nếu đang edit, chỉ hiển thị thông báo thành công
        toast({
          title: "Thành công",
          description: "Cập nhật sản phẩm thành công!",
        })
      } else {
        // Nếu đang tạo mới, reset form và clear draft
        setFormData({
          name: "",
          description: "",
          content: "",
          main_img: "",
          sub_img: [],
          category_ids: []
        })
        setSelectedCategoryIds([])
        localStorage.removeItem('product-draft') // Clear draft
        localStorage.removeItem('product-content-draft') // Clear content draft
        toast({
          title: "Thành công",
          description: "Tạo sản phẩm thành công!",
        })
      }
    } catch (e) {
      console.error(e)
      toast({
        title: "Lỗi",
        description: `Lỗi: ${e instanceof Error ? e.message : 'Unknown error'}`,
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!id) return;
    if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
      try {
        setSaving(true);
        const res = await fetch(`/api/product/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        if (data?.success) {
          toast({
            title: "Thành công",
            description: "Xóa sản phẩm thành công!",
          })
          router.back(); // Go back to the list page
        } else {
          throw new Error(data?.message || "Xóa sản phẩm thất bại");
        }
      } catch (e) {
        console.error(e);
        toast({
          title: "Lỗi",
          description: `Lỗi: ${e instanceof Error ? e.message : 'Unknown error'}`,
          variant: "destructive",
        })
      } finally {
        setSaving(false);
      }
    }
  };

  const Gallery = useMemo(
    () => (
      showGallery ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <OpenImageMetadataDialog
            onSelect={(img) => {
              if (showGallery === "main") {
                updateFormField('main_img', img.public_id)
              }
              if (showGallery === "sub") {
                const newSubImgs = [...formData.sub_img, img.public_id]
                updateFormField('sub_img', newSubImgs)
              }
            }}
            closeDialog={() => setShowGallery(null)}
            isOpen={true}
          />
        </div>
      ) : null
    ),
    [showGallery, formData.sub_img]
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" disabled>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
            <div>
              <div className="h-8 bg-gray-200 rounded animate-pulse w-48"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-64 mt-2"></div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-10 bg-gray-200 rounded animate-pulse w-24"></div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
            <h1 className="text-2xl font-bold">Lỗi</h1>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="text-red-500 text-lg">{error}</div>
              <Button onClick={() => fetchProductData()}>Thử lại</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <NavbarAdmin 
        name={isEditMode ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm"}
        description={isEditMode ? "Cập nhật thông tin sản phẩm hiện có" : "Tạo sản phẩm mới cho website"}
        showBackButton={true}
        buttonTool={
          <div className="flex items-center gap-2">
            {!isEditMode && (
              <Button 
                variant="outline" 
                onClick={() => {
                  if (confirm("Bạn có chắc chắn muốn xóa bản nháp?")) {
                    localStorage.removeItem('product-draft')
                    setFormData({
                      name: "",
                      description: "",
                      content: "",
                      main_img: "",
                      sub_img: [],
                      category_ids: []
                    })
                    setSelectedCategoryIds([])
                    toast({
                      title: "Thành công",
                      description: "Đã xóa bản nháp",
                    })
                  }
                }}
                disabled={saving}
              >
                Xóa bản nháp
              </Button>
            )}
            {isEditMode && (
              <Button 
                variant="destructive" 
                onClick={handleDelete}
                disabled={saving}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Xóa
              </Button>
            )}
            <Button onClick={save} disabled={saving}>
              <Save className="h-4 w-4 mr-2" /> 
              {saving ? "Đang lưu..." : (isEditMode ? "Cập nhật" : "Lưu")}
            </Button>
          </div>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Thông tin cơ bản</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Tên sản phẩm</Label>
            <Input 
              value={formData.name} 
              onChange={(e) => updateFormField('name', e.target.value)} 
            />
          </div>
          <div className="md:col-span-2">
            <Label>Mô tả</Label>
            <Textarea 
              value={formData.description} 
              onChange={(e) => updateFormField('description', e.target.value)} 
              rows={3} 
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ImageIcon className="h-5 w-5" /> Ảnh chính</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            {formData.main_img ? (
              <CldImage src={formData.main_img} width={300} height={160} alt="main" className="rounded-md object-cover" />
            ) : (
              <div className="w-[300px] h-[160px] bg-gray-100 rounded-md flex items-center justify-center text-gray-500">Chưa chọn</div>
            )}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowGallery("main")}>Chọn từ thư viện</Button>
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Hoặc tải ảnh mới</div>
            <ImageUploader />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Images className="h-5 w-5" /> Ảnh phụ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {formData.sub_img.map((pid, idx) => (
              <div key={`${pid}-${idx}`} className="relative">
                <CldImage src={pid} width={300} height={160} alt={`sub-${idx}`} className="rounded-md object-cover w-full h-40" />
                <Button size="icon" variant="destructive" className="absolute top-2 right-2 text-white" onClick={() => removeSubAt(idx)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" onClick={() => setShowGallery("sub")}>Thêm ảnh</Button>
          </div>
          <Separator />
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Hoặc tải ảnh mới</div>
            <ImageUploader />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><FolderTree className="h-5 w-5" /> Danh mục</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {categoriesLoading ? (
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {categories.map((c) => (
                <Button
                  key={c.id}
                  type="button"
                  variant={selectedCategoryIds.includes(c.id) ? "default" : "outline"}
                  onClick={() => toggleCategory(c.id)}
                  className="justify-start"
                >
                  {c.name}
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Nội dung chi tiết</CardTitle>
        </CardHeader>
        <CardContent>
          <ContentEditor 
            value={formData.content}
            onChange={(value) => updateFormField('content', value)}
            storageKey="product-content-draft"
          />
        </CardContent>
      </Card>

      {Gallery}
    </div>
  )
}


