"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Globe } from "lucide-react"
import { HomepageFooter, HomepageNavigationBar, HomepageResponseDto } from "@/lib/dto/homepage.dto"
import { toast } from "sonner"

interface WebsiteSectionProps {
  form: HomepageResponseDto | null
  setForm: (form: HomepageResponseDto | null) => void
}

export default function WebsiteSection({ form, setForm }: WebsiteSectionProps) {
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
}
