import { NextResponse } from "next/server";

export const runtime = "nodejs";

type ContactPayload = { name?: string; email?: string; brief?: string };

export async function POST(request: Request) {
  let payload: ContactPayload;
  try { payload = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }

  const name = payload.name?.trim();
  const email = payload.email?.trim();
  const brief = payload.brief?.trim() ?? "";
  if (!name || !email || !/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ error: "Enter a valid name and email address." }, { status: 400 });
  if (name.length > 120 || email.length > 254 || brief.length > 5000) return NextResponse.json({ error: "Please shorten your submission and try again." }, { status: 400 });

  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.CONTACT_TO_EMAIL;
  const sender = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !recipient || !sender) return NextResponse.json({ error: "Contact delivery is not configured yet. Please email us directly." }, { status: 503 });

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: sender, to: [recipient], reply_to: email, subject: `New Pearlio enquiry from ${name}`, text: `Name: ${name}\nEmail: ${email}\n\nProject brief:\n${brief || "Not provided"}` }),
  });

  if (!response.ok) return NextResponse.json({ error: "We could not send your message. Please try again shortly." }, { status: 502 });
  return NextResponse.json({ ok: true });
}
