"use client"

import { useState, useEffect } from "react"
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function Blog() {
  const [editorContent, setEditorContent] = useState<string>("")
  const [saveCount, setSaveCount] = useState(0)
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null)

  // Handle content changes from editor
  const handleContentChange = (html: string) => {
    console.log("📝 Content received from editor:", {
      htmlLength: html.length,
      wordCount: html.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length,
      timestamp: new Date().toISOString(),
      preview: html.substring(0, 100) + (html.length > 100 ? '...' : '')
    })
    
    setEditorContent(html)
    setSaveCount(prev => prev + 1)
    setLastSaveTime(new Date())
    
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

  const clearContent = () => {
    setEditorContent("")
    setSaveCount(0)
    setLastSaveTime(null)
    localStorage.removeItem('blog-draft')
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  return (
    <div className="flex flex-col justify-center items-center max-w-6xl mx-auto p-4 space-y-6">
      {/* Editor */}
      <div className="w-full">
        <SimpleEditor 
          content={editorContent}
          onContentChange={handleContentChange}
          autoSaveDelay={1000} // 1 second auto-save delay
        />
      </div>

      {/* Auto-Save Status */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Auto-Save Status</span>
            <div className="flex gap-2">
              <Badge variant="outline">
                Saves: {saveCount}
              </Badge>
              {lastSaveTime && (
                <Badge variant="secondary">
                  Last: {formatTime(lastSaveTime)}
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span>Content Length:</span>
              <span className="font-mono">{editorContent.length} characters</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span>Word Count:</span>
              <span className="font-mono">
                {editorContent.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length} words
              </span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearContent}
              disabled={!editorContent}
            >
              Clear Content
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Content Preview */}
      {editorContent && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Live HTML Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg max-h-60 overflow-auto">
                <pre className="text-xs whitespace-pre-wrap break-all">
                  {editorContent}
                </pre>
              </div>
              <div className="border p-4 rounded-lg">
                <h4 className="text-sm font-medium mb-2">Rendered Output:</h4>
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: editorContent }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}