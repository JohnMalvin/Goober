import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { name, email, password } = await req.json();

    // 1. basic validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Missing fields" },
        { status: 400 }
      );
    }

    // 2. check if user exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }

    // 3. create user (PLAIN PASSWORD for testing only)
    const user = await User.create({
      name,
      email,
      password,
      address: "",
    });

    return NextResponse.json({
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch {
    return NextResponse.json(
      { message: "Server Crash out" },
      { status: 500 }
    );
  }
}