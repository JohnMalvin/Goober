import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    // 1. find user
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "idk u broo" },
        { status: 404 }
      );
    }

    // 2. plain password check (TEST ONLY)
    if (user.password !== password) {
      return NextResponse.json(
        { message: "wrong credentials bruhh" },
        { status: 401 }
      );
    }

    // 3. success response (NO JWT)
    return NextResponse.json({
      message: "hello sicko",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        address: user.address,
      },
    });

  } catch {
    return NextResponse.json(
      { message: "Server crash out lol" },
      { status: 500 }
    );
  }
}