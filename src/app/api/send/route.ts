import { NextResponse } from "next/server";

export async function POST(req: Request)
{
    try {
        // Validate request content type
        const contentType = req.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            console.error("Invalid content type:", contentType);
            return NextResponse.json(
                { status: "error", message: "Request must be sent with Content-Type: application/json" },
                { status: 400 }
            );
        }

        const { recipient, subject, body } = await Promise.resolve(req.json());
        console.log("=== API /api/send POST called ===");

        // Validate required fields
        if (!recipient || !subject || !body) {
            console.error("Missing required fields:", { recipient: !!recipient, subject: !!subject, body: !!body });
            return NextResponse.json(
                { status: "error", message: "Missing required fields: recipient, subject, body" },
                { status: 400 }
            );
        }

        // Lấy API key từ .env.local
        const apiKey = process.env.SHARED_SECRET;
        const endpoint = process.env.APPS_SCRIPT_URL as string; // URL deploy web app Google Apps Script

        // Kiểm tra environment variables
        if (!apiKey) {
            console.error("SHARED_SECRET environment variable is missing");
            return NextResponse.json(
                { status: "error", message: "Email service configuration is missing. Please check SHARED_SECRET environment variable." },
                { status: 500 }
            );
        }

        if (!endpoint) {
            console.error("APPS_SCRIPT_URL environment variable is missing");
            return NextResponse.json(
                { status: "error", message: "Email service configuration is missing. Please check APPS_SCRIPT_URL environment variable." },
                { status: 500 }
            );
        }

        console.log("Environment variables OK, calling Google Apps Script...");
        console.log("Endpoint URL:", endpoint);
        console.log("API Key:", apiKey ? "***" + apiKey.slice(-4) : "MISSING");

        // Prepare payload with proper JSON structure
        const payload = {
            apiKey,
            recipient: recipient.trim(),
            subject: subject.trim(),
            body: body.trim()
        };

        console.log("Sending payload to Google Apps Script:", {
            apiKey: "***" + apiKey.slice(-4),
            recipient: payload.recipient,
            subject: payload.subject,
            bodyLength: payload.body.length
        });

        const res = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(payload),
        });

        console.log("Google Apps Script response status:", res.status);
        
        // Kiểm tra response status
        if (!res.ok) {
            const errorText = await res.text();
            console.error("Google Apps Script error response:", errorText);
            console.error("Response headers:", Object.fromEntries(res.headers.entries()));
            
            if (res.status === 403) {
                return NextResponse.json(
                    { status: "error", message: "Google Apps Script access denied. Please check your API key and script permissions." },
                    { status: 500 }
                );
            }
            
            // Truncate error text if too long
            const shortError = errorText.length > 500 ? errorText.substring(0, 500) + "..." : errorText;
            return NextResponse.json(
                { status: "error", message: `Google Apps Script error (${res.status}): ${shortError}` },
                { status: 500 }
            );
        }
        
        // Kiểm tra content type trước khi parse JSON
        const responseContentType = res.headers.get("content-type");
        if (!responseContentType || !responseContentType.includes("application/json")) {
            const errorText = await res.text();
            console.error("Non-JSON response from Google Apps Script:", errorText);
            return NextResponse.json(
                { status: "error", message: "Google Apps Script returned non-JSON response. Please check your script configuration." },
                { status: 500 }
            );
        }
        
        const data = await res.json();
        console.log("Response data:", data);
        return NextResponse.json(data);
    }
    catch (error: any) {
        console.error("Error in /api/send:", error);
        return NextResponse.json(
            { status: "error", message: error.message },
            { status: 500 }
        );
    }
}
