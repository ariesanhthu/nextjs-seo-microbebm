import { z } from 'zod'
import { GeneralSchema } from './general.schema'


export const ContactSchema = GeneralSchema.extend({
  name: z.string({
    message: "Họ và tên phải là chuỗi"
  }).min(1, "Vui lòng nhập họ và tên").max(100, "Họ và tên quá dài"),
  
  email: z.string().email("Email không hợp lệ").nullable().default(null),
  
  phone: z.string({
    message: "Số điện thoại phải là chuỗi"
  })
    .regex(/^\d{10}$/, 'Số điện thoại phải gồm đúng 10 chữ số')
    .length(10, "Số điện thoại phải gồm đúng 10 chữ số"),
  
  description: z.string({
    message: "Nội dung phải là chuỗi"
  }).max(1000, "Nội dung quá dài").default(""),
  
  is_check: z.boolean({
    message: "Trạng thái kiểm tra phải là boolean"
  }).default(false)
}).strict();

export const CreateContactSchema = ContactSchema.pick({
  name: true,
  email: true,
  phone: true,
  description: true
}).extend({
  email: z.string().email("Email không hợp lệ").nullable(),
  phone: z.string()
    .regex(/^\d{10}$/, 'Số điện thoại phải gồm đúng 10 chữ số')
    .length(10, "Số điện thoại phải gồm đúng 10 chữ số"),
  description: z.string().max(1000, "Nội dung quá dài")
});


export const UpdateContactSchema = z.object({
  name: z.string({message: "Họ và tên phải là chuỗi"}),

  email: z.string().email("Email không hợp lệ").nullable(),

  phone: z.string()
    .regex(/^\d{10}$/, 'Số điện thoại phải gồm đúng 10 chữ số')
    .length(10, "Số điện thoại phải gồm đúng 10 chữ số"),

  description: z.string({
    message: "Nội dung phải là chuỗi"
  }).max(1000, "Nội dung quá dài").default(""),

  is_check: z.boolean({
    message: "Trạng thái kiểm tra phải là boolean"
  }).default(false)
}).partial();

export const ContactResponseSchema = ContactSchema;