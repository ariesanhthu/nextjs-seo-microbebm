import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { ContactService } from "@/features/emailSender/services/contactService";
import { MailerService } from "@/features/emailSender/services/emailService";
import { ContactClientSchema } from "../schemas/contact-client.schema";
import { Button } from "@/components/ui/button";

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
    const router = useRouter();
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
      let emailSuccess = false;
      let emailError = null;
      
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
        
        // Kiểm tra kết quả email
        const failedTasks = results.filter(r => r.status === "rejected");
        const successfulTasks = results.filter(r => r.status === "fulfilled");
        
        console.log(`Email summary: ${successfulTasks.length} succeeded, ${failedTasks.length} failed`);
        
        // Log chi tiết lỗi
        failedTasks.forEach((r, idx) => {
          console.error(`Mailer task #${idx} failed:`, r.reason);
        });
        
        successfulTasks.forEach((r, idx) => {
          console.log(`Mailer task #${idx} succeeded:`, r.value);
        });
        
        // Xác định trạng thái email
        if (failedTasks.length === 0) {
          emailSuccess = true;
        } else {
          emailError = failedTasks[0].reason;
        }
        
      } catch (mailerError) {
        console.error("Error creating or using MailerService:", mailerError);
        emailError = mailerError;
      }

      // 3. Hiển thị toast dựa trên kết quả email
      console.log("Showing toast based on email result...");
      
      if (emailSuccess) {
        // Tất cả email đều thành công
        toast({
          title: "Thành công!",
          description: "Thông tin liên hệ đã được gửi thành công. Chúng tôi sẽ liên hệ lại sớm nhất!",
          duration: 5000,
          action: (
            <Button
              onClick={() => router.push('/')}
              className="btn-primary text-white px-3 py-1 rounded text-sm font-medium transition-colors"
            >
              Về trang chủ
            </Button>
          ),
        });
        
        // Redirect ngay lập tức
        setTimeout(() => {
          router.push('/');
        }, 100);
      } else {
        // Có lỗi email, hiển thị thông báo phù hợp
        let errorMessage = "Chúng tôi đã ghi nhận liên hệ của bạn vào hệ thống và sẽ liên hệ lại sớm nhất có thể.";
        
        if (emailError instanceof Error) {
          if (emailError.message.includes("configuration") || emailError.message.includes("Missing")) {
            errorMessage = "Chúng tôi đã ghi nhận liên hệ của bạn vào hệ thống. Email service tạm thời không khả dụng, nhưng chúng tôi sẽ liên hệ lại sớm nhất.";
          } else if (emailError.message.includes("access denied") || emailError.message.includes("403")) {
            errorMessage = "Chúng tôi đã ghi nhận liên hệ của bạn vào hệ thống. Email service tạm thời không khả dụng, nhưng chúng tôi sẽ liên hệ lại sớm nhất.";
          } else if (emailError.message.includes("Google Apps Script")) {
            errorMessage = "Chúng tôi đã ghi nhận liên hệ của bạn vào hệ thống. Email service tạm thời không khả dụng, nhưng chúng tôi sẽ liên hệ lại sớm nhất.";
          }
        }
        
        toast({
          title: "Thông tin đã được ghi nhận",
          description: errorMessage,
          duration: 5000,
          action: (
            <Button
              onClick={() => router.push('/')}
              className="btn-primary px-3 py-1 rounded text-sm font-medium transition-colors"
            >
              Về trang chủ
            </Button>
          ),
        });
        
        // Redirect ngay lập tức
        setTimeout(() => {
          router.push('/');
        }, 100);
      }

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