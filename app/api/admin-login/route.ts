import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (
    email === "admin@platform.com" &&
    password === "Admin123!"
  ) {
    return NextResponse.json({ success: true });
  }

  return NextResponse.json(
    { message: "Invalid credentials" },
    { status: 401 }
  );
}
