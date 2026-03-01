import connectionToMongoDb from "@/lib/mongoose";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectionToMongoDb();
    const { camp, date, dayName, shift, troopersName, comdsName, reserveName } =
      await request.json();
    const newUser = new User({
      camp: camp,
      date: date,
      dayName: dayName,
      shift: shift,
      troopersName: troopersName,
      comdsName: comdsName,
      reserveName: reserveName,
    });
    await newUser.save();
    return NextResponse.json(newUser, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectionToMongoDb(); // Connect to MongoDB

    const users = await User.find(); // Fetch all users

    return NextResponse.json(users, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
