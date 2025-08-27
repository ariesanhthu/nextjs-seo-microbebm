"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { EditorContext } from "@tiptap/react"
import { ImageIcon, Link, X } from "lucide-react"
import { toast } from "sonner"

interface ImageLinkButtonProps {
  text?: string
}

export function ImageLinkButton({ text = "Image" }: ImageLinkButtonProps) {
  const { editor } = React.useContext(EditorContext)
  const [isOpen, setIsOpen] = React.useState(false)
  const [imageUrl, setImageUrl] = React.useState("")
  const [altText, setAltText] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  const validateImageUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url)
      const validDomains = ['imgur.com', 'cloudinary.com', 'unsplash.com', 'pexels.com', 'pixabay.com']
      const isValidDomain = validDomains.some(domain => urlObj.hostname.includes(domain))
      const hasImageExtension = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(urlObj.pathname)
      
      return isValidDomain || hasImageExtension || urlObj.protocol === 'data:'
    } catch {
      return false
    }
  }

  const testImageLoad = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => resolve(true)
      img.onerror = () => resolve(false)
      img.src = url
      
      // Timeout after 5 seconds
      setTimeout(() => resolve(false), 5000)
    })
  }

  const handleInsertImage = async () => {
    if (!editor || !imageUrl.trim()) {
      toast.error("Please enter a valid image URL")
      return
    }

    if (!validateImageUrl(imageUrl)) {
      toast.error("Please enter a valid image URL from a supported domain or with a valid image extension")
      return
    }

    setLoading(true)
    
    try {
      // Test if image loads
      const imageLoads = await testImageLoad(imageUrl)
      
      if (!imageLoads) {
        toast.error("Unable to load image from the provided URL")
        setLoading(false)
        return
      }

      // Insert image into editor
      editor.chain().focus().setImage({
        src: imageUrl,
        alt: altText || "Image",
        title: altText || undefined
      }).run()

      // Reset form and close dialog
      setImageUrl("")
      setAltText("")
      setIsOpen(false)
      toast.success("Image added successfully!")
      
    } catch (error) {
      toast.error("Failed to add image")
      console.error("Image insertion error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePasteUrl = async (e: React.ClipboardEvent) => {
    const pastedText = e.clipboardData.getData('text')
    if (pastedText && validateImageUrl(pastedText)) {
      setImageUrl(pastedText)
      
      // Auto-generate alt text from URL
      try {
        const filename = new URL(pastedText).pathname.split('/').pop()
        if (filename) {
          const nameWithoutExt = filename.replace(/\.[^/.]+$/, "")
          setAltText(nameWithoutExt.replace(/[-_]/g, ' '))
        }
      } catch {
        // Ignore error in auto-generation
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 min-w-0"
          disabled={!editor}
        >
          <ImageIcon className="h-4 w-4" />
          {text}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Insert Image from URL
          </DialogTitle>
          <DialogDescription>
            Paste an image URL from supported domains or direct image links
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image-url">Image URL</Label>
            <Input
              id="image-url"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              onPaste={handlePasteUrl}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Supported: Cloudinary, Imgur, Unsplash, Pexels, Pixabay, or direct image URLs
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="alt-text">Alt Text (Optional)</Label>
            <Input
              id="alt-text"
              placeholder="Describe the image..."
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              className="w-full"
            />
          </div>

          {imageUrl && validateImageUrl(imageUrl) && (
            <div className="p-2 border rounded-md bg-muted/50">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ImageIcon className="h-4 w-4" />
                Preview: {new URL(imageUrl).hostname}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setImageUrl("")
              setAltText("")
              setIsOpen(false)
            }}
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleInsertImage}
            disabled={!imageUrl.trim() || loading}
          >
            {loading ? "Adding..." : "Add Image"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
