"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SlideShow, { SlideItem } from "@/components/banner-slider";
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
  const [currentSlide, setCurrentSlide] = useState(0);

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

  const slideItems: SlideItem[] = useMemo(
    () =>
      projects.map((p) => ({
        image: p.image,
      })),
    []
  );

  return (
    <div className="relative mx-auto max-w-5xl overflow-hidden rounded-xl">
      {projects.length > 0 ? (
        <SlideShow
          items={slideItems}
          heightClass="h-[500px]"
          autoIntervalMs={3000}
          onIndexChange={setCurrentSlide}
          renderOverlay={(_, index) => {
            const project = projects[index];
            return (
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
            );
          }}
        />
      ) : (
        <div className="flex h-[500px] items-center justify-center">
          <p className="text-gray-500">Loading projects...</p>
        </div>
      )}
    </div>
  );
}
