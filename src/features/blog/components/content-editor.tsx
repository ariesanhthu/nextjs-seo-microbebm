"use client"

import { useState, useEffect } from "react"
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Eye, Edit, FileText } from "lucide-react"

export default function ContentEditor() {
  const [editorContent, setEditorContent] = useState<string>("")
  const [activeTab, setActiveTab] = useState<string>("editor")

  // Handle content changes from editor
  const handleContentChange = (html: string) => {
    console.log("📝 Content received from editor:", {
      htmlLength: html.length,
      wordCount: html.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length,
      timestamp: new Date().toISOString(),
      preview: html.substring(0, 100) + (html.length > 100 ? '...' : '')
    })
    
    setEditorContent(html)
    // Here you could also save to your backend/database
    // saveToDatabase(html)
  }

  // Optional: Save to localStorage as backup
  useEffect(() => {
    if (editorContent) {
      localStorage.setItem('blog-draft', editorContent)
      console.log("💾 Content saved to localStorage")
    }
  }, [editorContent])

  // Load from localStorage on mount
  useEffect(() => {
    const savedContent = localStorage.getItem('blog-draft')
    if (savedContent) {
      setEditorContent(savedContent)
      console.log("🔄 Loaded content from localStorage")
    }
  }, [])

  return (
    <div className="flex flex-col justify-center items-center max-w-6xl mx-auto p-4 space-y-6">
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
            <TabsContent value="preview" className="mt-0">
              {/* <div>
                {editorContent}
              </div> */}
              <div className="p-4">
                {editorContent ? (
                  <div className="space-y-4">
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
                        `
                      }} />
                      <div 
                        className="blog-preview prose prose-lg max-w-none"
                        dangerouslySetInnerHTML={{ __html: editorContent }}
                      />
                    </div>
                    
                    {/* Content Stats */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 pt-2 border-t">
                      <span>
                        Words: {editorContent.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length}
                      </span>
                      <span>
                        Characters: {editorContent.replace(/<[^>]*>/g, '').length}
                      </span>
                      <span>
                        HTML Size: {editorContent.length} chars
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
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  )
}