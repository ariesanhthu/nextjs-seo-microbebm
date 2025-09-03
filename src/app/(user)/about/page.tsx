import LayoutPreview from "@/features/section-about/components/layout-preview"
import { fetchAboutServer } from "@/lib/fetchers/about.fetcher"

export default async function AboutPage() {
  const aboutData = await fetchAboutServer()

  return <LayoutPreview data={aboutData} />
}
