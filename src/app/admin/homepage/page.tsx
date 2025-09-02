"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Plus, Save, Trash2, Image as ImageIcon, Images, Globe, FileText, Sliders, Package, NotebookPen, BookOpen } from "lucide-react"
import { HomepageFooter, HomepageNavigationBar, HomepageResponseDto, UpdateHomepageDto } from "@/lib/dto/homepage.dto"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

import { ProductResponseDto } from "@/lib/dto/product.dto"

import NavbarAdmin from "@/components/NavbarAdmin"

import ImageWithMetadata from "@/components/ui/image-with-metadata"
import ImageUploader from "@/features/image-storage/components/image-uploader"
import { useImageGallery } from "@/features/image-storage/context/image-gallery-context"
import { ImageMetadataResponseDto } from "@/lib/dto/image-metadata.dto"

import { toast } from "sonner"
import { useBlogGallery } from "@/features/blog/context/blog-gallery-context"
import { BlogResponseDto } from "@/lib/dto/blog.dto"
import { useProductGallery } from "@/features/product/context/product-gallery-context"
import { set } from "zod"

export default function AdminHomepagePage() {
  const [loading, setLoading] = useState<boolean>(true)
  const [saving, setSaving] = useState<boolean>(false)
  const [form, setForm] = useState<HomepageResponseDto | null>(null)
  const [activeSection, setActiveSection] = useState<string>("website")
  const [showProductDialog, setShowProductDialog] = useState<boolean>(false)
  const [showBlogDialog, setShowBlogDialog] = useState<boolean>(false)

  // Use image gallery context
  const imageGallery = useImageGallery();
  const blogGallery = useBlogGallery();
  const productGallery = useProductGallery();

  // Load homepage data first
  useEffect(() => {
    const fetchHomepage = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/homepage", { cache: "no-store" })
        const data = await res.json()
        if (data?.success) {
          setForm(data.data);
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchHomepage()
  }, [])

  const onChangeFooter = (key: keyof HomepageFooter, value: string) => {
    if (form) {
      setForm({
        ...form,
        footer: {
          vi_name: form.footer?.vi_name || "",
          en_name: form.footer?.en_name || "",
          tax_code: form.footer?.tax_code || "",
          short_name: form.footer?.short_name || "",
          owner: form.footer?.owner || "",
          address: form.footer?.address || "",
          email: form.footer?.email || "",
          phone: form.footer?.phone || "",
          working_time: form.footer?.working_time || "",
          fanpage: form.footer?.fanpage || "",
          address_link: form.footer?.address_link || "",
          [key]: value
        }
      })
    }
  }

  const onChangeContent = (key: "title" | "subtitle", value: string) => {
    if (form) {
      setForm({
        ...form,
        [key]: value
      })
    }
  }

  const addNav = () => {
    if (form) {
      setForm({
        ...form,
        navigation_bar: [...(form.navigation_bar || []), { title: "", url: "" }]
      })
      toast.success("Đã thêm menu mới")
    }
  }
  const removeNav = (idx: number) => {
    if (form) {
      setForm({
        ...form,
        navigation_bar: (form.navigation_bar || []).filter((_, i) => i !== idx)
      })
      toast.success("Đã xóa menu")
    }
  }
  const updateNav = (idx: number, key: keyof HomepageNavigationBar, value: string) => {
    if (form) {
      setForm({
        ...form,
        navigation_bar: (form.navigation_bar || []).map((it, i) => (i === idx ? { ...it, [key]: value } : it)),
      })
    }
  }

  const addSlider = (publicId: string, title: string = "", description: string = "") => {
    if (form) {
      setForm({
        ...form,
        slider: [...(form.slider || []), { image_url: publicId, title, description }]
      })
      toast.success("Đã thêm ảnh vào slider")
    }
  }
  const removeSlider = (idx: number) => {
    if (form) {
      setForm({
        ...form,
        slider: (form.slider || []).filter((_, i) => i !== idx)
      })
      toast.success("Đã xóa ảnh slider")
    }
  }

  const removeBanner = (idx: number) => {
    if (form) {
      setForm({
        ...form,
        banner: (form.banner || []).filter((_, i) => i !== idx)
      })
      toast.success("Đã xóa ảnh banner")
    }
  }

  const handleSelectBanner = () => {
    imageGallery.openDialog((image: ImageMetadataResponseDto) => {
      if (form) {
        setForm({
          ...form,
          banner: [...(form.banner || []), image.public_id]
        })
        toast.success("Đã thêm ảnh vào banner")
      }
    })
  }

  const handleSelectSlider = () => {
    imageGallery.openDialog((image: ImageMetadataResponseDto) => {
      addSlider(image.public_id)
    })
  }

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

  const handleBlogSelection = () => {
    blogGallery.openSelectionDialog(form?.blogs || [], (selected) => {
      if (form) {
        setForm({
          ...form,
          blogs: selected
        })
        toast.success(`Đã chọn ${selected.length} bài viết nổi bật`)
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

  const removeBlog = (blogId: string) => {
    if (form) {
      setForm({
        ...form,
        blogs: (form.blogs || []).filter(b => b.id !== blogId)
      })
      toast.success("Đã xóa bài viết khỏi danh sách nổi bật")
    }
  }

  const save = async () => {
    try {
      setSaving(true)
      const payload: UpdateHomepageDto = {
        title: form?.title,
        subtitle: form?.subtitle,
        banner: form?.banner || [],
        navigation_bar: form?.navigation_bar || [],
        footer: form?.footer || {
          vi_name: "",
          en_name: "",
          tax_code: "",
          short_name: "",
          owner: "",
          address: "",
          email: "",
          phone: "",
          working_time: "",
          fanpage: "",
          address_link: ""
        },
        slider: form?.slider || [],
        product_ids: form?.products?.map(p => p.id) || []
      }

      // Ensure footer has all required fields, even if empty
      const footer = payload.footer as HomepageFooter;
      payload.footer = {
        vi_name: footer.vi_name || "",
        en_name: footer.en_name || "",
        tax_code: footer.tax_code || "",
        short_name: footer.short_name || "",
        owner: footer.owner || "",
        address: footer.address || "",
        email: footer.email || "",
        phone: footer.phone || "",
        working_time: footer.working_time || "",
        fanpage: footer.fanpage || "",
        address_link: footer.address_link || ""
      };

      const url = form?.id ? `/api/homepage/${form.id}` : "/api/homepage"
      const method = form?.id ? "PUT" : "POST"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (data?.success) {
        if (!form?.id && data?.data?.id) {
          setForm(data.data)
        }
        toast.success(form?.id ? "Cập nhật trang chủ thành công" : "Tạo trang chủ thành công")
      } else {
        toast.error(data?.message || "Lưu trang chủ thất bại")
        throw new Error(data?.message || "Save failed")
      }
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  const renderSection = () => {
    switch (activeSection) {
      case "website":
        return (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5" /> Navigation Bar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(form?.navigation_bar || []).map((nav, idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                    <div className="md:col-span-2">
                      <Label htmlFor={`nav-title-${idx}`}>Tiêu đề</Label>
                      <Input id={`nav-title-${idx}`} value={nav.title} onChange={(e) => updateNav(idx, "title" as keyof HomepageNavigationBar, e.target.value)} />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor={`nav-url-${idx}`}>URL</Label>
                      <Input id={`nav-url-${idx}`} value={nav.url} onChange={(e) => updateNav(idx, "url" as keyof HomepageNavigationBar, e.target.value)} />
                    </div>
                    <div className="flex justify-start">
                      <Button variant="destructive" className="text-white" onClick={() => removeNav(idx)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" onClick={addNav}><Plus className="h-4 w-4 mr-2" /> Thêm menu</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Footer</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Tên (VI)</Label>
                  <Input value={form?.footer?.vi_name || ""} onChange={(e) => onChangeFooter("vi_name", e.target.value)} />
                </div>
                <div>
                  <Label>Tên (EN)</Label>
                  <Input value={form?.footer?.en_name || ""} onChange={(e) => onChangeFooter("en_name", e.target.value)} />
                </div>
                <div>
                  <Label>Mã số thuế</Label>
                  <Input value={form?.footer?.tax_code || ""} onChange={(e) => onChangeFooter("tax_code", e.target.value)} />
                </div>
                <div>
                  <Label>Tên viết tắt</Label>
                  <Input value={form?.footer?.short_name || ""} onChange={(e) => onChangeFooter("short_name", e.target.value)} />
                </div>
                <div>
                  <Label>Chủ sở hữu</Label>
                  <Input value={form?.footer?.owner || ""} onChange={(e) => onChangeFooter("owner", e.target.value)} />
                </div>
                <div>
                  <Label>Địa chỉ</Label>
                  <Input value={form?.footer?.address || ""} onChange={(e) => onChangeFooter("address", e.target.value)} />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input value={form?.footer?.email || ""} onChange={(e) => onChangeFooter("email", e.target.value)} />
                </div>
                <div>
                  <Label>Điện thoại</Label>
                  <Input value={form?.footer?.phone || ""} onChange={(e) => onChangeFooter("phone", e.target.value)} />
                </div>
                <div>
                  <Label>Thời gian làm việc</Label>
                  <Input value={form?.footer?.working_time || ""} onChange={(e) => onChangeFooter("working_time", e.target.value)} />
                </div>
                <div>
                  <Label>Fanpage</Label>
                  <Input value={form?.footer?.fanpage || ""} onChange={(e) => onChangeFooter("fanpage", e.target.value)} />
                </div>
                                  <div>
                    <Label>Link địa chỉ</Label>
                    <Input value={form?.footer?.address_link || ""} onChange={(e) => onChangeFooter("address_link", e.target.value)} />
                  </div>
              </CardContent>
            </Card>
          </>
        )
      
      case "content":
        return (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" /> Thông tin chung</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Tiêu đề chính</Label>
                  <Input 
                    id="title" 
                    value={form?.title || ""} 
                    onChange={(e) => onChangeContent("title", e.target.value)}
                    placeholder="Nhập tiêu đề chính của website"
                  />
                </div>
                <div>
                  <Label htmlFor="subtitle">Tiêu đề phụ</Label>
                  <Input 
                    id="subtitle" 
                    value={form?.subtitle || ""} 
                    onChange={(e) => onChangeContent("subtitle", e.target.value)}
                    placeholder="Nhập tiêu đề phụ của website"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><ImageIcon className="h-5 w-5" /> Ảnh Banner</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  {
                    (form?.banner || []).map((img, idx) => (
                      <div key={idx} className="relative">
                        <ImageWithMetadata 
                          src={img} 
                          width={300} 
                          height={120} 
                          alt={`banner-${idx}`} 
                          className="rounded-md object-cover" 
                        />
                        <Button size="icon" variant="destructive" className="absolute top-2 right-2 text-white" onClick={() => removeBanner(idx)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleSelectBanner}>Chọn từ thư viện</Button>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="text-sm text-foreground">Hoặc tải ảnh mới</div>
                  <ImageUploader />
                </div>
              </CardContent>
            </Card>
          </>
        )
      
      case "slider":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Sliders className="h-5 w-5" /> Ảnh Slider</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(form?.slider || []).map(({ title, description, image_url }, idx) => (
                  <div key={`${image_url}-${idx}`} className="relative">
                    <ImageWithMetadata 
                      src={image_url} 
                      width={300} 
                      height={160} 
                      alt={`slide-${idx}`} 
                      className="rounded-md object-cover w-full h-40" 
                    />
                    <Button size="icon" variant="destructive" className="absolute top-2 right-2 text-white" onClick={() => removeSlider(idx)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" onClick={handleSelectSlider}>Thêm ảnh</Button>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="text-sm text-foreground">Hoặc tải ảnh mới</div>
                <ImageUploader />
              </div>
            </CardContent>
          </Card>
        )
      
      case "products":
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
                          <div className="w-16 h-16 flex-shrink-0">
                            {product.main_img ? (
                              <ImageWithMetadata
                                src={product.main_img}
                                width={64}
                                height={64}
                                alt={product.name}
                                className="rounded-md object-cover w-full h-full"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
                                <Package className="h-8 w-8 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
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
      
      case "blogs":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><NotebookPen className="h-5 w-5" /> Bài viết nổi bật</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Đã chọn {form?.blogs?.length || 0} bài viết
                </div>
                <Button variant="outline" onClick={handleBlogSelection}>
                  <Plus className="h-4 w-4 mr-2" />
                  {form?.blogs?.length ? "Chỉnh sửa" : "Thêm bài viết"}
                </Button>
              </div>

              {(form?.blogs || []).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(form?.blogs || []).map((blog) => (
                    <Card key={blog.id} className="relative">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 flex-shrink-0">
                            {blog.thumbnail_url ? (
                              <ImageWithMetadata
                                src={blog.thumbnail_url}
                                width={64}
                                height={64}
                                alt={blog.thumbnail_url}
                                className="rounded-md object-cover w-full h-full"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
                                <Package className="h-8 w-8 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{blog.title}</h4>
                            <p className="text-xs text-gray-500 truncate">
                              {blog.excerpt || "Không có mô tả"}
                            </p>
                            {blog.tags && blog.tags.length > 0 && (
                              <span className="text-xs text-blue-600 font-medium">
                                {blog.tags[0].name}
                              </span>
                            )}
                          </div>
                          <Button
                            size="icon"
                            variant="destructive"
                            className="h-6 w-6 text-white"
                            onClick={() => removeBlog(blog.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <BookOpen className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>Chưa có bài viết nào được chọn</p>
                  <p className="text-sm">Nhấn "Thêm bài viết" để bắt đầu</p>
                </div>
              )}
            </CardContent>
          </Card>
        )
      
      case "blogs":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><NotebookPen className="h-5 w-5" /> Bài viết nổi bật</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Đã chọn {form?.blogs?.length || 0} bài viết
                </div>
                <Button variant="outline" onClick={handleBlogSelection}>
                  <Plus className="h-4 w-4 mr-2" />
                  {form?.blogs?.length ? "Chỉnh sửa" : "Thêm bài viết"}
                </Button>
              </div>

              {(form?.blogs || []).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(form?.blogs || []).map((blog) => (
                    <Card key={blog.id} className="relative">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 flex-shrink-0">
                            {blog.thumbnail_url ? (
                              <ImageWithMetadata
                                src={blog.thumbnail_url}
                                width={64}
                                height={64}
                                alt={blog.thumbnail_url}
                                className="rounded-md object-cover w-full h-full"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
                                <Package className="h-8 w-8 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{blog.title}</h4>
                            <p className="text-xs text-gray-500 truncate">
                              {blog.excerpt || "Không có mô tả"}
                            </p>
                            {blog.tags && blog.tags.length > 0 && (
                              <span className="text-xs text-blue-600 font-medium">
                                {blog.tags[0].name}
                              </span>
                            )}
                          </div>
                          <Button
                            size="icon"
                            variant="destructive"
                            className="h-6 w-6 text-white"
                            onClick={() => removeBlog(blog.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <BookOpen className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>Chưa có bài viết nào được chọn</p>
                  <p className="text-sm">Nhấn "Thêm bài viết" để bắt đầu</p>
                </div>
              )}
            </CardContent>
          </Card>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <NavbarAdmin 
        name="Tùy chỉnh trang chủ"
        description="Chỉnh sửa nội dung, slider và cấu hình trang chủ"
        buttonTool={
          <Button onClick={save} disabled={saving}>
            <Save className="h-4 w-4 mr-2" /> {saving ? "Đang lưu..." : form?.id ? "Cập nhật" : "Cập nhật"}
          </Button>
        }
      />

      {loading ? (
        <div className="px-4">Đang tải...</div>
      ) : (
        <>
          <div className="px-4">
            <ToggleGroup type="single" value={activeSection} onValueChange={(value) => value && setActiveSection(value)}>
              <ToggleGroupItem value="website" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Website
              </ToggleGroupItem>
              <ToggleGroupItem value="content" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Nội dung
              </ToggleGroupItem>
              <ToggleGroupItem value="slider" className="flex items-center gap-2">
                <Sliders className="h-4 w-4" />
                Slider
              </ToggleGroupItem>
              <ToggleGroupItem value="products" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Sản phẩm
              </ToggleGroupItem>
              <ToggleGroupItem value="blogs" className="flex items-center gap-2">
                <NotebookPen className="h-4 w-4" />
                Bài viết
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div className="space-y-6 px-4">
            {renderSection()}
          </div>
        </>
      )}
    </div>
  )
}


