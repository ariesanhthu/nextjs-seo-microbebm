import { Building2, Target, Eye, Gem } from "lucide-react"
import SectionHeader from "@/features/section-about/components/section-style/section-header"
import { EStyleSection } from "@/lib/enums/style-section.enum"

export default function AboutHomepage() {
  return (
    <section className="py-16" id="About">
      <div className="container mx-auto px-10">
        <SectionHeader
          section={{
            title: "Blue Moonlight Environment",
            subtitle: "Đồng hành cùng doanh nghiệp hướng đến phát triển bền vững.",
            image_url: null,
            subsection: [],
            style: EStyleSection.NOIMAGE,
          }}
          className="mb-12 text-center"
        //   titleClassName="mb-4 text-2xl font-bold md:text-4xl text-emerald-800 dark:text-emerald-200"
        //   subtitleClassName="mx-auto max-w-2xl text-foreground"
        />

        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Intro */}
          <div className="group rounded-lg bg-white p-4 sm:p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg">
            <div className="mb-4 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-green-100 text-green-600 mx-auto sm:mx-0">
              <Building2 className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>
            <h3 className="mb-3 text-lg sm:text-xl font-semibold text-gray-800 text-center sm:text-left">
              Về chúng tôi
            </h3>
            <p className="text-gray-600 text-center sm:text-left text-sm sm:text-base">
              Tiên phong giải pháp vi sinh và công nghệ môi trường.
            </p>
          </div>

          {/* Mission */}
          <div className="group rounded-lg bg-white p-4 sm:p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg">
            <div className="mb-4 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-green-100 text-green-600 mx-auto sm:mx-0">
              <Target className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>
            <h3 className="mb-3 text-lg sm:text-xl font-semibold text-gray-800 text-center sm:text-left">
              Sứ mệnh
            </h3>
            <p className="text-gray-600 text-center sm:text-left text-sm sm:text-base">
              Nghiên cứu và cung cấp chế phẩm vi sinh hiệu quả, bảo vệ môi trường, tối ưu chi phí vận hành.
            </p>
          </div>

          {/* Vision */}
          <div className="group rounded-lg bg-white p-4 sm:p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg">
            <div className="mb-4 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-green-100 text-green-600 mx-auto sm:mx-0">
              <Eye className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>
            <h3 className="mb-3 text-lg sm:text-xl font-semibold text-gray-800 text-center sm:text-left">
              Tầm nhìn
            </h3>
            <p className="text-gray-600 text-center sm:text-left text-sm sm:text-base">
              Trở thành thương hiệu uy tín trong lĩnh vực vi sinh và xử lý môi trường tại Việt Nam.
            </p>
          </div>

          {/* Core Values */}
          <div className="group rounded-lg bg-white p-4 sm:p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg">
            <div className="mb-4 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-green-100 text-green-600 mx-auto sm:mx-0">
              <Gem className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>
            <h3 className="mb-3 text-lg sm:text-xl font-semibold text-gray-800 text-center sm:text-left">
              Giá trị cốt lõi
            </h3>
            <p className="text-gray-600 text-center sm:text-left text-sm sm:text-base">
              Chất lượng – Đổi mới – Bền vững – Đồng hành cùng khách hàng.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}


