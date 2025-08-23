import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  Leaf,
  Recycle,
  Droplets,
  Shield,
} from "lucide-react";

import FeaturedProducts from "@/components/featured-products";
import ProjectsCarousel from "@/components/projects-carousel";
import SocialLinks from "@/components/social-links";
import Navbar from "@/components/Navbar";
import QualityPolicy from "@/components/quality-policy";
// Các biến chứa nội dung text
const TEXT = {
  banner: {
    title: "Tôn vinh thiên nhiên – Sống xanh mỗi ngày",
    description:
      "Chúng tôi cung cấp các sản phẩm thân thiện với môi trường, góp phần xây dựng một tương lai bền vững cho thế hệ mai sau.",
    button: "Khám phá ngay",
    imageAlt: "Thiên nhiên xanh mát",
  },
  services: {
    sectionTitle: "Dịch vụ của chúng tôi",
    sectionDescription:
      "Chúng tôi cung cấp các giải pháp toàn diện giúp bạn và doanh nghiệp sống và làm việc theo phong cách bền vững.",
    service1: {
      title: "Sản phẩm hữu cơ",
      description:
        "Các sản phẩm được sản xuất từ nguyên liệu tự nhiên, không chứa hóa chất độc hại.",
    },
    service2: {
      title: "Tái chế bền vững",
      description:
        "Giải pháp tái chế toàn diện cho doanh nghiệp và cá nhân, giảm thiểu rác thải.",
    },
    service3: {
      title: "Tiết kiệm nước",
      description:
        "Các sản phẩm và giải pháp giúp tiết kiệm nước trong sinh hoạt và sản xuất.",
    },
    service4: {
      title: "Tư vấn môi trường",
      description:
        "Dịch vụ tư vấn chuyên nghiệp về các giải pháp bảo vệ môi trường cho doanh nghiệp.",
    },
  },
  featuredProducts: {
    sectionTitle: "Sản phẩm tiêu biểu",
    sectionDescription:
      "Khám phá các sản phẩm thân thiện với môi trường, được thiết kế để giúp bạn sống xanh mỗi ngày.",
  },
  projects: {
    sectionTitle: "Công trình kinh nghiệm",
    sectionDescription:
      "Những dự án tiêu biểu mà chúng tôi đã thực hiện, mang lại giá trị bền vững cho khách hàng và môi trường.",
  },
  footer: {
    aboutTitle: "Về chúng tôi",
    aboutDescription:
      "Chúng tôi là đơn vị tiên phong trong lĩnh vực cung cấp các sản phẩm và giải pháp thân thiện với môi trường tại Việt Nam.",
    quickLinksTitle: "Liên kết nhanh",
    quickLinks: {
      home: "Trang chủ",
      about: "Giới thiệu",
      products: "Sản phẩm",
      services: "Dịch vụ",
      contact: "Liên hệ",
    },
    servicesTitle: "Dịch vụ",
    services: {
      organic: "Sản phẩm hữu cơ",
      recycle: "Tái chế bền vững",
      water: "Tiết kiệm nước",
      environmental: "Tư vấn môi trường",
    },
    contactTitle: "Liên hệ",
    contact: {
      address: "158 Bùi Quang Trinh, P. Phú Thứ, Q. Cái Răng, Tp. Cần Thơ",
      email: "bluemoonlight.travel@gmail.com",
      phone: "0942 190 022",
    },
    copyright: "Blue Moonlight Travel & Environment CO., LTD",
  },
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />

      {/* Banner/Message Section */}
      <section className="relative h-[80vh] min-h-[600px] w-full overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/nature-banner.jpg"
            alt={TEXT.banner.imageAlt}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
        <div className="container relative z-10 mx-auto flex h-full flex-col items-center justify-center px-4 text-center text-white">
          <h1 className="mb-4 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            {TEXT.banner.title}
          </h1>
          <p className="mb-8 max-w-2xl text-lg md:text-xl">
            {TEXT.banner.description}
          </p>
          <Link
            href="#products"
            className="group flex items-center rounded-full bg-green-600 px-6 py-3 text-lg font-medium text-white transition-all hover:bg-green-700"
          >
            {TEXT.banner.button}
            <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-white py-16" id="Services">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-800 md:text-4xl">
              {TEXT.services.sectionTitle}
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              {TEXT.services.sectionDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Service 1 */}
            <div className="group rounded-lg bg-white p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600">
                <Leaf className="h-7 w-7" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-800">
                {TEXT.services.service1.title}
              </h3>
              <p className="text-gray-600">
                {TEXT.services.service1.description}
              </p>
            </div>

            {/* Service 2 */}
            <div className="group rounded-lg bg-white p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600">
                <Recycle className="h-7 w-7" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-800">
                {TEXT.services.service2.title}
              </h3>
              <p className="text-gray-600">
                {TEXT.services.service2.description}
              </p>
            </div>

            {/* Service 3 */}
            <div className="group rounded-lg bg-white p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600">
                <Droplets className="h-7 w-7" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-800">
                {TEXT.services.service3.title}
              </h3>
              <p className="text-gray-600">
                {TEXT.services.service3.description}
              </p>
            </div>

            {/* Service 4 */}
            <div className="group rounded-lg bg-white p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600">
                <Shield className="h-7 w-7" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-800">
                {TEXT.services.service4.title}
              </h3>
              <p className="text-gray-600">
                {TEXT.services.service4.description}
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Projects Section */}
      <section className="bg-white py-16" id="Projects">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-800 md:text-4xl">
              {TEXT.projects.sectionTitle}
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              {TEXT.projects.sectionDescription}
            </p>
          </div>

          <ProjectsCarousel />
        </div>
      </section>

       {/* Quality Policy Section */}
       <QualityPolicy />

      {/* Featured Products Section */}
      <section id="products" className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-800 md:text-4xl">
              {TEXT.featuredProducts.sectionTitle}
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              {TEXT.featuredProducts.sectionDescription}
            </p>
          </div>

          <FeaturedProducts />
        </div>
      </section>

     
      {/* Footer */}
      <footer className="bg-gray-900 py-12 text-gray-300">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="mb-4 text-xl font-bold text-white">
                {TEXT.footer.aboutTitle}
              </h3>
              <p className="mb-4">{TEXT.footer.aboutDescription}</p>
              <SocialLinks />
            </div>

            <div>
              <h3 className="mb-4 text-xl font-bold text-white">
                {TEXT.footer.quickLinksTitle}
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:text-green-400">
                    {TEXT.footer.quickLinks.home}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-green-400">
                    {TEXT.footer.quickLinks.about}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-green-400">
                    {TEXT.footer.quickLinks.products}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-green-400">
                    {TEXT.footer.quickLinks.services}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-green-400">
                    {TEXT.footer.quickLinks.contact}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-xl font-bold text-white">
                {TEXT.footer.servicesTitle}
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:text-green-400">
                    {TEXT.footer.services.organic}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-green-400">
                    {TEXT.footer.services.recycle}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-green-400">
                    {TEXT.footer.services.water}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-green-400">
                    {TEXT.footer.services.environmental}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-xl font-bold text-white">
                {TEXT.footer.contactTitle}
              </h3>
              <address className="not-italic">
                <p className="mb-2">{TEXT.footer.contact.address}</p>
                <p className="mb-2">Email: {TEXT.footer.contact.email}</p>
                <p className="mb-2">Điện thoại: {TEXT.footer.contact.phone}</p>
              </address>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-800 pt-8 text-center">
            <p>&copy; {new Date().getFullYear()} {TEXT.footer.copyright}</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
