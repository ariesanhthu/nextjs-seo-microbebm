import BlogEditor from "@/features/blog/components/blog-editor";
import ContentEditor from "@/features/blog/components/content-editor";
import OpenBlogDialog from "@/features/blog/components/open-blog-dialog";
import Link from "next/link";

export default function Page() {


  return (
    <div>
      <Link href="/dev/blog/gallery">
        <button>
          Go to Other Page
        </button>
      </Link>
      <BlogEditor/>
    </div>
  )
}