"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, Building2, Phone } from "lucide-react"
import { useContactForm } from "../hooks/use-contact-form"
import { ContactFormFields } from "./contact-form-fields"
import { ContactFormSubmit } from "./contact-form-submit"

interface ContactFormProps {
  className?: string
  onSuccess?: () => void
}

export default function ContactForm({ className, onSuccess }: ContactFormProps) {
  const { form, isSubmitting, onSubmit } = useContactForm(onSuccess)

  return (
    <div className={`max-w-2xl mx-auto ${className}`}>
      <Card className="border-green-200 shadow-xl bg-white/95 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100 rounded-t-lg">
          <CardTitle className="flex items-center gap-3 text-2xl font-bold text-green-800">
            <div className="p-2 bg-green-100 rounded-lg">
              <Leaf className="h-6 w-6 text-green-600" />
            </div>
            Liên hệ tư vấn môi trường
          </CardTitle>
          <CardDescription className="text-green-700 text-base leading-relaxed">
            Chúng tôi cung cấp giải pháp môi trường toàn diện cho doanh nghiệp. Hãy để lại thông tin, chuyên gia của
            chúng tôi sẽ liên hệ tư vấn miễn phí trong 24h.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8">
          <form onSubmit={onSubmit} className="space-y-6">
            <ContactFormFields form={form} />
            <ContactFormSubmit form={form} isSubmitting={isSubmitting} />
          </form>

          {/* Contact Info */}
          <div className="mt-8 pt-6 border-t border-green-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-green-700">
                <Building2 className="h-4 w-4" />
                <span>Tư vấn chuyên nghiệp 24/7</span>
              </div>
              <div className="flex items-center gap-2 text-green-700">
                <Phone className="h-4 w-4" />
                <span>Hotline: 1900 xxxx</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
