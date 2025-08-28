import { z } from 'zod'

// Client-side schema cho emailSender feature
export const CreateContactSchema = z.object({
  name: z.string({
    message: "Họ và tên phải là chuỗi"
  }).min(1, "Vui lòng nhập họ và tên").max(100, "Họ và tên quá dài"),
  
  // Email không bắt buộc; nếu có thì đúng định dạng; cho phép ""/null
  email: z.string().email("Email không hợp lệ").optional().or(z.literal("")).nullable(),
  
  // Số điện thoại bắt buộc: đúng 10 chữ số
  phone: z.string({
    message: "Số điện thoại phải là chuỗi"
  }).regex(/^\d{10}$/, 'Số điện thoại phải gồm đúng 10 chữ số'),
  
  // Nội dung không bắt buộc
  description: z.string({
    message: "Nội dung phải là chuỗi"
  }).max(1000, "Nội dung quá dài").optional().or(z.literal(""))
});

export type CreateContactFormData = z.infer<typeof CreateContactSchema>;
