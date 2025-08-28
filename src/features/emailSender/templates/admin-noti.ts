import { ContactResponseDto } from "@/lib/dto/contact.dto";

export function renderAdminHtml(contact: ContactResponseDto) {
  const rows = Object.entries(contact).map(([k, v]) => {
    return `<tr>
      <td style="padding:6px 10px;border:1px solid #eee;"><b>${k}</b></td>
      <td style="padding:6px 10px;border:1px solid #eee;">${String(v)}</td>
    </tr>`;
  }).join("");

  return `
  <div style="font-family:system-ui,Arial,sans-serif">
    <h2>New form submission</h2>
    <table style="border-collapse:collapse">${rows}</table>
  </div>`;
}
