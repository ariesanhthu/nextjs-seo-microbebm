"use client"
import { Button } from "@/components/ui/button";
import ContentEditor from "./content-editor";
import {Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useEffect } from "react";
import OpenBlogDialog from "./open-blog-dialog";
import { BlogResponseDto } from "@/lib/dto/blog.dto";

export default function BlogEditor() {
  const [author, setAuthor] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [isOpenDialog, setIsOpenDialog] = React.useState(false);

  const storeToDatabase = async () => {
    const body = JSON.stringify({ title, author, content });
    console.log("Storing to database...", body);
    const response = await fetch("/api/blog", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, author, content }),
    });

    if (!response.ok) {
      console.error("Failed to save blog post");
    }
  };

  const handleOpenDialog = (blog: BlogResponseDto) => {
    setTitle(blog.title);
    setAuthor(blog.author);
    setContent(blog.content);
    setIsOpenDialog(true);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    storeToDatabase();
  };

  return (
    <div>
      <Button onClick={() => setIsOpenDialog(true)}>Open Blog Dialog</Button>
      
      {/* Always render dialog but hide with CSS */}
      <div 
        className={`fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-200 ${
          isOpenDialog ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <OpenBlogDialog 
          onSelect={(blog) => {
            console.log("Selected blog:", blog);
            handleOpenDialog(blog);
          }}
          closeDialog={() => setIsOpenDialog(false)}
          isOpen={isOpenDialog}
        />
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Thông tin bài viết</CardTitle>
            <CardDescription>Điền thông tin chi tiết bên dưới</CardDescription>
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
          <CardFooter className="flex justify-center">
            <Button type="submit">Đăng</Button>
          </CardFooter>
        </form>
      </Card>

    </div>
  )
}
