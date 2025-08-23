"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { CheckCircle, ChevronRight, Shield } from 'lucide-react'
import { cn } from "@/lib/utils"

// Text content configuration
const textContent = {
  badge: {
    iconLabel: "Cam kết chất lượng",
    title: "Chính sách chất lượng",
    description: "Chúng tôi cam kết mang đến những sản phẩm thân thiện với môi trường, đạt tiêu chuẩn cao nhất về chất lượng và độ bền vững."
  },
  features: [
    {
      title: "Cam kết bền vững",
      description: "Chúng tôi cam kết sử dụng nguyên liệu tái chế và có nguồn gốc bền vững, giảm thiểu tác động đến môi trường trong toàn bộ quy trình sản xuất."
    },
    {
      title: "Tiêu chuẩn ngành",
      description: "Sản phẩm của chúng tôi tuân thủ các tiêu chuẩn ngành nghiêm ngặt, được kiểm định và chứng nhận bởi các tổ chức uy tín trong và ngoài nước."
    },
    {
      title: "Cải tiến liên tục",
      description: "Chúng tôi không ngừng nghiên cứu và phát triển để cải tiến sản phẩm, áp dụng công nghệ mới nhằm nâng cao chất lượng và tính bền vững."
    },
    {
      title: "Hài lòng khách hàng",
      description: "Sự hài lòng của khách hàng là ưu tiên hàng đầu. Chúng tôi cam kết cung cấp sản phẩm chất lượng cao và dịch vụ khách hàng xuất sắc."
    }
  ],
  isoBadge: {
    title: "Tiêu chuẩn ISO",
    description: "Đạt chứng nhận ISO 14001 về Hệ thống quản lý môi trường"
  },
  cta: {
    label: "Tìm hiểu thêm",
    href: "/quality-policy"
  },
  image: {
    alt: "Cam kết chất lượng",
    src: "/images/quality-policy.jpg"
  }
}

export default function QualityPolicy() {
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
      className="relative overflow-hidden bg-gradient-to-b from-white to-green-50 py-16 md:py-24"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="leaf-pattern"
              patternUnits="userSpaceOnUse"
              width="80"
              height="80"
              patternTransform="rotate(45)"
            >
              <path
                d="M20,20 Q40,0 60,20 Q80,40 60,60 Q40,80 20,60 Q0,40 20,20 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#leaf-pattern)" />
        </svg>
      </div>

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
              src={textContent.image.src}
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