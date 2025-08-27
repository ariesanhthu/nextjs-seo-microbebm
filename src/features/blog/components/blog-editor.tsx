"use client"
import { Button } from "@/components/ui/button";
import ContentEditor from "./content-editor";
import {Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import React from "react";
import OpenBlogDialog from "./open-blog-dialog";
import { BlogResponseDto } from "@/lib/dto/blog.dto";
import { ApiResponseDto } from "@/lib/dto/api-response.dto";
import { useGlobalAlert } from "@/features/alert-dialog/context/alert-dialog-context";


export default function BlogEditor() {
  const [id, setId] = React.useState<string | null>(null);
  const [author, setAuthor] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [isOpenBlogDialog, setIsOpenBlogDialog] = React.useState(false);
  
  // Use the custom alert dialog hook
  const alertDialog = useGlobalAlert();

  const handlePostBlog = async () => {
    if (id) {
      const choice = await alertDialog.showAlert({
        title: "Blog đã tồn tại",
        description: "Blog đã tồn tại. Bạn có muốn đăng mới?",
        actionText: "Đăng mới",
        cancelText: "Hủy"
      });
      
      console.log("User choice:", choice);
      if (!choice) {
        return;
      }
    }
    
    const body = JSON.stringify({ title, author, content });
    console.log("Storing to database...", body);
    
    try { 
      const response = await fetch("/api/blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, author, content }),
      });

      const data: ApiResponseDto<BlogResponseDto> = await response.json();

      if (!data.success) {
        toast.error(`Failed to save blog post\n${data.message}`);
      } else {
        toast.success("Blog post saved successfully!");
        const blog: BlogResponseDto = data.data;
        setId(blog.id);
        setTitle(blog.title);
        setAuthor(blog.author);
        setContent(blog.content);
      }
    } catch (error) {
      toast.error("An error occurred while saving the blog post");
    }
  };

  const handleOpenBlog = async (blog: BlogResponseDto) => {
    const choice = await alertDialog.showAlert({
      title: "Mở bài viết",
      description: "Bạn có chắc chắn muốn mở bài viết này? Bài viết hiện tại sẽ bị mất nếu chưa lưu.",
      actionText: "Đồng ý",
      cancelText: "Hủy"
    });

    if (!choice) {
      return;
    }

    setId(blog.id);
    setTitle(blog.title);
    setAuthor(blog.author);
    setContent(blog.content);
    setIsOpenBlogDialog(true);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handlePostBlog();
  };

  const handleNewBlog = async () => {
    const choice = await alertDialog.showAlert({
      title: "Tạo bài viết mới",
      description: "Bạn có chắc chắn muốn tạo bài viết mới? Các thay đổi chưa lưu sẽ bị mất.",
      actionText: "Đồng ý",
      cancelText: "Hủy"
    });
    
    if (!choice) {
      return 
    }
    setId(null);
    setTitle("");
    setAuthor("");
    setContent("");
    toast.success("Đã tạo bài viết mới");
  };

  const handleSaveBlog = async () => {
    if (id) {
      try {
        const body = JSON.stringify({ title, author, content });
        console.log("Updating blog...", body);
        
        const response = await fetch(`/api/blog/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body,
        });

        if (response.ok) {
          toast.success("Blog đã được lưu thành công!");
        } else {
          toast.error("Có lỗi xảy ra khi lưu blog");
        }
      } catch (error) {
        toast.error("Có lỗi xảy ra khi lưu blog");
      }
    }
  };

  return (
    <div>
      <Toaster richColors position="top-center"/>

      {/* Always render dialog but hide with CSS */}
      <div 
        className={`fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-200 ${
          isOpenBlogDialog ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <OpenBlogDialog 
          onSelect={(blog) => {
            console.log("Selected blog:", blog);
            handleOpenBlog(blog);
          }}
          closeDialog={() => setIsOpenBlogDialog(false)}
          isOpen={isOpenBlogDialog}
        />
      </div>

      <Card className="mx-5 my-10 mt-4">
        <form onSubmit={handleSubmit}>
          <CardHeader className="flex flex-row">
            <div className="flex flex-col">
              <CardTitle>Thông tin bài viết</CardTitle>
              <CardDescription>Điền thông tin chi tiết bên dưới</CardDescription>
            </div>
            <div className="ml-auto flex flex-row gap-2">
              <Button type="button" onClick={() => setIsOpenBlogDialog(true)}>Mở bài viết</Button>
              <Button type="button" onClick={handleNewBlog}>Tạo mới</Button>
              <Button type="submit">Đăng</Button>
              <Button type="button" onClick={handleSaveBlog} disabled={!id}>Lưu</Button>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
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
            <ContentEditor value={content} onChange={setContent} />
          </CardContent>
        </form>
      </Card>

    </div>
  )
}
