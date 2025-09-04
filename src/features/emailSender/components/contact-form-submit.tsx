import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Send, CheckCircle, AlertTriangle } from "lucide-react"
import type { UseFormReturn } from "react-hook-form"
import { CreateContactDto } from "@/lib/dto/contact.dto";

interface ContactFormSubmitProps {
  form: UseFormReturn<CreateContactDto>
  isSubmitting: boolean
}

export function ContactFormSubmit({ form, isSubmitting }: ContactFormSubmitProps) {
  const {
    formState: { isValid, errors },
  } = form

  return (
    <div className="space-y-4 pt-2">
      {/* Validation Alert */}
      {!isValid && (
        <Alert className="border-amber-200 bg-amber-50/50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            Vui lòng điền đầy đủ thông tin bắt buộc và đảm bảo định dạng chính xác
          </AlertDescription>
        </Alert>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={!isValid || isSubmitting}

        className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 h-12 rounded-lg"
        size="lg"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Đang gửi thông tin...
          </>
        ) : (
          <>
            <Send className="mr-2 h-5 w-5" />
            Gửi yêu cầu tư vấn
          </>
        )}
      </Button>

      {/* Success Message Placeholder */}
      <div className="text-center">
        <p className="text-sm text-green-700 flex items-center justify-center gap-2">
          <CheckCircle className="h-4 w-4" />
          Chúng tôi cam kết phản hồi trong vòng 24 giờ
        </p>
      </div>
    </div>
  )
}
