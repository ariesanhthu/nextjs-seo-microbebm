"use client";

import ContactForm from '@/features/emailSender/components/contactForm';

export default function EmailSenderPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <ContactForm/>
      </div>
    </div>
  );
}