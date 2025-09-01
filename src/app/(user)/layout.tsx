import { headers } from "next/headers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { HomepageResponseDto } from "@/lib/dto/homepage.dto";
import { HOMEPAGE_SEED_DATA } from "@/lib/homepageData";

async function fetchHomepage(): Promise<HomepageResponseDto> {
  try {
    const h = await headers();
    const host = h.get("host") ?? "localhost:3000";
    const proto = h.get("x-forwarded-proto") ?? "http";
    const baseUrl = `${proto}://${host}`;

    const res = await fetch(`${baseUrl}/api/homepage`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return HOMEPAGE_SEED_DATA;
    const json = await res.json();
    if (json?.success && json?.data) return json.data as HomepageResponseDto;
    return HOMEPAGE_SEED_DATA;
  } catch (_) {
    return HOMEPAGE_SEED_DATA;
  }
}

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await fetchHomepage();
  
  return (
    <>
      <Navbar nav={data?.navigation_bar ?? []} />
        {children}
      <Footer footer={data?.footer} />
    </>
  );
}
