import { ZodType } from "zod";

export async function ZodRequestValidation <T> (
  req: Request,
  schema: ZodType<T>
): Promise<{ success: true; data: T } | { success: false; error: any } > {
  try {
    const json = await req.json();
    const parsed = schema.safeParse(json);

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error
      }
    }
    return {
      success: true,
      data: parsed.data
    }
  } catch(error) {
    return {
      success: false,
      error: "Invalid JSON"
    }
  }
} 