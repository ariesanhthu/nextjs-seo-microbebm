"use client"

import { useState, useEffect } from "react"
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Eye, Edit, FileText } from "lucide-react"
import ContentPreview, { processContentForPreview } from "@/features/blog/components/content-preview"

interface ContentEditorProps {
  value: string;
  onChange: (html: string) => void;
  storageKey?: string; // Thêm prop để tùy chỉnh localStorage key
}

export default function ContentEditor({ value, onChange, storageKey = 'content-draft' }: ContentEditorProps) {
  const [editorContent, setEditorContent] = useState<string>(value)
  const [activeTab, setActiveTab] = useState<string>("editor")

  // Sync with external value prop changes (when product/blog is selected)
  useEffect(() => {
    if (value !== editorContent) {
      setEditorContent(value)
    }
  }, [value])

  // Handle content changes from editor
  const handleContentChange = (html: string) => {
    console.log('🔄 ContentEditor onChange:', {
      htmlLength: html.length,
      htmlPreview: html.substring(0, 100) + '...',
      storageKey,
      timestamp: new Date().toISOString()
    })
    onChange(html)
    setEditorContent(html)

    // Persist draft explicitly only when user changes content
    // - Save when non-empty
    // - Remove key when empty to avoid resurrecting cleared drafts
    try {
      const trimmed = (html || '').trim()
      if (trimmed.length > 0) {
        localStorage.setItem(storageKey, html)
      } else {
        localStorage.removeItem(storageKey)
      }
    } catch (_) {
      // ignore storage errors
    }
  }

  // preview logic moved to ContentPreview/processContentForPreview

  // Load from localStorage ONLY if no value prop is provided
  useEffect(() => {
    if (!value || value === "") {
      const savedContent = localStorage.getItem(storageKey)
      if (savedContent) {
        setEditorContent(savedContent)
      }
    }
  }, [value, storageKey]) // Thêm storageKey vào dependency

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
                  <ContentPreview html={editorContent} className="border rounded-lg p-6 bg-white min-h-[400px]" />
                  
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