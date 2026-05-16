"use client";

import { churchMembersT, registrationData } from "@/utils/types/types";

export default async function eventReminderEmail(
  item: churchMembersT,
  team: string,
  readableDate: string,
  setlistId: string
) {
  console.log(item.email);
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/send-email`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: item.email,
        subject: `👋 Promemoria per il tuo turno con il team ${team[0]} – ${readableDate} - (${Date.now()})`,
        text: "Benvenuto su ChurchLab, la piattaforma per organizzare il tuo team di lode.",
        html: `
      <table cellpadding="0" cellspacing="0" width="100%" style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 10px;">
  <tr>
    <td>
      <table cellpadding="0" cellspacing="0" width="600" align="center" style="background-color: #ffffff; padding: 10px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
        <tr>
          <td style="font-size: 18px; color: #333333;">
            <p style="margin: 0 0 20px;">Ciao <strong>${item.name}</strong> 👋,</p>

            <p style="margin: 0 0 20px;">
              Questo è un promemoria che sei di turno con il  <strong>${team} ${readableDate}</strong> 🙌.
            </p>

            <p style="margin: 0 0 20px;">
              Se non hai ancora confermato la tua presenza su <strong>ChurchLab</strong>, ti invitiamo gentilmente a farlo ora cliccando sul pulsante qui sotto:
            </p>

            <p style="text-align: center; margin: 30px 0;">
              <a href="https://churchlab.it/setlist/${setlistId}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Conferma presenza
              </a>
            </p>

            <p style="margin: 0 0 20px;">
              Grazie di cuore per il tuo servizio! Se hai dubbi o imprevisti, non esitare a scrivermi.
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>

    `,
      }),
    }
  );

  const data = await response.json();
  console.log(data);
  return data;
}
