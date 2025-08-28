"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Edit3, Plus, Save, Trash2, X } from "lucide-react"
import { useConfirmation } from "@/features/alert-dialog/context/alert-dialog-context"

type Tag = { id: string; name: string; slug: string }

export default function AdminTagsPage() {
  const { delete: confirmDelete } = useConfirmation()
  const [loading, setLoading] = useState<boolean>(true)
  const [saving, setSaving] = useState<boolean>(false)
  const [list, setList] = useState<Tag[]>([])

  // create form
  const [newName, setNewName] = useState("")

  // inline edit
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")

  const fetchTags = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/tag?limit=100&sort=ASC")
      const data = await res.json()
      if (data?.success) setList(data.data || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTags()
  }, [])

  const createTag = async () => {
    try {
      setSaving(true)
      const res = await fetch("/api/tag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      })
      const data = await res.json()
      if (!data?.success) throw new Error(data?.message || "Create failed")
      setNewName("")
      fetchTags()
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  const startEdit = (tag: Tag) => {
    setEditingId(tag.id)
    setEditName(tag.name)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditName("")
  }

  const saveEdit = async (id: string) => {
    try {
      setSaving(true)
      const res = await fetch(`/api/tag/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName }),
      })
      const data = await res.json()
      if (!data?.success) throw new Error(data?.message || "Update failed")
      cancelEdit()
      fetchTags()
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  const deleteTag = async (id: string) => {
    const ok = await confirmDelete("Xóa thẻ", "Bạn có chắc chắn muốn xóa thẻ này?")
    if (!ok) return
    try {
      setSaving(true)
      const res = await fetch(`/api/tag/${id}`, { method: "DELETE" })
      const data = await res.json()
      if (!data?.success) throw new Error(data?.message || "Delete failed")
      fetchTags()
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quản lý thẻ</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thêm thẻ</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2">
            <Label>Tên thẻ</Label>
            <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nhập tên thẻ" />
          </div>
          <div>
            <Button onClick={createTag} disabled={saving || !newName.trim()}>
              <Plus className="h-4 w-4 mr-2" /> Tạo mới
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách thẻ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? (
            <div>Đang tải...</div>
          ) : (
            list.map((tag) => (
              <div key={tag.id} className="grid grid-cols-1 md:grid-cols-6 gap-3 items-center">
                <div className="md:col-span-2 text-sm text-muted-foreground">ID: {tag.id}</div>
                <div className="md:col-span-2">
                  {editingId === tag.id ? (
                    <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
                  ) : (
                    <div className="font-medium">{tag.name}</div>
                  )}
                </div>
                <div className="flex gap-2">
                  {editingId === tag.id ? (
                    <>
                      <Button size="sm" onClick={() => saveEdit(tag.id)} disabled={saving}>
                        <Save className="h-4 w-4 mr-1" /> Lưu
                      </Button>
                      <Button size="sm" variant="outline" onClick={cancelEdit}>
                        <X className="h-4 w-4 mr-1" /> Hủy
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button size="sm" variant="outline" onClick={() => startEdit(tag)}>
                        <Edit3 className="h-4 w-4 mr-1" /> Sửa
                      </Button>
                      <Button size="sm" variant="destructive" className="text-white" onClick={() => deleteTag(tag.id)} disabled={saving}>
                        <Trash2 className="h-4 w-4 mr-1" /> Xóa
                      </Button>
                    </>
                  )}
                </div>
                <Separator className="md:col-span-6" />
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}


