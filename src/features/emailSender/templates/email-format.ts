// email-templates.ts
export const escapeHtml = (s?: string | null) =>
    (s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  
export const fmt = (v?: string | null) => (v && v.trim() ? escapeHtml(v) : "<i>—</i>");
  