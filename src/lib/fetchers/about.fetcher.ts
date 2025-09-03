// src/data/fetchers/about.fetcher.ts
import { AboutService } from "@/services/firebase/about/about.service";
import type { AboutResponseDto } from "@/lib/dto/about.dto";
function toPlain(value: any): any {
    if (value == null) return value;
    if (Array.isArray(value)) return value.map(toPlain);
  
    // Date là built-in được hỗ trợ → có thể giữ Date hoặc đổi sang string
    if (value instanceof Date) return value.toISOString();
  
    // Firestore Timestamp (có toDate) → đổi sang ISO string
    if (typeof value === "object" && typeof value.toDate === "function") {
      const d = value.toDate(); // JS Date
      return d.toISOString();
    }
  
    // Object thường → clone sang POJO và xử lý sâu
    if (typeof value === "object") {
      return Object.fromEntries(
        Object.entries(value).map(([k, v]) => [k, toPlain(v)])
      );
    }
  
    return value; // string/number/boolean...
  }
export async function fetchAboutServer(): Promise<AboutResponseDto | null> {
    const raw = await AboutService.get(); // có thể trả null
    return raw ? (toPlain(raw) as AboutResponseDto) : null;
}
