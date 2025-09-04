import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { HomepageResponseDto } from "@/lib/dto/homepage.dto";
import { fetchHomepageServer } from "@/lib/fetchers/homepage.fetcher";
import { HomepageProvider } from "@/features/homepage/context/homepage-context";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data: HomepageResponseDto = await fetchHomepageServer();
  
  return (
    <HomepageProvider value={data}>
      <Navbar nav={data?.navigation_bar ?? []} />
        {children}
      <Footer footer={data?.footer} />
    </HomepageProvider>
  );
}
