"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Trash2, Edit2, Check, X, ImageIcon } from "lucide-react"
import { SubsectionDto } from "@/lib/dto/about.dto"
import { useImageGallery } from "@/features/image-storage/context/image-gallery-context"
import ImageWithMetadata from "@/components/ui/image-with-metadata"
import IconField from "@/features/icon-picker/components/icon-picker-custom"

interface SubsectionEditorProps {
  subsection: SubsectionDto[0]
  index: number
  onUpdate: (updates: Partial<SubsectionDto[0]>) => void
  onDelete: () => void
  showImage?: boolean
  canAddImage?: boolean
  className?: string
  sectionStyle?: number
  isPreview?: boolean
}

export default function SubsectionEditor({ 
  subsection, 
  index, 
  onUpdate, 
  onDelete, 
  showImage = false,
  canAddImage = true,
  className = "",
  sectionStyle = 0,
  isPreview = false
}: SubsectionEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    name: subsection.name,
    description: subsection.description,
    ref: subsection.ref || "",
    icon: subsection.icon || ""
  })
  const { openDialog } = useImageGallery()

  const handleSave = () => {
    onUpdate({
      name: editData.name,
      description: editData.description,
      ref: editData.ref || null,
      icon: editData.icon || null
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditData({
      name: subsection.name,
      description: subsection.description,
      ref: subsection.ref || "",
      icon: subsection.icon || ""
    })
    setIsEditing(false)
  }

  const selectImage = () => {
    openDialog((image) => {
      onUpdate({ image_url: image.url })
    })
  }

  return (
    <div className={`relative group ${className}`}>
      {/* Edit/Delete buttons - chỉ hiện khi hover và không phải preview mode */}
      {!isPreview && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setIsEditing(true)}
              className="h-6 w-6 p-0"
            >
              <Edit2 className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={onDelete}
              className="h-6 w-6 p-0"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      {!isPreview && isEditing && (
        // Edit mode
        <div className="space-y-3 p-4 border-2 border-blue-300 rounded-lg bg-blue-50">
          <IconField
            value={editData.icon}
            onChange={(iconName) => setEditData({ ...editData, icon: iconName || "" })}
            label="Icon"
            placeholder="Chọn icon cho subsection"
            iconSize="w-6 h-6"
          />

          <div>
            <Input
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              placeholder="Tên subsection"
              className="font-medium"
            />
          </div>
          
          <div>
            <Textarea
              value={editData.description}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              placeholder="Mô tả subsection"
              rows={3}
            />
          </div>

          <div>
            <Input
              value={editData.ref}
              onChange={(e) => setEditData({ ...editData, ref: e.target.value })}
              placeholder="Link (tùy chọn)"
            />
          </div>

          
          {showImage && sectionStyle !== 1 && (
            <div>
              <div className="flex items-center gap-2">
                <Input
                  value={subsection.image_url || ""}
                  placeholder="URL hình ảnh"
                  readOnly
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={selectImage}
                  disabled={!canAddImage && !subsection.image_url}
                  size="sm"
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>
              </div>
              {subsection.image_url && (
                <div className="mt-2">
                  <ImageWithMetadata
                    src={subsection.image_url}
                    alt="Preview"
                    width={80}
                    height={80}
                    className="w-20 h-20 object-cover rounded"
                  />
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave}>
              <Check className="h-4 w-4 mr-1" />
              Lưu
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4 mr-1" />
              Hủy
            </Button>
          </div>
        </div>
      ) 
        // // Display mode
        // <div className="p-4 border border-gray-200 rounded-lg b hover:border-gray-300 transition-colors">
        //   {subsection.icon && (
        //     <div className="mb-2">
        //       <IconField
        //         value={subsection.icon}
        //         showPicker={false}
        //         showPreview={true}
        //         iconSize="w-8 h-8"
        //       />
        //     </div>
        //   )}
          
        //   {/* <h4 className="font-medium text-lg mb-2">{subsection.name || "Chưa có tên"}</h4> */}
          
        //   {/* <p className="text-gray-600 mb-3">{subsection.description || "Chưa có mô tả"}</p> */}
          
        //   {subsection.ref && (
        //     <a 
        //       href={subsection.ref} 
        //       target="_blank" 
        //       rel="noopener noreferrer"
        //       className="text-blue-600 hover:text-blue-800 text-sm"
        //     >
        //       Xem thêm →
        //     </a>
        //   )}

        //   {showImage && sectionStyle !== 1 && subsection.image_url && (
        //     <div className="mt-3">
        //       <ImageWithMetadata
        //         src={subsection.image_url}
        //         alt={subsection.name || "Subsection image"}
        //         width={200}
        //         height={150}
        //         className="w-full h-32 object-cover rounded"
        //       />
        //     </div>
        //   )}
        // </div>
        
      }
    </div>
  )
}
