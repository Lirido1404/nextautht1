import { NextResponse } from "next/server";
import User from "@/app/(models)/User";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const body = await req.json();
    const userData = body;

    if (!userData?.email || !userData.password) {
      return NextResponse.json(
        { message: "All fileds are required" },
        { status: 400 }
      );
    }

    const duplicate = await User.findOne({ email: userData.email })
      .lean()
      .exec();

    if (duplicate) {
      return NextResponse.json({ message: "Duplicate Email" }, { status: 409 });
    }

    const hashPassword = await bcrypt.hash(userData.password, 10);

    userData.password = hashPassword;

    await User.create(userData);

    return NextResponse.json({messagee : "User Created"},{status : 201})
  } catch (err) {
    return NextResponse.json(
      { message: "Failed to create user", err },
      { status: 500 }
    );
  }
}
