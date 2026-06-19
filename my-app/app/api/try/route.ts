import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

// POST → create user in MongoDB
export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const newUser = await User.create({
      name: body.name,
      email: body.email,
    });

    return NextResponse.json({
      success: true,
      message: "User created",
      user: newUser,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
      },
      { status: 500 }
    );
  }
}
// GET
export async function GET() {
  return NextResponse.json({
    message: "Hello from GET backend",
  });
}

// app/api/debug-db/route.js
// import mongoose from 'mongoose'

// export async function GET() {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI || '')
//     return Response.json({ status: 'connected', readyState: mongoose.connection.readyState })
//   } catch (err: unknown) {
//     const message = err instanceof Error ? err.message : String(err)
//     const code = typeof err === 'object' && err !== null && 'code' in err ? (err).code : undefined
//     return Response.json({ error: message, code }, { status: 500 })
//   }
// }