import crypto from "crypto";
import { ContactResponseDto } from "@/lib/dto/contact.dto";
import { renderAdminHtml } from "./templates/admin-noti";
import { renderClientHtml } from "./templates/client-confirm";

function hmac(secret: string, message: string) {
  const buf = crypto.createHmac("sha256", secret).update(message).digest();
  const b64 = buf.toString("base64");
  const b64url = b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  return {
    base64: b64,
    base64url: b64url,
    hex: buf.toString("hex"),
  };
}

export class MailerService {
  private url = process.env.APPS_SCRIPT_URL!;
  private secret = process.env.APPS_SCRIPT_SECRET!;
  private brand = process.env.MAIL_BRAND_NAME || "YourBrand";
  private admin = process.env.ADMIN_EMAIL!;

  constructor() {
    if (!this.url) throw new Error("Missing APPS_SCRIPT_URL");
    if (!this.secret) throw new Error("Missing APPS_SCRIPT_SECRET");
  }

  private async send(payload: any) {
    const ts = Date.now().toString();
    // Phải khớp Apps Script: toSign = ts + "." + JSON.stringify(data)
    // Đảm bảo luôn có field email (Apps Script có thể require)
    const normalized = { email: payload.email ?? "", ...payload };
    const dataJson = JSON.stringify(normalized);
    const message = `${ts}.${dataJson}`;
    const signatures = hmac(this.secret, message);

    if (process.env.MAIL_DEBUG === "1") {
      console.log("[Mailer] ts:", ts);
      console.log("[Mailer] message:", message);
      console.log("[Mailer] dataJson:", dataJson);
      console.log("[Mailer] sig(base64):", signatures.base64);
      console.log("[Mailer] sig(base64url):", signatures.base64url);
      console.log("[Mailer] sig(hex):", signatures.hex);
    }

    const body = {
      data: normalized, // giữ nguyên data dạng object, có email
      ts,
      sig: signatures.base64,
      sig_b64url: signatures.base64url,
      sig_hex: signatures.hex,
      v: 1,
      dataJson, // Gửi kèm chuỗi đã dùng để ký để Apps Script verify trực tiếp
    };

    const res = await fetch(this.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Nhiều Apps Script mẫu đọc chữ ký qua header
        "X-Timestamp": ts,
        "X-Signature": signatures.base64,
        "X-Signature-B64Url": signatures.base64url,
        "X-Signature-Hex": signatures.hex,
        "X-Data-Json": dataJson,
      },
      body: JSON.stringify(body),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok || !json?.ok) {
      throw new Error(`Mailer failed: ${json?.error || res.statusText}`);
    }
    return json;
  }

  /** Gửi thông báo cho admin */
  async sendNotiAdmin(contact: ContactResponseDto) {
    return this.send({
      to: this.admin,
      subject: `New form submission from ${contact.name || "Unknown"}`,
      plainBody: `You have a new submission:\n\n${JSON.stringify(contact, null, 2)}`,
      htmlBody: renderAdminHtml(contact),
      replyTo: contact.email || undefined
    });
  }

  /** Gửi email xác nhận cho khách */
  async sendConfirmClient(contact: ContactResponseDto) {
    if (!contact.email) throw new Error("Contact email missing");
    return this.send({
      to: contact.email,
      subject: `✅ ${this.brand} đã nhận thông tin của bạn`,
      plainBody: `Chào ${contact.name || "bạn"},\n\nCảm ơn bạn đã liên hệ ${this.brand}.`,
      htmlBody: renderClientHtml(contact, this.brand),
      replyTo: this.admin
    });
  }
}
