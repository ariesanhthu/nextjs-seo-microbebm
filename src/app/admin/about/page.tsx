'use client'
import { Button } from "@/components/tiptap-ui-primitive/button"
import { useEffect, useState } from "react"
import { Save } from "lucide-react"
import { toast } from "sonner"

import { AboutResponseDto, UpdateAboutDto, SubsectionDto } from "@/lib/dto/about.dto"
import { EStyleSection } from "@/lib/enums/style-section.enum"
import { Timestamp } from "firebase-admin/firestore"
import NavbarAdmin from "@/components/NavbarAdmin"

// Example 
// const s: SubsectionDto = [
//   {
//     name: "",
//     description: "",
//     ref: "",
//     image_url: "",
//     icon: ""
//   },
//   {
//     name: "",
//     description: "",
//     ref: null,
//     image_url: null,
//     icon: null
//   },
// ]

// const about: AboutResponseDto = {
//   id: "1",
//   created_at: Timestamp.fromDate(new Date("2023-01-01")),
//   // {
//   //   seconds: 1620000000,
//   //   nanoseconds: 0
//   // },
//   updated_at: Timestamp.fromDate(new Date()),
//   // {
//   //   seconds: 1620000000,
//   //   nanoseconds: 0
//   // }
//   //},
//   section: [
//     {
//       title: "About Us",
//       subtitle: "This is the about us page content.",
//       subsection: [
//         {
//           name: "Our Mission",
//           description: "To provide the best service possible.",
//           ref: "our-mission",
//           image_url: "https://example.com/mission.jpg",
//           icon: "mission-icon"
//         },
//         {
//           name: "Our Vision",
//           description: "To be the leading company in our industry.",
//           ref: "our-vision",
//           image_url: "https://example.com/vision.jpg",
//           icon: "vision-icon"
//         }
//       ],
//       style: EStyleSection.NOIMAGE
//     }
//   ]
// }

export default function AdminHomepagePage() {
  const [loading, setLoading] = useState<boolean>(true)
  const [saving, setSaving] = useState<boolean>(false)
  const [showGallery, setShowGallery] = useState<null | "banner" | "slider">(null)
  const [form, setForm] = useState<AboutResponseDto | null>(null)

  // Load homepage data first
  useEffect(() => {
    const fetchHomepage = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/about", { cache: "no-store" });
        const data = await res.json();
        if (data?.success) {
          setForm(data.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchHomepage().then(() => {
      console.log(form);
    }
    );
  }, [])

  const save = async () => {
    if (!form) {
      return
    }
    try {
      setSaving(true);
      const payload: UpdateAboutDto = {
        section: [...form.section]
      };

      const url = form?.id ? `/api/about/${form.id}` : "/api/about";
      const method = form?.id ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data?.success) {
        if (!form?.id && data?.data?.id) {
          setForm(data.data);
        }
        toast.success(form?.id ? "Cập nhật trang Giới thiệu thành công" : "Tạo trang Giới thiệu thành công");
      } else {
        toast.error(data?.message || "Lưu trang Giới thiệu thất bại");
        throw new Error(data?.message || "Save failed");
      }
    } catch (e) {
      console.error(e);
      toast.error("Có lỗi xảy ra khi lưu trang Giới thiệu");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <NavbarAdmin 
        name="Quản lý trang Giới thiệu"
        description="Chỉnh sửa nội dung và cấu trúc trang Giới thiệu"
        buttonTool={
          <Button 
            type="button" 
            onClick={save}
            disabled={saving}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        }
      />
      
      <div className="px-4">
        <Button type={"button"} onClick={() => {console.log(form)}}>
          Press
        </Button>
        <h1>Test</h1>
      </div>
    </div>
  )
}