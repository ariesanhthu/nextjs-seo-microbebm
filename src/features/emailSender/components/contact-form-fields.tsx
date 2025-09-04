import type { UseFormReturn } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { User, Mail, Phone, Leaf } from "lucide-react"

// Client-side type - không import server DTOs
type ContactFormData = {
  name: string;
  email: string | null;
  phone: string | null;
  description: string;
};

interface ContactFormFieldsProps {
  form: UseFormReturn<ContactFormData>
}

export function ContactFormFields({ form }: ContactFormFieldsProps) {
  const {
    register,
    formState: { errors },
  } = form

  return (
    <div className="space-y-6">
      {/* Name Field */}
      <div className="space-y-3">
        <label htmlFor="name" className="text-sm font-semibold text-green-800 flex items-center gap-2">
          <User className="h-4 w-4" />
          Họ và tên <span className="text-red-600">*</span>
        </label>
        <div className="relative">
          <Input
            id="name"
            {...register("name", {
              required: "Họ và tên là bắt buộc",
              minLength: {
                value: 1,
                message: "Vui lòng nhập họ và tên"
              },
              maxLength: {
                value: 100,
                message: "Họ và tên quá dài"
              }
            })}
            placeholder="Nhập họ và tên của bạn"
            className="border-green-200 focus:border-green-500 focus:ring-green-500/20 bg-green-50/30 text-black placeholder:text-green-600/60 h-12 rounded-lg"
            aria-invalid={!!errors.name}
          />
        </div>
        {errors.name && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <span className="w-1 h-1 bg-red-600 rounded-full"></span>
            {errors.name.message}
          </p>
        )}
      </div>
  
      {/* Phone Field (bắt buộc) */}
      <div className="space-y-3">
        <label htmlFor="phone" className="text-sm font-semibold text-green-800 flex items-center gap-2">
          <Phone className="h-4 w-4" />
          Số điện thoại <span className="text-red-600">*</span>
        </label>
        <div className="relative">
          <Input
            id="phone"
            type="tel"
            {...register("phone", {
              required: "Số điện thoại là bắt buộc",
              pattern: {
                value: /^\d{10}$/,
                message: "Số điện thoại phải gồm đúng 10 chữ số"
              },
              minLength: {
                value: 10,
                message: "Số điện thoại phải gồm đúng 10 chữ số"
              },
              maxLength: {
                value: 10,
                message: "Số điện thoại phải gồm đúng 10 chữ số"
              }
            })}
            placeholder="0123456789"
            className="border-green-200 focus:border-green-500 focus:ring-green-500/20 bg-green-50/30 text-black placeholder:text-green-600/60 h-12 rounded-lg"
            aria-invalid={!!errors.phone}
          />
        </div>
        {errors.phone && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <span className="w-1 h-1 bg-red-600 rounded-full"></span>
            {errors.phone.message}
          </p>
        )}
      </div>

      {/* Email Field (không bắt buộc) */}
      <div className="space-y-3">
        <label htmlFor="email" className="text-sm font-semibold text-green-800 flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Email liên hệ
        </label>
        <div className="relative">
          <Input
            id="email"
            type="email"
            {...register("email", {
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Email không hợp lệ"
              }
            })}
            placeholder="example@company.com"
            className="border-green-200 focus:border-green-500 focus:ring-green-500/20 bg-green-50/30 text-black placeholder:text-green-600/60 h-12 rounded-lg"
            aria-invalid={!!errors.email}
          />
        </div>
        {errors.email && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <span className="w-1 h-1 bg-red-600 rounded-full"></span>
            {errors.email.message}
          </p>
        )}
      </div>

    
      {/* Description Field */}
      <div className="space-y-3">
        <label htmlFor="description" className="text-sm font-semibold text-green-800 flex items-center gap-2">
          <Leaf className="h-4 w-4" />
          Nội dung yêu cầu
        </label>
        <Textarea
          id="description"
          {...register("description", {
            maxLength: {
              value: 1000,
              message: "Nội dung quá dài"
            }
          })}
          placeholder="Mô tả chi tiết về dự án môi trường, dịch vụ tư vấn hoặc yêu cầu hợp tác của bạn..."
          rows={5}
          className="resize-none border-green-200 focus:border-green-500 focus:ring-green-500/20 bg-green-50/30 text-black placeholder:text-green-600/60 rounded-lg"
          aria-invalid={!!errors.description}
        />
        {errors.description && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <span className="w-1 h-1 bg-red-600 rounded-full"></span>
            {errors.description.message}
          </p>
        )}
      </div>
    </div>
  )
}
