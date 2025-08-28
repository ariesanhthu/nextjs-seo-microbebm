"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Plus, Save, Trash2, Image as ImageIcon, Images } from "lucide-react"
import OpenImageMetadataDialog from "@/features/image-storage/components/open-image-diaglog"
import ImageUploader from "@/features/image-storage/components/image-uploader"
import { CldImage } from "next-cloudinary"

type NavItem = { title: string; url: string }
type FooterForm = {
  vi_name: string
  en_name: string
  tax_code: string
  short_name: string
  owner: string
  address: string
  email: string
  phone: string
  working_time: string
  fanpage: string
  address_link: string
}

type HomepageForm = {
  id?: string
  navigation_bar: NavItem[]
  footer: FooterForm
  slider: string[]
  banner?: string
}

export default function AdminHomepagePage() {
  const [loading, setLoading] = useState<boolean>(true)
  const [saving, setSaving] = useState<boolean>(false)
  const [showGallery, setShowGallery] = useState<null | "banner" | "slider">(null)
  const [form, setForm] = useState<HomepageForm>({
    navigation_bar: [],
    footer: {
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
      address_link: "",
    },
    slider: [],
    banner: "",
  })

  // Load homepage data first
  useEffect(() => {
    const fetchHomepage = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/homepage", { cache: "no-store" })
        const data = await res.json()
        if (data?.success) {
          const hp = data.data
          setForm((prev) => ({
            ...prev,
            id: hp?.id,
            navigation_bar: hp?.navigation_bar || [],
            footer: hp?.footer || prev.footer,
            slider: hp?.slider || [],
            banner: hp?.banner || "",
          }))
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchHomepage()
  }, [])

  const onChangeFooter = (key: keyof FooterForm, value: string) => {
    setForm((f) => ({ ...f, footer: { ...f.footer, [key]: value } }))
  }

  const addNav = () => setForm((f) => ({ ...f, navigation_bar: [...f.navigation_bar, { title: "", url: "" }] }))
  const removeNav = (idx: number) => setForm((f) => ({ ...f, navigation_bar: f.navigation_bar.filter((_, i) => i !== idx) }))
  const updateNav = (idx: number, key: keyof NavItem, value: string) =>
    setForm((f) => ({
      ...f,
      navigation_bar: f.navigation_bar.map((it, i) => (i === idx ? { ...it, [key]: value } : it)),
    }))

  const addSlider = (publicId: string) => setForm((f) => ({ ...f, slider: [...f.slider, publicId] }))
  const removeSlider = (idx: number) => setForm((f) => ({ ...f, slider: f.slider.filter((_, i) => i !== idx) }))

  const save = async () => {
    try {
      setSaving(true)
      const payload: any = {
        navigation_bar: form.navigation_bar,
        footer: form.footer,
        slider: form.slider,
        // Not part of schema originally; ignore banner if backend doesn't support
      }
      const url = form.id ? `/api/homepage/${form.id}` : "/api/homepage"
      const method = form.id ? "PUT" : "POST"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form.id ? payload : { ...payload, product_ids: [] }),
      })
      const data = await res.json()
      if (data?.success) {
        if (!form.id && data?.data?.id) {
          setForm((f) => ({ ...f, id: data.data.id }))
        }
      } else {
        throw new Error(data?.message || "Save failed")
      }
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  const Gallery = useMemo(
    () => (
      showGallery ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <OpenImageMetadataDialog
            onSelect={(img) => {
              if (showGallery === "banner") {
                setForm((f) => ({ ...f, banner: img.public_id }))
              } else if (showGallery === "slider") {
                addSlider(img.public_id)
              }
            }}
            closeDialog={() => setShowGallery(null)}
            isOpen={true}
          />
        </div>
      ) : null
    ),
    [showGallery]
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tùy chỉnh trang chủ</h1>
        <Button onClick={save} disabled={saving}>
          <Save className="h-4 w-4 mr-2" /> {saving ? "Đang lưu..." : form.id ? "Cập nhật" : "Tạo mới"}
        </Button>
      </div>

      {loading ? (
        <div>Đang tải...</div>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ImageIcon className="h-5 w-5" /> Ảnh Banner</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                {form.banner ? (
                  <CldImage src={form.banner} width={300} height={120} alt="banner" className="rounded-md object-cover" />
                ) : (
                  <div className="w-[300px] h-[120px] bg-gray-100 rounded-md flex items-center justify-center text-gray-500">Chưa chọn</div>
                )}
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowGallery("banner")}>Chọn từ thư viện</Button>
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
              <CardTitle className="flex items-center gap-2"><Images className="h-5 w-5" /> Ảnh Slider</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {form.slider.map((pid, idx) => (
                  <div key={`${pid}-${idx}`} className="relative">
                    <CldImage src={pid} width={300} height={160} alt={`slide-${idx}`} className="rounded-md object-cover w-full h-40" />
                    <Button size="icon" variant="destructive" className="absolute top-2 right-2 text-white" onClick={() => removeSlider(idx)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" onClick={() => setShowGallery("slider")}>Thêm ảnh</Button>
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
              <CardTitle>Navigation Bar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {form.navigation_bar.map((nav, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                  <div className="md:col-span-2">
                    <Label htmlFor={`nav-title-${idx}`}>Tiêu đề</Label>
                    <Input id={`nav-title-${idx}`} value={nav.title} onChange={(e) => updateNav(idx, "title", e.target.value)} />
                  </div>
                  <div className="md:col-span-3">
                    <Label htmlFor={`nav-url-${idx}`}>URL</Label>
                    <Input id={`nav-url-${idx}`} value={nav.url} onChange={(e) => updateNav(idx, "url", e.target.value)} />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="destructive" className="text-white" onClick={() => removeNav(idx)}>
                      <Trash2 className="h-4 w-4 mr-2" /> Xóa
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
                <Input value={form.footer.vi_name} onChange={(e) => onChangeFooter("vi_name", e.target.value)} />
              </div>
              <div>
                <Label>Tên (EN)</Label>
                <Input value={form.footer.en_name} onChange={(e) => onChangeFooter("en_name", e.target.value)} />
              </div>
              <div>
                <Label>Mã số thuế</Label>
                <Input value={form.footer.tax_code} onChange={(e) => onChangeFooter("tax_code", e.target.value)} />
              </div>
              <div>
                <Label>Tên viết tắt</Label>
                <Input value={form.footer.short_name} onChange={(e) => onChangeFooter("short_name", e.target.value)} />
              </div>
              <div>
                <Label>Chủ sở hữu</Label>
                <Input value={form.footer.owner} onChange={(e) => onChangeFooter("owner", e.target.value)} />
              </div>
              <div>
                <Label>Địa chỉ</Label>
                <Input value={form.footer.address} onChange={(e) => onChangeFooter("address", e.target.value)} />
              </div>
              <div>
                <Label>Email</Label>
                <Input value={form.footer.email} onChange={(e) => onChangeFooter("email", e.target.value)} />
              </div>
              <div>
                <Label>Điện thoại</Label>
                <Input value={form.footer.phone} onChange={(e) => onChangeFooter("phone", e.target.value)} />
              </div>
              <div>
                <Label>Thời gian làm việc</Label>
                <Input value={form.footer.working_time} onChange={(e) => onChangeFooter("working_time", e.target.value)} />
              </div>
              <div>
                <Label>Fanpage</Label>
                <Input value={form.footer.fanpage} onChange={(e) => onChangeFooter("fanpage", e.target.value)} />
              </div>
              <div>
                <Label>Link địa chỉ</Label>
                <Input value={form.footer.address_link} onChange={(e) => onChangeFooter("address_link", e.target.value)} />
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {Gallery}
    </div>
  )
}


