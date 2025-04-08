import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST() {
  const transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true,
    auth: {
      user: "admin@churchlab.com", // Your Zoho email
      pass: "xR4rWS2cjTuh", // Your Zoho app password (if 2FA enabled)
    },
  });

  const mailOptions = {
    from: "admin@churchlab.com",
    to: ["danidile94@gmail.com"],
    subject: "Test Email",
    text: "Hello! This is a test email from Next.js.",
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ success: false, error });
  }
}
