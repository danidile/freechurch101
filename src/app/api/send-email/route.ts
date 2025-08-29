"use server";

const nodemailer = require("nodemailer");
import type { NextRequest } from "next/server";
import { logEvent } from "@/utils/supabase/log"; // adjust if needed
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  await logEvent({
    event: "send_email",
    level: "info",
    meta: {
      message: "Missing SMTP credentials.",
      context: "email sending",
    },
  });
  try {
    const { to, subject, text, html } = await req.json();

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      await logEvent({
        event: "send_email_error",
        level: "error",
        meta: {
          message: "Missing SMTP credentials.",
          context: "email sending",
        },
      });

      return new Response(
        JSON.stringify({ error: "Missing SMTP credentials." }),
        { status: 500 }
      );
    }

    if (!to || !subject || (!text && !html)) {
      await logEvent({
        event: "send_email_error",
        level: "error",
        meta: {
          message: "Missing required email fields.",
          context: "email sending",
        },
      });

      return new Response(
        JSON.stringify({ error: "Missing required fields." }),
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      pool: true, // keeps the connection alive
    });

    await transporter.sendMail({
      from: `"ChurchLab" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    });

    await logEvent({
      event: "send_email_success",
      level: "info",
      meta: {
        to,
        subject,
        context: "email sending",
      },
    });

    return new Response(JSON.stringify({ message: "Email sent!" }), {
      status: 200,
    });
  } catch (err: any) {
    await logEvent({
      event: "send_email_error",
      level: "error",
      meta: {
        message: err.message,
        context: "email sending",
      },
    });

    console.error("❌ Email error:", err);
    return new Response(
      JSON.stringify({
        error: "Failed to send email. " + err.message,
      }),
      { status: 500 }
    );
  }
}
