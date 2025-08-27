import { AlertDialogProvider } from "@/features/alert-dialog/context/alert-dialog-context";
import { BlogGalleryProvider } from "@/features/blog/context/blog-gallery-context";
import { ImageGalleryProvider } from "@/features/image-storage/context/image-gallery-context";

export default function DevLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ImageGalleryProvider>
      <BlogGalleryProvider>
        <AlertDialogProvider>
          <body>
            {children}
          </body> 
        </AlertDialogProvider>
      </BlogGalleryProvider>
    </ImageGalleryProvider>
  );
}
