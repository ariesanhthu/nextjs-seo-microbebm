import { z } from 'zod'

// Client-side schema - copy từ CreateContactSchema nhưng không import GeneralSchema
export const ContactClientSchema = z.object({
  name: z.string({
    message: "Họ và tên phải là chuỗi"
  }).min(1, "Vui lòng nhập họ và tên").max(100, "Họ và tên quá dài"),
  
  email: z.string().email("Email không hợp lệ").nullable(),
  
  phone: z.string()
    .regex(/^\d{10}$/, 'Số điện thoại phải gồm đúng 10 chữ số')
    .length(10, "Số điện thoại phải gồm đúng 10 chữ số")
    .nullable(),

  description: z.string().max(1000, "Nội dung quá dài")
}).strict();
