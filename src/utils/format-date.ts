export function formatDate(timestamp: any): string {
  if (!timestamp) return "Không xác định";

  try {
    if (timestamp && typeof timestamp.toDate === "function") {
      const date = timestamp.toDate();
      return date.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }

    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return "Không xác định";
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (_err) {
    return "Không xác định";
  }
}


