import { AlertDialogProvider } from "@/features/alert-dialog/context/alert-dialog-context";
import { ImageGalleryProvider } from "@/features/image-storage/context/image-gallery-context";

export default function DevLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ImageGalleryProvider>
      <AlertDialogProvider>
        <body>
          {children}
        </body> 
      </AlertDialogProvider>
    </ImageGalleryProvider>
  );
}
