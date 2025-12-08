import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, city, message } = await request.json();

    // Validate inputs
    if (!name || !email || !phone || !city || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { error: "Invalid phone number. Must be 10 digits." },
        { status: 400 }
      );
    }

    // Connect to DB
    const client = await clientPromise;
    const db = client.db();

    // Save contact query in DB
    const result = await db.collection("contacts").insertOne({
      name,
      email,
      phone,
      city,
      message,
      createdAt: new Date(),
    });

    return NextResponse.json(
      { message: "Form submitted successfully", id: result.insertedId },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving contact form:", error);
    return NextResponse.json(
      { error: "Failed to submit form. Please try again later." },
      { status: 500 }
    );
  }
}
