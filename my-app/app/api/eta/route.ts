// app/api/eta/route.ts  (Next.js App Router)
// Keeps your Google API key server-side — never exposed to the browser

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const origin = searchParams.get("origin");
  const destination = searchParams.get("destination");

  if (!origin || !destination) {
    return NextResponse.json({ error: "Missing origin or destination" }, { status: 400 });
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY; // server-only env var (no NEXT_PUBLIC_)
  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=driving&key=${apiKey}`;

// Inside app/api/eta/route.ts
	try {
	const res = await fetch(url);
	const data = await res.json();
	
	// Add this line to read Google's exact response in your terminal:
	console.log("➡️ Google API Response:", data); 

	return NextResponse.json(data);
	} catch (err) {
	return NextResponse.json({ error: "Failed to fetch directions" }, { status: 500 });
	}
}