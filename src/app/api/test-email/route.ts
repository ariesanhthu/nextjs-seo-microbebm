import { NextResponse } from "next/server";

export async function GET() {
    try {
        const apiKey = process.env.SHARED_SECRET;
        const endpoint = process.env.APPS_SCRIPT_URL;

        if (!apiKey || !endpoint) {
            return NextResponse.json({
                success: false,
                message: "Missing environment variables",
                apiKey: !!apiKey,
                endpoint: !!endpoint
            });
        }

        // Test với dữ liệu đơn giản
        const testData = {
            apiKey,
            recipient: "test@example.com",
            subject: "Test Email",
            body: "<h1>Test Email</h1><p>This is a test email from MicrobeBM contact form.</p>"
        };

        console.log("Testing Google Apps Script with data:", testData);
        console.log("Endpoint URL:", endpoint);
        console.log("API Key (last 4 chars):", apiKey ? "***" + apiKey.slice(-4) : "MISSING");

        const res = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(testData),
        });

        console.log("Response status:", res.status);
        console.log("Response headers:", Object.fromEntries(res.headers.entries()));

        const responseText = await res.text();
        console.log("Response text:", responseText);

        // Thử parse JSON
        let jsonResponse;
        try {
            jsonResponse = JSON.parse(responseText);
        } catch (parseError) {
            return NextResponse.json({
                success: false,
                message: "Response is not valid JSON",
                status: res.status,
                responseText: responseText.substring(0, 500),
                parseError: parseError instanceof Error ? parseError.message : String(parseError)
            });
        }

        return NextResponse.json({
            success: true,
            status: res.status,
            response: jsonResponse,
            headers: Object.fromEntries(res.headers.entries())
        });

    } catch (error: any) {
        console.error("Test email error:", error);
        return NextResponse.json({
            success: false,
            message: error.message,
            stack: error.stack
        });
    }
}
