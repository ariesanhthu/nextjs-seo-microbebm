import { ContactResponseDto } from "@/lib/dto/contact.dto";

export function renderClientHtml(contact: ContactResponseDto, brandName: string) {
  return `
  <div style="font-family:system-ui,Arial,sans-serif">
    <h2>Xin chào ${contact.name || "bạn"},</h2>
    <p>Cảm ơn bạn đã liên hệ <b>${brandName}</b>. 
    Chúng tôi đã nhận thông tin và sẽ phản hồi trong thời gian sớm nhất.</p>
    <p>Nếu cần hỗ trợ gấp, vui lòng trả lời email này.</p>
    <hr/>
    <small>Đây là email tự động. Vui lòng không chia sẻ thông tin nhạy cảm.</small>
  </div>`;
}
