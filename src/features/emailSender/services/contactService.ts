// Client-side type - không import server DTOs
type ContactFormData = {
  name: string;
  email: string | null;
  phone: string | null;
  description: string;
};

export class ContactService {
  private static async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  static async createContact(data: ContactFormData) {
    console.log("=== ContactService.createContact called ===");
    console.log("Data:", data);
    
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    console.log("Response status:", response.status);
    const result = await this.handleResponse<{ success: boolean; data: any; message: string }>(response);
    console.log("ContactService result:", result);
    return result;
  }
}
