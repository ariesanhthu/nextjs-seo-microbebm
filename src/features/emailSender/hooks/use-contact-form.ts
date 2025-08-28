import { useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateContactFormData, CreateContactSchema } from "../schemas/contact.schema";
import { useToast } from "@/hooks/use-toast";
import { useConfirmation } from "@/features/alert-dialog/context/alert-dialog-context";
import { ContactService } from "../services/contactService";

export function useContactForm(onSuccess?: () => void) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { confirm } = useConfirmation();

  const form = useForm<CreateContactFormData>({
    resolver: zodResolver(CreateContactSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: CreateContactFormData) => {
    // Validation đã do Zod đảm nhiệm: name + phone bắt buộc, email không bắt buộc

    const confirmed = await confirm(
      "Xác nhận gửi",
      "Bạn có chắc chắn muốn gửi thông tin liên hệ này?"
    );

    if (!confirmed) return;

    setIsSubmitting(true);
    try {
      const result = await ContactService.createContact(data);
      
      toast({
        title: "Thành công!",
        description: result.message || "Thông tin liên hệ đã được gửi thành công",
      });

      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting contact:", error);
      
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Có lỗi xảy ra khi gửi thông tin",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
