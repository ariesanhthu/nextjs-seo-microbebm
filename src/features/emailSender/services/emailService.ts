import { ContactResponseDto } from "@/lib/dto/contact.dto";
import { renderAdminHtml } from "../templates/admin-noti";
import { renderClientHtml } from "../templates/client-confirm";

export class MailerService {

  private async send(payload: { recipient: string; subject: string; body: string }) {
    console.log("=== MailerService.send called ===");
    console.log("Payload:", { recipient: payload.recipient, subject: payload.subject });
    
    const requestBody = {
      recipient: payload.recipient,
      subject: payload.subject,
      body: payload.body,
    };

    console.log("Sending request to /api/send");
    const res = await fetch('/api/send', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    console.log("Response status:", res.status);
    const text = await res.text().catch(() => "");
    console.log("Response text:", text);
    
    let json: any = {};
    try {
      json = text ? JSON.parse(text) : {};
    } catch {}

    if (!res.ok || json?.status === "error") {
      const reason = json?.message || res.statusText || "Unknown";
      console.error("Mailer failed:", reason);
      console.error("Full response:", { status: res.status, statusText: res.statusText, json });
      
      // Provide more specific error messages
      if (reason === "Unauthorized") {
        throw new Error("Email service authentication failed. Please check your API key configuration.");
      } else if (reason.includes("missing")) {
        throw new Error("Email service configuration is incomplete. Please check environment variables.");
      } else {
        throw new Error(`Email service error: ${reason}`);
      }
    }

    console.log("Mailer success:", json);
    return json;
  }

  /** Gửi thông báo cho admin */
  async sendNotiAdmin(contact: ContactResponseDto) {
    console.log("sendNotiAdmin called with contact:", contact);
    return this.send({
      recipient: "aries.anhthu@gmail.com",
      subject: `New form submission from ${contact.name || "Unknown"}`,
      body: renderAdminHtml(contact),
    });
  }

  /** Gửi email xác nhận cho khách */
  async sendConfirmClient(contact: ContactResponseDto) {
    console.log("sendConfirmClient called with contact:", contact);
    if (!contact.email) throw new Error("Contact email missing");
    
    return this.send({
      recipient: contact.email,
      subject: `Microbe BM đã nhận thông tin của bạn`,
      body: renderClientHtml(contact, "Microbe BM"),
    });
  }
}
