
export interface MailPayload {
    to: string;                // người nhận
    subject: string;           // tiêu đề email
    template: string;          // loại template (contact, marketing, report…)
    data: Record<string, any>; // dữ liệu để render template
    meta?: {
      replyTo?: string;
      campaignId?: string;
      source?: string;
    };
  }
  