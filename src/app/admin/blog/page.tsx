"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Edit, Plus, Trash2 } from "lucide-react"
import Link from "next/link"

type BlogItem = {
  id: string
  title: string
  author: string
  thumbnail_url?: string
}

export default function AdminBlogListPage() {
  const [items, setItems] = useState<BlogItem[]>([])
  const [loading, setLoading] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [idToDelete, setIdToDelete] = useState<string | null>(null)

  const fetchBlogs = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/blog?limit=100&sort=DESC")
      const data = await res.json()
      if (data?.success) {
        setItems(data.data || [])
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBlogs()
  }, [])

  const confirmDelete = (id: string) => {
    setIdToDelete(id)
    setOpenDeleteDialog(true)
  }

  const handleDelete = async () => {
    if (!idToDelete) return
    try {
      const res = await fetch(`/api/blog/${idToDelete}`, { method: "DELETE" })
      const data = await res.json()
      if (data?.success) {
        setOpenDeleteDialog(false)
        setIdToDelete(null)
        fetchBlogs()
      }
    } catch {}
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quản lý bài viết</h1>
        <Link href="/admin/blog/new">
          <Button>
            <Plus className="mr-2 h-4 w-4"/> Tạo mới
          </Button>
        </Link>
      </div>

      {items.length === 0 && !loading ? (
        <Alert>
          <AlertDescription>Chưa có bài viết nào.</AlertDescription>
        </Alert>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Danh sách bài viết</CardTitle>
            <CardDescription>Quản lý blog.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Ảnh</TableHead>
                  <TableHead>Tiêu đề</TableHead>
                  <TableHead>Tác giả</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((it) => (
                  <TableRow key={it.id}>
                    <TableCell className="font-mono text-xs">{it.id}</TableCell>
                    <TableCell>
                      {it.thumbnail_url && (
                        <img src={it.thumbnail_url} alt={it.title} className="h-12 w-12 rounded object-cover" />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{it.title}</TableCell>
                    <TableCell>{it.author}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Link href={`/admin/blog/new/${it.id}`} className="inline-flex">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="destructive" size="sm" className="text-white" onClick={() => confirmDelete(it.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>Hành động không thể hoàn tác.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDeleteDialog(false)}>Hủy</Button>
            <Button variant="destructive" className="text-white" onClick={handleDelete}>Xóa</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


