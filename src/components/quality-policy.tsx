"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { CheckCircle, ChevronRight, Shield } from 'lucide-react'
import { cn } from "@/lib/utils"
import BackgroundPattern from "@/components/background-pattern"

// Text content configuration
const textContent = {
  badge: {
    iconLabel: "Cam kết chất lượng",
    title: "Chính sách chất lượng",
    description: "BME cam kết bền vững, tuân thủ tiêu chuẩn, cải tiến liên tục và đảm bảo hài lòng khách hàng."
  },
  features: [
    {
      title: "Cam kết bền vững",
      description: "BME sử dụng chủng vi sinh an toàn, có nguồn gốc rõ ràng, thân thiện với môi trường, giảm thiểu ô nhiễm trong toàn bộ quá trình xử lý."
    },
    {
      title: "Tuân thủ tiêu chuẩn ngành",
      description: "Mọi chế phẩm vi sinh đều đáp ứng các quy định kỹ thuật nghiêm ngặt, được kiểm định chất lượng trước khi đưa ra thị trường."
    },
    {
      title: "Cải tiến liên tục",
      description: "Chúng tôi nghiên cứu và tối ưu công thức vi sinh, nâng cao hiệu quả xử lý BOD, COD, Nito, Photpho và giảm chi phí vận hành hệ thống."
    },
    {
      title: "Hài lòng khách hàng",
      description: "BME luôn đồng hành cùng khách hàng, hỗ trợ kỹ thuật tận nơi và đảm bảo hệ thống vận hành ổn định, đầu ra đạt chuẩn."
    }
  ],
  isoBadge: {
    title: "Tiêu chuẩn ISO",
    description: "Đạt chứng nhận ISO 14001 về Hệ thống quản lý môi trường"
  },
  cta: {
    label: "Tìm hiểu thêm",
    href: "https://drive.google.com/file/d/10QROd9pesoIdcfZIJk8wo3mag7-Fc9_O/view"
  },
  image: {
    alt: "Cam kết chất lượng"
  }
}

interface QualityPolicyProps {
  imageSrc?: string
}

export default function QualityPolicy({ imageSrc = "/images/quality-policy.jpg" }: QualityPolicyProps) {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-b from-white to-green-50 py-16 md:py-24 px-10"
    >
      {/* Background Pattern */}
      <BackgroundPattern
        type="leaf"
        color="currentColor"
        opacity={0.05}
        rotation={45}
        spacing={80}
        strokeWidth={1}
      />

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto mb-12 max-w-xl text-center">
          <div className="mb-3 inline-flex items-center justify-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
            <Shield className="mr-1.5 h-4 w-4" />
            {textContent.badge.iconLabel}
          </div>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            {textContent.badge.title}
          </h2>
          <p className="text-lg text-gray-600">
            {textContent.badge.description}
          </p>
        </div>

        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
          {/* Image */}
          <div
            className={cn(
              "relative mx-auto h-[400px] w-full max-w-md overflow-hidden rounded-2xl shadow-xl transition-all duration-1000 lg:mx-0 lg:h-[500px] lg:max-w-none",
              isVisible ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"
            )}
          >
            <Image
              src={imageSrc}
              alt={textContent.image.alt}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="rounded-lg bg-white/90 p-4 backdrop-blur-sm">
                <div className="flex items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <Shield className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {textContent.isoBadge.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {textContent.isoBadge.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div
            className={cn(
              "transition-all duration-1000 delay-300",
              isVisible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
            )}
          >
            <div className="space-y-6">
              {textContent.features.map((feature, index) => (
                <div className="flex" key={index}>
                  <div className="mr-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-semibold text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}

              <div className="pt-4">
                <Link
                  href={textContent.cta.href}
                  className="group inline-flex items-center rounded-full bg-green-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-green-700"
                >
                  {textContent.cta.label}
                  <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}