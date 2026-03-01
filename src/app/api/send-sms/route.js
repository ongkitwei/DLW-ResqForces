// app/api/send-whatsapp/route.js
import { NextResponse } from "next/server";
import twilio from "twilio";

export async function POST(req) {
  const body = await req.json();
  const { to, date, time } = body;

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = twilio(accountSid, authToken);

  try {
    const response = await client.messages.create({
      from: "whatsapp:+14155238886", // Twilio sandbox number or your approved number
      to: `whatsapp:${to}`, // Must include country code
      contentSid: "HXb5b62575e6e4ff6129ad7c8efe1f983e", // Your approved WhatsApp template SID
      contentVariables: JSON.stringify({
        1: date,
        2: time,
      }),
    });

    return NextResponse.json({ success: true, sid: response.sid });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
