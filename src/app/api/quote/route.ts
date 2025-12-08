import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  try {
    const { name, email, state, distance, weight, height } = await request.json();

    // Validate inputs
    if (!name || !email || !state || !distance || !weight || !height) {
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

    // Connect to DB
    const client = await clientPromise;
    const db = client.db();

    // Save contact query in DB
    const result = await db.collection("quote").insertOne({
      name,
      email,
      state,
      distance,
      weight,
      height,
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