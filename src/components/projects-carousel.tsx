"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { IProject } from "@/utils/interface";
// Sample projects data
const projects = [
  {
    _id: 1,
    name: "Dự án trồng rừng Tây Nguyên",
    description:
      "Dự án trồng 10,000 cây xanh tại khu vực Tây Nguyên, góp phần phục hồi hệ sinh thái và chống biến đổi khí hậu.",
    image: "/images/project-1.jpg",
  },
  {
    _id: 2,
    name: "Hệ thống xử lý nước thải sinh học",
    description:
      "Thiết kế và xây dựng hệ thống xử lý nước thải sinh học cho khu công nghiệp, giúp giảm thiểu ô nhiễm môi trường.",
    image: "/images/project-2.jpg",
  },
  {
    _id: 3,
    name: "Chương trình tái chế rác thải nhựa",
    description:
      "Triển khai chương trình thu gom và tái chế rác thải nhựa tại các trường học, nâng cao ý thức bảo vệ môi trường.",
    image: "/images/project-3.jpg",
  },
]

export default function ProjectsCarousel() {
  // const [projects, setProjects] = useState<IProject[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const slideRef = useRef<HTMLDivElement>(null);

  // Fetch projects từ API khi component mount
  // useEffect(() => {
  //   async function fetchProjects() {
  //     try {
  //       const res = await fetch("/api/projects");
  //       if (!res.ok) {
  //         throw new Error("Failed to fetch projects");
  //       }
  //       const data = await res.json();
  //       console.log(data.data);
  //       // Giả sử API trả về mảng projects hoặc một object chứa projects
  //       setProjects(data.data || data);
  //     } catch (error) {
  //       console.error("Error fetching projects:", error);
  //     }
  //   }

  //   fetchProjects();
  // }, []);

  // Hàm chuyển slide tiếp theo
  const nextSlide = useCallback(() => {
    if (isAnimating || projects.length === 0) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, projects]);

  // Hàm chuyển slide trước đó
  const prevSlide = useCallback(() => {
    if (isAnimating || projects.length === 0) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, projects]);

  // Tự động chuyển slide sau mỗi 5 giây
  useEffect(() => {
    if (projects.length === 0) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [projects, nextSlide]);

  return (
    <div className="relative mx-auto max-w-5xl overflow-hidden rounded-xl">
      {projects.length > 0 ? (
        <>
          <div
            ref={slideRef}
            className="relative flex h-[500px] w-full transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {projects.map((project) => (
              <div key={project._id} className="relative min-w-full">
                <div className="relative h-full w-full">
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <h3 className="mb-2 text-2xl font-bold">{project.name}</h3>
                    <p className="mb-4 text-gray-200">{project.description}</p>
                    <Link
                      href="#"
                      className="inline-flex items-center rounded-full bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/30 text-white backdrop-blur-sm transition-all hover:bg-white/50"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/30 text-white backdrop-blur-sm transition-all hover:bg-white/50"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-2">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (isAnimating) return;
                  setIsAnimating(true);
                  setCurrentSlide(index);
                  setTimeout(() => setIsAnimating(false), 500);
                }}
                className={`h-2 w-8 rounded-full transition-all ${
                  currentSlide === index ? "bg-white" : "bg-white/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="flex h-[500px] items-center justify-center">
          <p className="text-gray-500">Loading projects...</p>
        </div>
      )}
    </div>
  );
}
