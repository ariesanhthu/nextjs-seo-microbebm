import { CreateContactFormData } from "../schemas/contact.schema";

// Service mỏng - chỉ để gom fetch và xử lý lỗi
export class ContactService {
  private static async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  static async createContact(data: CreateContactFormData) {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return this.handleResponse<{ success: boolean; data: any; message: string }>(response);
  }
}
