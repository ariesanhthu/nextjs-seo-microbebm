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

import ImageUploader from "@/features/image-storage/components/image-uploader"
import { CldImage } from "next-cloudinary"
import { toast } from "sonner"
import ContentEditor from "@/features/blog/components/content-editor"
import { CreateProductDto, UpdateProductDto } from "@/lib/dto/product.dto"
import NavbarAdmin from "@/components/NavbarAdmin"
import { ImageMetadataResponseDto } from "@/lib/dto/image-metadata.dto"
import { useImageGallery } from "@/features/image-storage/context/image-gallery-context"
import { useConfirmation } from "@/features/alert-dialog/context/alert-dialog-context"

type CategoryItem = { id: string; name: string }

export default function AdminCreateProductPage() {
  const params = useParams()
  const router = useRouter()

  const id = params?.id?.[0] // Lấy id từ dynamic route
  
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([])
  const [contentResetKey, setContentResetKey] = useState<number>(0)

  // Use image gallery context
  const imageGallery = useImageGallery()
  
  // Confirmation hook
  const confirmation = useConfirmation()

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

  // Handle clear draft
  const handleClearDraft = async () => {
    const confirmed = await confirmation.delete(
      "Xóa bản nháp",
      "Bạn có chắc chắn muốn xóa bản nháp? Hành động này không thể hoàn tác."
    )

    if (confirmed) {
      localStorage.removeItem('product-content-draft')
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
      setContentResetKey((k) => k + 1)
      toast.success("Đã xóa bản nháp")
    }
  }

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
    if (isEditMode && id) {
      setLoading(true)
      fetch(`/api/product/id/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setFormData({
              name: data.data.name,
              description: data.data.description,
              content: data.data.content,
              main_img: data.data.main_img,
              sub_img: data.data.sub_img,
              category_ids: data.data.category_ids
            })
            setSelectedCategoryIds(data.data.category_ids)
          } else {
            setError(data.message || 'Không thể tải dữ liệu sản phẩm')
          }
        })
        .catch(err => {
          console.error('Error fetching product:', err)
          setError('Lỗi khi tải dữ liệu sản phẩm')
        })
        .finally(() => setLoading(false))
    }
  }, [isEditMode, id])

  // Fetch categories
  useEffect(() => {
    fetch('/api/category')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCategories(data.data)
        }
      })
      .catch(err => {
        console.error('Error fetching categories:', err)
      })
      .finally(() => setCategoriesLoading(false))
  }, [])

  const updateFormField = (field: keyof CreateProductDto, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const toggleCategory = (categoryId: string) => {
    setSelectedCategoryIds(prev => {
      const currentIds = prev || []
      const newIds = currentIds.includes(categoryId)
        ? currentIds.filter(id => id !== categoryId)
        : [...currentIds, categoryId]
      
      updateFormField('category_ids', newIds)
      return newIds
    })
  }

  const handleSelectMainImage = () => {
    imageGallery.openDialog((selectedImage: ImageMetadataResponseDto) => {
      updateFormField('main_img', selectedImage.url)
    })
  }

  const handleSelectSubImage = () => {
    imageGallery.openDialog((selectedImage: ImageMetadataResponseDto) => {
      updateFormField('sub_img', [...formData.sub_img, selectedImage.url])
    })
  }

  const removeSubAt = (index: number) => {
    const newSubImg = formData.sub_img.filter((_, i) => i !== index)
    updateFormField('sub_img', newSubImg)
  }

  const save = async () => {
    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập tên sản phẩm")
      return
    }

    if (!formData.description.trim()) {
      toast.error("Vui lòng nhập mô tả sản phẩm")
      return
    }

    if (!formData.main_img) {
      toast.error("Vui lòng chọn ảnh chính")
      return
    }

    if (!selectedCategoryIds || selectedCategoryIds.length === 0) {
      toast.error("Vui lòng chọn ít nhất một danh mục")
      return
    }

    setSaving(true)

    try {
      const url = isEditMode ? `/api/product/id/${id}` : '/api/product'
      const method = isEditMode ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        toast.success(isEditMode ? "Cập nhật sản phẩm thành công" : "Tạo sản phẩm thành công")
        
        // Clear drafts after successful save
        localStorage.removeItem('product-draft')
        localStorage.removeItem('product-content-draft')
        
        router.push('/admin/product')
      } else {
        toast.error(result.message || 'Có lỗi xảy ra')
      }
    } catch (error) {
      console.error('Error saving product:', error)
      toast.error('Có lỗi xảy ra khi lưu sản phẩm')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      return
    }

    setSaving(true)

    try {
      const response = await fetch(`/api/product/id/${id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        toast.success("Xóa sản phẩm thành công")
        router.push('/admin/product')
      } else {
        toast.error(result.message || 'Có lỗi xảy ra')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Có lỗi xảy ra khi xóa sản phẩm')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
        </div>
      </div>
    )
  }

    return (
    <>
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
                  onClick={handleClearDraft}
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
              <div className="relative">
                {formData.main_img ? (
                  <>
                    <CldImage src={formData.main_img} width={300} height={160} alt="main" className="rounded-md object-cover" />
                    <Button size="icon" variant="destructive" className="absolute top-2 right-2 text-white" onClick={() => updateFormField('main_img', '')}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <div className="w-[300px] h-[160px] bg-gray-100 rounded-md flex items-center justify-center text-gray-500">Chưa chọn</div>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleSelectMainImage}>Chọn từ thư viện</Button>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="text-sm text-foreground">Hoặc tải ảnh mới</div>
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
              <Button variant="outline" onClick={handleSelectSubImage}>Thêm ảnh</Button>
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="text-sm text-foreground">Hoặc tải ảnh mới</div>
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
                    variant={selectedCategoryIds?.includes(c.id) ? "default" : "outline"}
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
              key={`product-content-${contentResetKey}`}
              value={formData.content}
              onChange={(value) => updateFormField('content', value)}
              storageKey="product-content-draft"
            />
          </CardContent>
               </Card>
     </div>
   </>
   )
 }
