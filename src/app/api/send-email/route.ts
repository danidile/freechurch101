const nodemailer = require("nodemailer");

import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { to, subject, text, html } = await req.json();
    console.log("SMTP_USER:", process.env.SMTP_USER);
    console.log(
      "SMTP_PASS:",
      process.env.SMTP_PASS ? "✅ loaded" : "❌ missing"
    );

    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 587,
      secure: false,
      auth: {
        user: "info@churchlab.it",
        pass: process.env.SMTP_PASS!,
      },
    });

    await transporter.sendMail({
      from: `"ChurchLab" <info@churchlab.it>`,
      to,
      subject,
      text, // fallback per email di testo
      html, // email con design
    });

    return new Response(JSON.stringify({ message: "Email sent!" }), {
      status: 200,
    });
  } catch (err) {
    console.error(err);
    const errorMessage = "Failed to send email." + err;
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
    });
  }
}
