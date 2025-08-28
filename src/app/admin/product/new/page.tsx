"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Save, Trash2, Image as ImageIcon, Images, FolderTree } from "lucide-react"
import OpenImageMetadataDialog from "@/features/image-storage/components/open-image-diaglog"
import ImageUploader from "@/features/image-storage/components/image-uploader"
import { CldImage } from "next-cloudinary"

type CategoryItem = { id: string; name: string }

export default function AdminCreateProductPage() {
  const [saving, setSaving] = useState(false)
  const [showGallery, setShowGallery] = useState<null | "main" | "sub">(null)
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([])

  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [description, setDescription] = useState("")
  const [content, setContent] = useState("")
  const [mainImg, setMainImg] = useState("")
  const [subImgs, setSubImgs] = useState<string[]>([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/category?limit=100&sort=ASC")
        const data = await res.json()
        if (data?.success) {
          const list = (data.data || []).map((c: any) => ({ id: c.id, name: c.name }))
          setCategories(list)
        }
      } catch (e) {
        console.error(e)
      }
    }
    fetchCategories()
  }, [])

  const removeSubAt = (idx: number) => setSubImgs((arr) => arr.filter((_, i) => i !== idx))

  const toggleCategory = (id: string) => {
    setSelectedCategoryIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const save = async () => {
    try {
      setSaving(true)
      const payload = {
        name,
        slug,
        description,
        main_img: mainImg,
        sub_img: subImgs,
        category_ids: selectedCategoryIds,
      }
      const res = await fetch("/api/product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!data?.success) {
        throw new Error(data?.message || "Create product failed")
      }
      // reset form quickly
      setName("")
      setSlug("")
      setDescription("")
      setContent("")
      setMainImg("")
      setSubImgs([])
      setSelectedCategoryIds([])
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
              if (showGallery === "main") setMainImg(img.public_id)
              if (showGallery === "sub") setSubImgs((arr) => [...arr, img.public_id])
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
        <h1 className="text-2xl font-bold">Thêm sản phẩm</h1>
        <Button onClick={save} disabled={saving}>
          <Save className="h-4 w-4 mr-2" /> {saving ? "Đang lưu..." : "Lưu"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin cơ bản</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Tên sản phẩm</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label>Slug</Label>
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <Label>Mô tả</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ImageIcon className="h-5 w-5" /> Ảnh chính</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            {mainImg ? (
              <CldImage src={mainImg} width={300} height={160} alt="main" className="rounded-md object-cover" />
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
            {subImgs.map((pid, idx) => (
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
        </CardContent>
      </Card>

      {/* Optional content field kept in UI but not sent (Create schema doesn't include 'content') */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Nội dung chi tiết</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={8} />
        </CardContent>
      </Card> */}

      {Gallery}
    </div>
  )
}


