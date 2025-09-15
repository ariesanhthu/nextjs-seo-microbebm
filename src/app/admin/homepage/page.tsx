"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Save, Globe, FileText, Sliders, Package, NotebookPen } from "lucide-react"
import { HomepageResponseDto, UpdateHomepageDto, HomepageFooter } from "@/lib/dto/homepage.dto"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import NavbarAdmin from "@/components/NavbarAdmin"
import { toast } from "sonner"

// Import các component mới
import WebsiteSection from "@/features/admin/components/website-section"
import ContentSection from "@/features/admin/components/content-section"
import SliderSection from "@/features/admin/components/slider-section"
import ProductsSection from "@/features/admin/components/products-section"
import BlogsSection from "@/features/admin/components/blogs-section"

export default function AdminHomepagePage() {
  const [loading, setLoading] = useState<boolean>(true)
  const [saving, setSaving] = useState<boolean>(false)
  const [form, setForm] = useState<HomepageResponseDto | null>(null)
  const [activeSection, setActiveSection] = useState<string>("website")

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
        product_ids: form?.products?.map(p => p.id) || [],
        blog_ids: form?.blogs?.map(b => b.id) || []
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
        return <WebsiteSection form={form} setForm={setForm} />
      
      case "content":
        return <ContentSection form={form} setForm={setForm} />
      
      case "slider":
        return <SliderSection form={form} setForm={setForm} />
      
      case "products":
        return <ProductsSection form={form} setForm={setForm} />
      
      case "blogs":
        return <BlogsSection form={form} setForm={setForm} />
      
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


