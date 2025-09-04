// email-templates.ts
export const escapeHtml = (s?: string | null) =>
    (s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  
export const fmt = (v?: string | null) => (v && v.trim() ? escapeHtml(v) : "<i>—</i>");

// Email validation utility
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

// Sanitize email content
export const sanitizeEmailContent = (content: string): string => {
  return content
    .trim()
    .replace(/\r\n/g, '\n')  // Normalize line endings
    .replace(/\r/g, '\n')    // Handle old Mac line endings
    .replace(/\n{3,}/g, '\n\n'); // Limit consecutive newlines
};

// Format email for display
export const formatEmailForDisplay = (email: string): string => {
  return email.trim().toLowerCase();
};
  