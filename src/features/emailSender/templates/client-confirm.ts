import { ContactResponseDto } from "@/lib/dto/contact.dto";
import { fmt, escapeHtml } from "./email-format";

/**
 * 2) Email gửi KHÁCH HÀNG: Xác nhận đã nhận thông tin
 */
export function renderClientHtml(contact: ContactResponseDto, brandName: string) {
  const name = contact.name?.trim() ? escapeHtml(contact.name) : "bạn";
  const email = fmt(contact.email);
  const phone = fmt(contact.phone);
  const desc = fmt(contact.description);
  const safeBrand = escapeHtml(brandName || "Chúng tôi");

  return `
<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Xác nhận liên hệ</title>
  <style>
    .container { width:100%; background:#f6f6f8; padding:24px 0; }
    .card { width:100%; max-width:640px; margin:0 auto; background:#ffffff; border:1px solid #eaeaea; }
    .pad { padding:24px; }
    .brand { font:700 20px/1.3 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; color:#0f172a; }
    .muted { color:#64748b; font:400 13px/1.5 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; }
    .title { font:700 18px/1.4 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; color:#0f172a; margin:0; }
    .hr { border:none; border-top:1px solid #eaeaea; margin:16px 0; }
    .p { color:#0f172a; font:400 14px/1.7 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; margin:0 0 12px; }
    .small { color:#64748b; font:400 12px/1.5 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; }
    @media (prefers-color-scheme: dark) {
      .container { background:#0b1220; }
      .card { background:#0f172a; border-color:#1f2a44; }
      .brand, .title, .p { color:#e2e8f0; }
      .muted, .small { color:#94a3b8; }
      .hr { border-top-color:#1f2a44; }
    }
  </style>
</head>
<body style="margin:0; padding:0; background:#f6f6f8;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" class="container">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" class="card">
          <tr>
            <td class="pad" style="border-bottom:1px solid #eaeaea;">
              <div class="brand">${safeBrand}</div>
              <div class="muted">Xác nhận đã nhận yêu cầu liên hệ</div>
            </td>
          </tr>
          <tr>
            <td class="pad">
              <h1 class="title">Xin chào ${name},</h1>
              <p class="p">
                Cảm ơn bạn đã liên hệ với ${safeBrand}. Chúng tôi đã ghi nhận thông tin và sẽ phản hồi trong thời gian sớm nhất.
              </p>

              <hr class="hr" />
              <p class="p"><strong>Thông tin bạn đã cung cấp</strong></p>
              <table role="presentation" cellpadding="6" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="color:#475569; font-weight:600;" width="140">Họ & tên</td>
                  <td style="color:#0f172a;">${name}</td>
                </tr>
                <tr>
                  <td style="color:#475569; font-weight:600;">Email</td>
                  <td style="color:#0f172a;">${email}</td>
                </tr>
                <tr>
                  <td style="color:#475569; font-weight:600;">Số điện thoại</td>
                  <td style="color:#0f172a;">${phone}</td>
                </tr>
                <tr>
                  <td style="color:#475569; font-weight:600;">Nội dung</td>
                  <td style="color:#0f172a;">${desc}</td>
                </tr>
              </table>

              <hr class="hr" />
              <p class="small">
                Nếu bạn cần bổ sung thông tin, chỉ cần trả lời email này hoặc liên hệ qua các kênh chính thức của ${safeBrand}.
              </p>
            </td>
          </tr>
          <tr>
            <td class="pad" style="border-top:1px solid #eaeaea;">
              <div class="small">
                © ${new Date().getFullYear()} ${safeBrand}. Email được gửi tự động từ hệ thống website.
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
