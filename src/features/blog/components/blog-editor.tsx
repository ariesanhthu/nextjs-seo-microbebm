"use client"
import { Button } from "@/components/ui/button";
import ContentEditor from "./content-editor";
import {Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import React, { useEffect } from "react";
import { BlogResponseDto } from "@/lib/dto/blog.dto";
import { ApiResponseDto } from "@/lib/dto/api-response.dto";
import { useGlobalAlert } from "@/features/alert-dialog/context/alert-dialog-context";
import Image from "next/image";
import { ImageMetadataResponseDto } from "@/lib/dto/image-metadata.dto";
import { useImageGallery } from "@/features/image-storage/context/image-gallery-context";
import { useBlogGallery } from "../context/blog-gallery-context";
import { EBlogStatus } from "@/lib/enums/blog-status.enum";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTagGallery } from "@/features/tag/context/tag-galerry-context";
import { TagResponseDto } from "@/lib/dto/tag.dto";
import { Badge } from "@/components/tiptap-ui-primitive/badge/badge";


type BlogEditorProps = {
  blogId?: string | null
}

export default function BlogEditor({ blogId = null }: BlogEditorProps) {
  const [id, setId] = React.useState<string | null>(null);
  const [author, setAuthor] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [tags, setTags] = React.useState<Pick<TagResponseDto, "id" | "name" | "slug">[]>([]);
  const [isFeatured, setIsFeatured] = React.useState(false);
  const [status, setStatus] = React.useState(EBlogStatus.DRAFT);
  const [excerpt, setExcerpt] = React.useState("");
  const [thumbnailUrl, setThumbnailUrl] = React.useState("");

  const [isProcessing, setIsProcessing] = React.useState(false);

  // Use the custom alert dialog hook
  const alertDialog = useGlobalAlert();
  const imageGallery = useImageGallery();
  const blogGallery = useBlogGallery();
  const tagGallery = useTagGallery();

  // Load existing blog when blogId provided
  useEffect(() => {
    const fetchBlog = async (targetId: string) => {
      try {
        const res = await fetch(`/api/blog/${targetId}`);
        const data: ApiResponseDto<BlogResponseDto> = await res.json();
        if (data?.success && data.data) {
          const blog = data.data;
          setId(blog.id);
          setTitle(blog.title);
          setAuthor(blog.author);
          setContent(blog.content);
          setThumbnailUrl(blog.thumbnail_url || "");
          setExcerpt(blog.excerpt || "");
          setIsFeatured(blog.is_featured || false);
          setStatus(blog.status || EBlogStatus.DRAFT);
        }
      } catch (err) {
        // ignore
      }
    };

    if (blogId) {
      fetchBlog(blogId);
    }
  }, [blogId]);

  const handlePostBlog = async () => {
    setIsProcessing(true);
    try {
      if (id) {
        const choice = await alertDialog.showAlert({
          title: "Blog đã tồn tại",
          description: "Blog đã tồn tại. Bạn có muốn đăng mới?",
          actionText: "Đăng mới",
          cancelText: "Hủy"
        });
        
        if (!choice) {
          return;
        }
      }
    
      const body = JSON.stringify({ 
        title, 
        author, 
        content, 
        thumbnail_url: thumbnailUrl,
        tag_ids: tags.map(tag => tag.id),
        excerpt,
        is_featured: isFeatured,
        status: EBlogStatus.PUBLISHED
      });
    
      try { 
        const response = await fetch("/api/blog", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: body,
        });

        const data: ApiResponseDto<BlogResponseDto> = await response.json();

        if (!data.success) {
          toast.error(`Failed to save blog post\n${data.message}`);
        } else {
          toast.success("Blog post saved successfully!");
          handleOpenBlog(data.data, false);
        }
      } catch (error) {
        toast.error("An error occurred while saving the blog post");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSelectThumbnailUrl = () => {
    setIsProcessing(true);
    try {
      imageGallery.openDialog((image: ImageMetadataResponseDto) => {
        setThumbnailUrl(image.url);
      });
    } finally {
      setIsProcessing(false);
    }
  }

  const handleSelectTags = () => {
    setIsProcessing(true);
    try {
      tagGallery.openDialog((selectedTags: TagResponseDto[]) => {
        const newTags = selectedTags.filter(tag => !tags.find(t => t.id === tag.id));
        console.log("Selected tags:", newTags);
        setTags((prev) => [...prev, ...newTags]);
      });
    } finally {
      setIsProcessing(false);
    }
  };


  const handleRemoveTag = (tagId: string) => {
    setTags((prev) => prev.filter(tag => tag.id !== tagId));
  };

  const handleSelectBlog = () => {
    setIsProcessing(true);
    try {
      blogGallery.openSelectionDialog([], (blogs: BlogResponseDto[]) => {
        if (blogs.length > 0) {
          handleOpenBlog(blogs[0]);
        }
      }, 1);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOpenBlog = async (blog: BlogResponseDto, alert: boolean = true) => {
    setIsProcessing(true);
    try {
      if (alert) {
        const choice = await alertDialog.showAlert({
          title: "Mở bài viết",
          description: "Bạn có chắc chắn muốn mở bài viết này? Bài viết hiện tại sẽ bị mất nếu chưa lưu.",
          actionText: "Đồng ý",
          cancelText: "Hủy"
        });

        if (!choice) {
          return;
        }
      }
    
      setId(blog.id);
      setTitle(blog.title);
      setAuthor(blog.author);
      setContent(blog.content);
      setThumbnailUrl(blog.thumbnail_url || "");
      setExcerpt(blog.excerpt || "");
      setIsFeatured(blog.is_featured || false);
      setStatus(blog.status || EBlogStatus.DRAFT);
      setTags(blog.tags || []);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNewBlog = async () => {
    setIsProcessing(true);
    try {
      const choice = await alertDialog.showAlert({
        title: "Tạo bài viết mới",
        description: "Bạn có chắc chắn muốn tạo bài viết mới? Các thay đổi chưa lưu sẽ bị mất.",
        actionText: "Đồng ý",
        cancelText: "Hủy"
      });
      
      if (!choice) {
        setIsProcessing(false);
        return;
      }
      setId(null);
      setTitle("");
      setAuthor("");
      setContent("");
      setThumbnailUrl("");
      toast.success("Đã tạo bài viết mới");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveBlog = async () => {
    setIsProcessing(true);
    try {
      const choice = await alertDialog.showAlert({
        title: "Lưu bài viết",
        description: "Bạn có muốn lưu bài viết này?",
        actionText: "Đồng ý",
        cancelText: "Hủy"
      });
      
      if (!choice) {
        return;
      }
      const body = JSON.stringify({ 
        title, 
        author, 
        content, 
        thumbnail_url: thumbnailUrl,
        tag_ids: tags.map(tag => tag.id),
        excerpt,
        is_featured: isFeatured,
        status: status
      });

      const url = id ? `/api/blog/${id}` : "/api/blog";

      const response = await fetch(url, {
        method:  id ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      if (!response.ok) {
        throw new Error("");
      }
      const data: ApiResponseDto<BlogResponseDto> = await response.json();
      if (data.success) {
        handleOpenBlog(data.data, false);
        toast.success("Blog đã được lưu thành công!");
      } else {
        toast.error(`Có lỗi xảy ra khi lưu blog: ${data.message}`);
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi lưu blog");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <Toaster richColors position="top-center"/>

      <Card className="mx-5 my-10 mt-4">
        <CardHeader className="flex flex-row">
          <div className="flex flex-col">
            <CardTitle>Thông tin bài viết</CardTitle>
            <CardDescription>Điền thông tin chi tiết bên dưới</CardDescription>
          </div>
          <div className="ml-auto flex flex-row gap-2">
            <Button type="button" onClick={handleSelectBlog} disabled={isProcessing}>Mở bài viết</Button>
            <Button type="button" onClick={handleNewBlog} disabled={isProcessing}>Tạo mới</Button>
            <Button type="button" onClick={handlePostBlog} disabled={isProcessing}>Đăng</Button>
            <Button type="button" onClick={handleSaveBlog} disabled={isProcessing}> Lưu </Button>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          <div className="flex flex-row gap-5 w-full">
            <div className="flex flex-col gap-5 w-full">
              <Label htmlFor="title">Tiêu đề</Label>
              <Input
                placeholder="Tiêu đề"
                value={title}
                onChange={(e) => setTitle(e.target.value)} />

              <Label htmlFor="author">Tác giả</Label>
              <Input
                placeholder="Tác giả"
                value={author}
                onChange={(e) => setAuthor(e.target.value)} />

              <Label htmlFor="excerpt">Tóm tắt</Label>
              <Textarea
                placeholder="Tóm tắt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)} />
            </div>

            <div className="flex-2/3 flex flex-col gap-5 w-full">
              <Label htmlFor="status">Trạng thái</Label>
              <Select
                value={status}
                onValueChange={(value) => setStatus(value as EBlogStatus)}
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
                  // onClick={() => setIsOpenImageDialog(true)}
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
                Chọn Tags
              </Button>
              <div className="flex flex-row flex-wrap ">
                {tags.map(tag => (
                  <Button key={tag.id} variant="ghost" className="p-0 mr-2" onClick={() => handleRemoveTag(tag.id)}>
                    <Badge key={tag.id} variant="green" className="">
                      {tag.name}  
                    </Badge>
                  </Button>
                ))}
              </div>

              <div></div>

            </div>
          </div>
          

          <ContentEditor value={content} onChange={setContent} />
        </CardContent>
      </Card>

    </div>
  )
}
