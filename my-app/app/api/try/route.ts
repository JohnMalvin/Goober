import { NextResponse } from "next/server";

// GET
export async function GET() {
  return NextResponse.json({
    message: "Hello from GET backend",
  });
}

// POST
export async function POST(req: Request) {
  const body = await req.json();

  return NextResponse.json({
    message: "Hello from POST backend",
    received: body,
  });
}