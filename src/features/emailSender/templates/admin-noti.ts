import { ContactResponseDto } from "@/lib/dto/contact.dto";
import { fmt } from "./email-format";
/**
 * 1) Email gửi ADMIN: Thông báo có liên hệ mới
 */
export function renderAdminHtml(contact: ContactResponseDto) {
  const name = fmt(contact.name);
  const email = fmt(contact.email);
  const phone = fmt(contact.phone);
  const desc = fmt(contact.description);

  return `
<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Liên hệ mới</title>
  <style>
    /* Chỉ dùng các thuộc tính an toàn cho email client */
    .container { width:100%; background:#f6f6f8; padding:24px 0; }
    .card { width:100%; max-width:640px; margin:0 auto; background:#ffffff; border:1px solid #eaeaea; }
    .pad { padding:24px; }
    .brand { font:700 20px/1.3 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; color:#0f172a; }
    .muted { color:#64748b; font:400 13px/1.5 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; }
    .title { font:700 18px/1.4 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; color:#0f172a; margin:0; }
    .hr { border:none; border-top:1px solid #eaeaea; margin:16px 0; }
    .label { color:#475569; font-weight:600; white-space:nowrap; vertical-align:top; }
    .value { color:#0f172a; }
    .btn { display:inline-block; background:#0ea5e9; color:#ffffff !important; text-decoration:none; padding:10px 16px; border-radius:6px; font-weight:600; }
    .footer { color:#94a3b8; font:400 12px/1.5 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; }
    @media (prefers-color-scheme: dark) {
      .container { background:#0b1220; }
      .card { background:#0f172a; border-color:#1f2a44; }
      .brand, .title, .value { color:#e2e8f0; }
      .muted, .label, .footer { color:#94a3b8; }
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
              <div class="brand">Thông báo liên hệ mới</div>
              <div class="muted">Có khách hàng vừa gửi thông tin qua form liên hệ.</div>
            </td>
          </tr>
          <tr>
            <td class="pad">
              <h1 class="title">Chi tiết khách hàng</h1>
              <hr class="hr" />
              <table role="presentation" cellpadding="6" cellspacing="0" border="0" width="100%">
                <tr>
                  <td class="label" width="140">Họ & tên</td>
                  <td class="value">${name}</td>
                </tr>
                <tr>
                  <td class="label">Email</td>
                  <td class="value">${email}</td>
                </tr>
                <tr>
                  <td class="label">Số điện thoại</td>
                  <td class="value">${phone}</td>
                </tr>
                <tr>
                  <td class="label">Nội dung</td>
                  <td class="value">${desc}</td>
                </tr>
              </table>

              <hr class="hr" />
              <!-- Tuỳ chọn: nút mở CRM/Backoffice -->
              <div>
                <a class="btn" href="#" target="_blank" rel="noreferrer">Mở trang quản trị</a>
              </div>
            </td>
          </tr>
          <tr>
            <td class="pad" style="border-top:1px solid #eaeaea;">
              <div class="footer">
                Email này được gửi tự động từ hệ thống liên hệ website. Vui lòng không trả lời trực tiếp.
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
