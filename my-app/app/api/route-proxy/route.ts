import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Fallback logic to check both server-side and client-mapped keys
    const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      console.error("PROXY ERROR: API Key is completely missing from your environmental variables.");
      return NextResponse.json({ error: "API Key Configuration Error on Server" }, { status: 500 });
    }

    const googleResponse = await fetch("https://routes.googleapis.com/v2:computeRoutes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline",
      },
      body: JSON.stringify(body),
    });

    // Check if Google's API returned a non-200 state
    if (!googleResponse.ok) {
      const errorText = await googleResponse.text();
      console.error("Google Routes API rejection payload:", errorText);
      return NextResponse.json({ error: `Google API rejected request: ${errorText}` }, { status: googleResponse.status });
    }

    const data = await googleResponse.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Proxy middleware exception:", error);
    return NextResponse.json({ error: error.message || "Internal Server Proxy Error" }, { status: 500 });
  }
}