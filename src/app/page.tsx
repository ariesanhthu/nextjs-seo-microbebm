import { headers } from "next/headers";
import MainContent, { HomepageData, TEXT } from "@/features/homepage/components/main-content";

async function fetchHomepage(): Promise<HomepageData> {
  const defaultData: HomepageData = {
    navigation_bar: [],
    footer: {
      vi_name: TEXT.footer.aboutTitle,
      en_name: TEXT.footer.aboutTitle,
      tax_code: "",
      short_name: TEXT.footer.aboutTitle,
      owner: "",
      address: TEXT.footer.contact.address,
      email: TEXT.footer.contact.email,
      phone: TEXT.footer.contact.phone,
      working_time: "",
      fanpage: "",
      address_link: "",
    },
    slider: [],
    products: [],
  };

  try {
    const h = await headers();
    const host = h.get("host") ?? "localhost:3000";
    const proto = h.get("x-forwarded-proto") ?? "http";
    const baseUrl = `${proto}://${host}`;

    const res = await fetch(`${baseUrl}/api/homepage`, {
      // Revalidate periodically; adjust as needed
      next: { revalidate: 60 },
    });

    if (!res.ok) return defaultData;
    const json = await res.json();
    if (json?.success && json?.data) return json.data as HomepageData;
    return defaultData;
  } catch (_) {
    return defaultData;
  }
}

export default async function Home() {
  const data = await fetchHomepage();
  console.log(data);
  return <MainContent data={data} />;
}
