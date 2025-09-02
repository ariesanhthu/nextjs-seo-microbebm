"use client"
import { Button } from "@/components/ui/button";
import ContentEditor from "./content-editor";
import {Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useEffect } from "react";
import { BlogResponseDto } from "@/lib/dto/blog.dto";
import { ApiResponseDto } from "@/lib/dto/api-response.dto";
import { useGlobalAlert } from "@/features/alert-dialog/context/alert-dialog-context";
import Image from "next/image";
import { ImageMetadataResponseDto } from "@/lib/dto/image-metadata.dto";
import { useImageGallery } from "@/features/image-storage/context/image-gallery-context";

import { EBlogStatus } from "@/lib/enums/blog-status.enum";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTagGallery } from "@/features/tag/context/tag-galerry-context";
import { TagResponseDto } from "@/lib/dto/tag.dto";
import { Badge } from "@/components/tiptap-ui-primitive/badge/badge";
import { X } from "lucide-react";
import { toast } from "@/hooks/use-toast";


export type BlogEditorHandle = {
  loadBlog: (blog: BlogResponseDto) => void
  reset: () => void
  save: () => Promise<void>
}

type BlogEditorProps = {
  blogId?: string | null
  onDirtyChange?: (dirty: boolean) => void
}

const BlogEditor = React.forwardRef<BlogEditorHandle, BlogEditorProps>(function BlogEditor({ blogId = null, onDirtyChange }: BlogEditorProps, ref) {
  const [id, setId] = React.useState<string | null>(null);
  const [author, setAuthor] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [tags, setTags] = React.useState<Pick<TagResponseDto, "id" | "name" | "slug">[]>([]);
  const [isFeatured, setIsFeatured] = React.useState(false);
  const [status, setStatus] = React.useState(EBlogStatus.DRAFT);
  const [excerpt, setExcerpt] = React.useState("");
  const [thumbnailUrl, setThumbnailUrl] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);

  const [isDirty, setIsDirty] = React.useState(false);
  const suppressDirtyRef = React.useRef(false);
  
  // Use the custom alert dialog hook
  const alertDialog = useGlobalAlert();
  const imageGallery = useImageGallery();

  const tagGallery = useTagGallery();

  const setDirty = (val: boolean) => {
    if (suppressDirtyRef.current) return;
    setIsDirty(val);
    onDirtyChange?.(val);
  }

  const runWithSuppressedDirty = (updater: () => void) => {
    suppressDirtyRef.current = true;
    try {
      updater();
    } finally {
      suppressDirtyRef.current = false;
      setIsDirty(false);
      onDirtyChange?.(false);
    }
  }

  // Load existing blog when blogId provided
  useEffect(() => {
    if (!blogId) return;
    
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/blog/${blogId}`);
        const data: ApiResponseDto<BlogResponseDto> = await res.json();
        if (data?.success && data.data) {
          const blog = data.data;
          loadBlogData(blog);
        }
      } catch (err) {
        // ignore
      }
    };

    fetchBlog();
  }, [blogId]);



  const handleSelectThumbnailUrl = () => {
    imageGallery.openDialog((image: ImageMetadataResponseDto) => {
      setThumbnailUrl(image.url);
      setDirty(true);
    });
  }

  const handleSelectTags = () => {
    tagGallery.openDialog((selectedTags: TagResponseDto[]) => {
      const newTags = selectedTags.filter(tag => !tags.find(t => t.id === tag.id));
      setTags((prev) => [...prev, ...newTags]);
      setDirty(true);
    });
  };


  const handleRemoveTag = (tagId: string) => {
    setTags((prev) => prev.filter(tag => tag.id !== tagId));
    setDirty(true);
  };

  const loadBlogData = (blog: BlogResponseDto) => {
    runWithSuppressedDirty(() => {
      setId(blog.id);
      setTitle(blog.title);
      setAuthor(blog.author);
      setContent(blog.content);
      setThumbnailUrl(blog.thumbnail_url || "");
      setExcerpt(blog.excerpt || "");
      setIsFeatured(blog.is_featured || false);
      setStatus(blog.status || EBlogStatus.DRAFT);
      setTags(blog.tags || []);
    });
  };

  const handleOpenBlog = async (blog: BlogResponseDto, alert: boolean = true) => {
    if (alert) {
      const choice = await alertDialog.showAlert({
        title: "Mở bài viết",
        description: "Bạn có chắc chắn muốn mở bài viết này? Bài viết hiện tại sẽ bị mất nếu chưa lưu.",
        actionText: "Đồng ý",
        cancelText: "Hủy"
      });

      if (!choice) return;
    }
    
    loadBlogData(blog);
  };

  const handleReset = () => {
    runWithSuppressedDirty(() => {
      setId(null);
      setTitle("");
      setAuthor("");
      setContent("");
      setThumbnailUrl("");
      setExcerpt("");
      setIsFeatured(false);
      setStatus(EBlogStatus.DRAFT);
      setTags([]);
    });
  };

  const handleSaveBlog = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const body = JSON.stringify({
        title,
        author,
        content,
        thumbnail_url: thumbnailUrl,
        tag_ids: tags.map(tag => tag.id),
        excerpt,
        is_featured: isFeatured,
        status,
      });

      const url = id ? `/api/blog/${id}` : "/api/blog";
      const method = id ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body,
      });
      const data: ApiResponseDto<BlogResponseDto> = await response.json();
      if (!data.success) {
        toast({ title: "Lưu thất bại", description: data.message ?? "Không thể lưu bài viết" });
        return;
      }
      loadBlogData(data.data);
      toast({ title: "Đã lưu", description: id ? "Đã cập nhật bài viết" : "Đã tạo bài viết" });
    } catch (error) {
      toast({ title: "Lỗi", description: "Có lỗi xảy ra khi lưu" });
    } finally {
      setIsSubmitting(false);
    }
  };

  React.useImperativeHandle(ref, () => ({
    loadBlog: (blog: BlogResponseDto) => {
      handleOpenBlog(blog, false);
    },
    reset: () => {
      handleReset();
    },
    save: async () => {
      await handleSaveBlog();
    }
  }), [author, content, excerpt, isFeatured, status, thumbnailUrl, title, tags]);

  return (
    <div>
      <Card className="mx-5 my-10 mt-4">
        <CardHeader className="flex flex-row">
          <div className="flex flex-col">
            <CardTitle>Thông tin bài viết</CardTitle>
          </div>
          {/* Nút lưu được đặt tại page.tsx để tránh trùng lặp */}
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          <div className="flex flex-row gap-5 w-full">
            <div className="flex flex-col gap-5 w-full">
              <Label htmlFor="title">Tiêu đề</Label>
              <Input
                placeholder="Tiêu đề"
                value={title}
                onChange={(e) => { setTitle(e.target.value); setDirty(true); }} />

              <Label htmlFor="author">Tác giả</Label>
              <Input
                placeholder="Tác giả"
                value={author}
                onChange={(e) => { setAuthor(e.target.value); setDirty(true); }} />

              <Label htmlFor="excerpt">Tóm tắt</Label>
              <Textarea
                placeholder="Tóm tắt"
                value={excerpt}
                onChange={(e) => { setExcerpt(e.target.value); setDirty(true); }} />
            </div>

            <div className="flex-2/3 flex flex-col gap-5 w-full">
              <Label htmlFor="status">Trạng thái</Label>
              <Select
                value={status}
                onValueChange={(value) => { setStatus(value as EBlogStatus); setDirty(true); }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={EBlogStatus.DRAFT}>DRAFT</SelectItem>
                  <SelectItem value={EBlogStatus.PUBLISHED}>PUBLISHED</SelectItem>
                  <SelectItem value={EBlogStatus.ARCHIVED}>ARCHIVED</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex flex-row items-center gap-4">
                {
                  thumbnailUrl ? (
                    <Image
                      src={thumbnailUrl}
                      alt="Thumbnail"
                      width={100}
                      height={100}
                      className="rounded-md"
                    />
                  ) : (
                    <Image
                      src="/images/no-image.jpg"
                      alt="Thumbnail"
                      width={50}
                      height={50}
                      className="rounded-md"
                    />
                  )
                }
                <Button
                  type="button"

                  onClick={handleSelectThumbnailUrl}
                  disabled={isProcessing}
                >
                  Chọn Thumbnail
                </Button>
              </div>
              <Label>Tags</Label>
              <Button
                type="button"
                onClick={handleSelectTags}
                disabled={isProcessing}
              >
                Chọn Thẻ
              </Button>
              <div className="flex flex-row flex-wrap ">
                {tags.map(tag => (
                  <div key={tag.id} className="mr-2 mb-2 inline-flex items-center gap-1">
                    <Badge variant="green" className="">
                      {tag.name}
                    </Badge>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag.id)}
                      className="inline-flex h-4 w-4 items-center justify-center rounded hover:text-red-600"
                      aria-label={`Xóa tag ${tag.name}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          

          <ContentEditor value={content} onChange={(v) => { setContent(v); setDirty(true); }} />
        </CardContent>
      </Card>

    </div>
  );
});

export default BlogEditor
