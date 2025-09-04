import { Loader2 } from "lucide-react"
import { Suspense } from "react"

export default function SuspenseBoundary({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-24">
        <div className="text-center">
          <div className="relative mb-6">
            <Loader2 className="h-16 w-16 animate-spin text-green-600 mx-auto" />
          </div>
          <p className="text-lg text-slate-600 font-medium">Đang tải bài viết về môi trường...</p>
          <p className="text-sm text-slate-500 mt-1">Vui lòng chờ trong giây lát</p>
        </div>
      </div>}>
      {children}
    </Suspense>
  )
}