"use client"

import { useState, useEffect } from "react"
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Eye, Edit, FileText } from "lucide-react"

interface ContentEditorProps {
  value: string;
  onChange: (html: string) => void;
}

export default function ContentEditor({ value, onChange }: ContentEditorProps) {
  const [editorContent, setEditorContent] = useState<string>(value)
  const [activeTab, setActiveTab] = useState<string>("editor")

  // Sync with external value prop changes (when blog is selected)
  useEffect(() => {
    if (value !== editorContent) {
      setEditorContent(value)
    }
  }, [value])

  // Handle content changes from editor
  const handleContentChange = (html: string) => {
    onChange(html)
    setEditorContent(html)
  }

  // Optional: Save to localStorage as backup (but don't override props)
  useEffect(() => {
    if (editorContent && editorContent !== value) {
      localStorage.setItem('blog-draft', editorContent)
    }
  }, [editorContent, value])

  // Function to replace images with alt text placeholders
  const processContentForPreview = (html: string): string => {
    return html.replace(
      /<img[^>]*src="[^"]*"[^>]*alt="([^"]*)"[^>]*\/?>/gi,
      (match, altText) => {
        const displayText = altText || 'No alt text provided'
        return `<div class="image-placeholder" style="
          background: #f3f4f6;
          border: 2px dashed #d1d5db;
          border-radius: 0.375rem;
          padding: 0.75rem 1rem;
          color: #6b7280;
          font-style: italic;
          font-size: 0.875rem;
          text-align: center;
          margin: 0.5rem 0;
          display: inline-block;
          min-width: 200px;
        ">Image: ${displayText}</div>`
      }
    ).replace(
      /<img[^>]*alt="([^"]*)"[^>]*src="[^"]*"[^>]*\/?>/gi,
      (match, altText) => {
        const displayText = altText || 'No alt text provided'
        return `<div class="image-placeholder" style="
          background: #f3f4f6;
          border: 2px dashed #d1d5db;
          border-radius: 0.375rem;
          padding: 0.75rem 1rem;
          color: #6b7280;
          font-style: italic;
          font-size: 0.875rem;
          text-align: center;
          margin: 0.5rem 0;
          display: inline-block;
          min-width: 200px;
        ">📷 Ảnh: ${displayText}</div>`
      }
    ).replace(
      /<img[^>]*src="[^"]*"[^>]*(?!alt=)[^>]*\/?>/gi,
      `<div class="image-placeholder" style="
        background: #fef2f2;
        border: 2px dashed #fca5a5;
        border-radius: 0.375rem;
        padding: 0.75rem 1rem;
        color: #dc2626;
        font-style: italic;
        font-size: 0.875rem;
        text-align: center;
        margin: 0.5rem 0;
        display: inline-block;
        min-width: 200px;
      ">Ảnh: không có mô tả</div>`
    )
  }

  // Load from localStorage ONLY if no value prop is provided
  useEffect(() => {
    if (!value || value === "") {
      const savedContent = localStorage.getItem('blog-draft')
      if (savedContent) {
        setEditorContent(savedContent)
      }
    }
  }, []) // Remove value dependency to prevent override

  return (
    <div className="flex flex-col w-full justify-center items-center mx-auto p-4 space-y-6">
      {/* Tabbed Editor and Preview */}
      <Card className="w-full">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <CardHeader className="pb-3">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="editor" className="flex items-center gap-2">
                <Edit className="w-4 h-4" />
                Editor
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Preview
              </TabsTrigger>
            </TabsList>
          </CardHeader>

          <CardContent className="p-0">
            {/* Always render editor but show/hide with CSS */}
            <div className={`p-4 ${activeTab === "editor" ? "block" : "hidden"}`}>
              <SimpleEditor 
                content={editorContent}
                onContentChange={handleContentChange}
                autoSaveDelay={1000} // 1 second auto-save delay
              />
            </div>

            {/* Preview Tab */}
            <div className={`p-4 ${activeTab === "preview" ? "block" : "hidden"}`}>
              {editorContent ? (
                <div className="space-y-4">
                  {/* <div>
                    {editorContent}
                  </div>  */}
                  <div className="border rounded-lg p-6 bg-white min-h-[400px]">
                    <style dangerouslySetInnerHTML={{
                      __html: `
                        .blog-preview ul {
                          list-style-type: disc !important;
                          padding-left: 1.5rem !important;
                          margin: 1rem 0 !important;
                        }
                        .blog-preview ol {
                          list-style-type: decimal !important;
                          padding-left: 1.5rem !important;
                          margin: 1rem 0 !important;
                        }
                        .blog-preview li {
                          margin: 0.25rem 0 !important;
                          display: list-item !important;
                        }
                        .blog-preview ul ul {
                          list-style-type: circle !important;
                          margin: 0.25rem 0 !important;
                        }
                        .blog-preview ul ul ul {
                          list-style-type: square !important;
                        }
                        .blog-preview input[type="checkbox"] {
                          margin-right: 0.5rem;
                        }
                        .blog-preview h1 { color: #111827; font-size: 2.25rem; font-weight: 800; margin: 2rem 0 1rem 0; }
                        .blog-preview h2 { color: #111827; font-size: 1.875rem; font-weight: 700; margin: 1.5rem 0 0.75rem 0; }
                        .blog-preview h3 { color: #111827; font-size: 1.5rem; font-weight: 600; margin: 1.25rem 0 0.5rem 0; }
                        .blog-preview h4 { color: #111827; font-size: 1.25rem; font-weight: 600; margin: 1rem 0 0.5rem 0; }
                        .blog-preview p { color: #374151; margin: 0.75rem 0; line-height: 1.625; }
                        .blog-preview strong { color: #111827; font-weight: 600; }
                        .blog-preview code { color: #db2777; background: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem; }
                        .blog-preview blockquote { border-left: 4px solid #3b82f6; background: #eff6ff; padding: 0.5rem 1rem; margin: 1rem 0; }
                        .image-placeholder {
                          transition: all 0.2s ease;
                        }
                        .image-placeholder:hover {
                          background: #e5e7eb !important;
                          border-color: #9ca3af !important;
                        }
                      `
                    }} />
                    <div 
                      className="blog-preview prose prose-lg max-w-none"
                      dangerouslySetInnerHTML={{ __html: processContentForPreview(editorContent) }}
                    />
                  </div>
                  
                  {/* Content Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 pt-2 border-t">
                    <span>
                      Words: {processContentForPreview(editorContent).replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length}
                    </span>
                    <span>
                      Characters: {editorContent.replace(/<[^>]*>/g, '').length}
                    </span>
                    <span>
                      HTML Size: {editorContent.length} chars
                    </span>
                    <span className="">
                      Images: {(editorContent.match(/<img[^>]*>/g) || []).length}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
                  <FileText className="w-12 h-12 mb-4 opacity-50" />
                  <p className="text-lg font-medium">No content yet</p>
                  <p className="text-sm">Switch to the Editor tab to start writing</p>
                </div>
              )}
            </div>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  )
}