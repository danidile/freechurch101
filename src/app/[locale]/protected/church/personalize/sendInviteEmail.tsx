"use server";
import { newMember } from "@/utils/types/types";
import { logEvent } from "@/utils/supabase/log";

export default async function sendInviteEmail(newMember: newMember): Promise<{
  success: boolean;
  message: string;
}> {
  const inviteLink = `https://churchlab.it/invite/accept?token=${newMember.token}`;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/send-email`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: newMember.email,
          subject: "Sei stato invitato a ChurchLab",
          html: `
          <div style="font-family: sans-serif; color: #333; padding: 20px;">
            <h2 style="color: #2d7a78;">Benvenuto su ChurchLab 👋</h2>
            <p>Ciao,</p>
            <p>Hai ricevuto un invito per unirti alla tua chiesa su <strong>ChurchLab</strong>, la piattaforma per organizzare eventi, team e setlist.</p>
            <p>Per completare la registrazione e accedere al tuo profilo, clicca il pulsante qui sotto:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${inviteLink}" style="
                background-color: #2d7a78;
                color: white;
                padding: 12px 24px;
                text-decoration: none;
                border-radius: 6px;
                font-weight: bold;
              ">Accetta l'invito</a>
            </div>
            <p>Se il pulsante non funziona, copia e incolla questo link nel tuo browser:</p>
            <p style="word-break: break-all;"><a href="${inviteLink}">${inviteLink}</a></p>
            <hr style="margin-top: 40px;" />
            <p style="font-size: 12px; color: #999;">Questo invito è riservato a te. Se non ti aspettavi questa email, puoi ignorarla.</p>
          </div>`,
        }),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      await logEvent({
        event: "send_invite_email_error",
        level: "error",
        user_id: null,
        meta: {
          message: `Non-OK response: ${response.status}`,
          body: text,
          recipient: newMember.email,
        },
      });

      return {
        success: false,
        message: `Failed to send email: API error ${response.status}`,
      };
    }

    const data = await response.json();
    await logEvent({
      event: "send_invite_email_success",
      level: "info",
      user_id: null,
      meta: {
        recipient: newMember.email,
        context: "invite email",
      },
    });

    console.log("✅ Email sent:", data);
    return {
      success: true,
      message: "Email sent successfully",
    };
  } catch (err: any) {
    await logEvent({
      event: "send_invite_email_error",
      level: "error",
      user_id: null,
      meta: {
        message: err.message,
        recipient: newMember.email,
        context: "invite email",
      },
    });

    console.error("❌ Failed to send email:", err);
    return {
      success: false,
      message: `Failed to send email: ${err.message}`,
    };
  }
}
