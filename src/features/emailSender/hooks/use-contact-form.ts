import { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useConfirmation } from "@/features/alert-dialog/context/alert-dialog-context";
import { ContactService } from "@/features/emailSender/services/contactService";
import { CreateContactDto, ContactResponseDto } from "@/lib/dto/contact.dto";
import { MailerService } from "@/features/emailSender/services/emailService";

export function useContactForm(onSuccess?: () => void) {
  console.log("=== useContactForm hook starting ===");
  
  try {
    const [isSubmitting, setIsSubmitting] = useState(false);
    console.log("useState OK");
    
    const { toast } = useToast();
    console.log("useToast OK");
    
    const { confirm } = useConfirmation();
    console.log("useConfirmation OK");
    
    const form = useForm<CreateContactDto>({ mode: "onChange" });
    console.log("useForm OK");
    
    console.log("useContactForm hook initialized successfully");

  const onSubmit = async (data: CreateContactDto) => {
    console.log("=== onSubmit function called ===");
    console.log("Data received:", data);
    
    const confirmed = await confirm(
      "Xác nhận gửi",
      "Bạn có chắc chắn muốn gửi thông tin liên hệ này?"
    );
    console.log("Confirmation result:", confirmed);
    if (!confirmed) return;

    // Chuẩn hóa dữ liệu theo schema
    const contactData: CreateContactDto = {
      name: data.name,
      email: data.email || null,
      phone: data.phone || null,
      description: data.description || ""
    };

    setIsSubmitting(true);
    
    console.log("=== EMAIL SENDER START ===");
    console.log("Form data:", contactData);

    try {
      // 1. Lưu contact
      console.log("Calling ContactService.createContact...");
      const result = await ContactService.createContact(contactData);
      const newContact = result.data as ContactResponseDto;
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
        description: result.message || "Thông tin liên hệ đã được gửi thành công",
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
