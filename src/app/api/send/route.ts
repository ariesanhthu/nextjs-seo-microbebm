import { NextResponse } from "next/server";

export async function POST(req: Request)
{
    try {
        const { recipient, subject, body } = await Promise.resolve(req.json());
        // console.log("=== API /api/send POST called ===");
        // console.log("Request body:", { recipient, subject, body });

        // Lấy API key từ .env.local
        const apiKey = process.env.SHARED_SECRET;
        const endpoint = process.env.APPS_SCRIPT_URL as string; // URL deploy web app Google Apps Script

        const res = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                apiKey,
                recipient,
                subject,
                body,
            }),
        });

        const data = await res.json();
        // console.log("Response data:", data);
        return NextResponse.json(data);
    }
    catch (error: any) {
        return NextResponse.json(
            { status: "error", message: error.message },
            { status: 500 }
        );
    }
}
