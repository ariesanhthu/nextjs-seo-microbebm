import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { ContactService } from "@/features/emailSender/services/contactService";
import { MailerService } from "@/features/emailSender/services/emailService";
import { ContactClientSchema } from "../schemas/contact-client.schema";

// Client-side type - không import server DTOs
type ContactFormData = {
  name: string;
  email: string | null;
  phone: string | null;
  description: string;
};

type ContactResponse = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  description: string;
  is_check: boolean;
  created_at: any;
  updated_at: any;
};

export function useContactForm(onSuccess?: () => void) {
  console.log("=== useContactForm hook starting ===");
  
  try {
    const [isSubmitting, setIsSubmitting] = useState(false);
    console.log("useState OK");
    
    const { toast } = useToast();
    console.log("useToast OK");
    
    const form = useForm<ContactFormData>({ 
      mode: "onChange",
      resolver: zodResolver(ContactClientSchema)
    });
    console.log("useForm OK");
    
    console.log("useContactForm hook initialized successfully");

  const onSubmit = async (data: ContactFormData) => {
    console.log("=== onSubmit function called ===");
    console.log("Data received:", data);

    // Dữ liệu đã được validate bởi zodResolver, không cần chuẩn hóa thêm
    const contactData = data;

    setIsSubmitting(true);
    
    console.log("=== EMAIL SENDER START ===");
    console.log("Form data:", contactData);

    try {
      // 1. Lưu contact
      console.log("Calling ContactService.createContact...");
      const result = await ContactService.createContact(contactData);
      const newContact = result.data as ContactResponse;
      console.log("Contact saved successfully:", newContact);

      // 2. Gửi email
      console.log("Creating MailerService...");
      try {
        const mailer = new MailerService();
        console.log("MailerService created successfully");
        
        const tasks: Promise<unknown>[] = [];

        // Luôn gửi thông báo cho admin
        console.log("Adding admin notification task");
        tasks.push(mailer.sendNotiAdmin(newContact));

        // Gửi xác nhận cho client nếu có email
        if (newContact.email) {
          console.log("Adding client confirmation task");
          tasks.push(mailer.sendConfirmClient(newContact));
        } else {
          console.log("No email provided, skipping client confirmation");
        }

        console.log(`Executing ${tasks.length} email tasks...`);
        const results = await Promise.allSettled(tasks);
        
        console.log("Email results:", results);
        results.forEach((r, idx) => {
          if (r.status === "rejected") {
            console.error(`Mailer task #${idx} failed:`, r.reason);
          } else {
            console.log(`Mailer task #${idx} succeeded:`, r.value);
          }
        });
      } catch (mailerError) {
        console.error("Error creating or using MailerService:", mailerError);
        
        // Hiển thị lỗi cụ thể cho user
        if (mailerError instanceof Error && mailerError.message.includes("Missing")) {
          toast({
            title: "Cấu hình email chưa hoàn tất",
            description: "Vui lòng liên hệ quản trị viên để thiết lập email service",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Lỗi gửi email",
            description: "Không thể gửi email xác nhận. Thông tin đã được lưu thành công.",
            variant: "destructive",
          });
        }
        // Không throw error để không làm fail form submission
      }

      // 3. Hiển thị toast
      console.log("Showing success toast...");
      toast({
        title: "Thành công!",
        description: "Thông tin liên hệ đã được gửi thành công. Chúng tôi sẽ liên hệ lại sớm nhất!",
      });

      form.reset();
      onSuccess?.();
      
      console.log("=== EMAIL SENDER END ===");
    } catch (error) {
      console.error("Error submitting contact:", error);

      toast({
        title: "Lỗi",
        description:
          error instanceof Error
            ? error.message
            : "Có lỗi xảy ra khi gửi thông tin",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    onSubmit,
  };
  } catch (error) {
    console.error("Error in useContactForm:", error);
    throw error;
  }
}
