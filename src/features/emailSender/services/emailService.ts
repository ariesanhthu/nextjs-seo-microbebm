import { renderAdminHtml } from "../templates/admin-noti";
import { renderClientHtml } from "../templates/client-confirm";
import { isValidEmail, sanitizeEmailContent, formatEmailForDisplay } from "../templates/email-format";

// Client-side type - không import server DTOs
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

export class MailerService {

  private async send(payload: { recipient: string; subject: string; body: string }) {
    console.log("=== MailerService.send called ===");
    console.log("Payload:", { recipient: payload.recipient, subject: payload.subject });
    
    // Validate payload before sending
    if (!payload.recipient?.trim()) {
      throw new Error("Recipient email is required");
    }
    if (!payload.subject?.trim()) {
      throw new Error("Email subject is required");
    }
    if (!payload.body?.trim()) {
      throw new Error("Email body is required");
    }

    // Email validation using utility function
    if (!isValidEmail(payload.recipient)) {
      throw new Error("Invalid email address format");
    }
    
    const requestBody = {
      recipient: formatEmailForDisplay(payload.recipient),
      subject: sanitizeEmailContent(payload.subject),
      body: sanitizeEmailContent(payload.body),
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
    
    // Check if response is JSON
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await res.text();
      console.error("Non-JSON response:", text);
      throw new Error("Server returned non-JSON response. Please check your API configuration.");
    }
    
    const text = await res.text();
    console.log("Response text:", text);
    
    let json: any = {};
    try {
      json = text ? JSON.parse(text) : {};
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      throw new Error("Server returned invalid JSON response. Please check your API configuration.");
    }

    if (!res.ok || json?.status === "error") {
      const reason = json?.message || res.statusText || "Unknown error";
      console.error("Mailer failed:", reason);
      console.error("Full response:", { status: res.status, statusText: res.statusText, json });
      
      // Provide more specific error messages
      if (res.status === 400) {
        throw new Error(`Invalid request: ${reason}`);
      } else if (res.status === 403) {
        throw new Error("Email service access denied. Please check your Google Apps Script configuration and API key.");
      } else if (res.status === 500) {
        if (reason.includes("configuration")) {
          throw new Error("Email service configuration error. Please check environment variables.");
        } else if (reason.includes("Google Apps Script")) {
          throw new Error("Google Apps Script error. Please check your script configuration.");
        } else {
          throw new Error(`Server error: ${reason}`);
        }
      } else {
        throw new Error(`Email service error: ${reason}`);
      }
    }

    console.log("Mailer success:", json);
    return json;
  }

  /** Gửi thông báo cho admin */
  async sendNotiAdmin(contact: ContactResponse) {
    console.log("sendNotiAdmin called with contact:", contact);
    return this.send({
      recipient: "aries.anhthu@gmail.com",
      subject: `New form submission from ${contact.name || "Unknown"}`,
      body: renderAdminHtml(contact),
    });
  }

  /** Gửi email xác nhận cho khách */
  async sendConfirmClient(contact: ContactResponse) {
    console.log("sendConfirmClient called with contact:", contact);
    if (!contact.email) throw new Error("Contact email missing");
    
    return this.send({
      recipient: contact.email,
      subject: `Microbe BM đã nhận thông tin của bạn`,
      body: renderClientHtml(contact, "Microbe BM"),
    });
  }
}
