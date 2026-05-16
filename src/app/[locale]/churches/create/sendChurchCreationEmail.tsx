"use client";

import { registrationData } from "@/utils/types/types"; // Assuming this type includes churchName, adminName, adminEmail

/**
 * Sends a welcome email to the church administrator confirming the account creation.
 *
 * @param registration The registration data for the newly created church account.
 * @returns The response data from the email sending API.
 */
export default async function sendChurchCreationConfirmationEmail(registration: {
  churchName: string;
  firstName: string;
  lastName: string;
  email: string;
}) {
  const { churchName, firstName, lastName, email } = registration;

  console.log(email);
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/send-email`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: email,
        subject: `🎉 Benvenuto su ChurchLab - Account ${churchName} creato!`,
        text: `Benvenuto su ChurchLab, la piattaforma per organizzare il tuo team di lode. Il tuo account per la chiesa ${churchName} è stato creato.`,
        html: `
      <table cellpadding="0" cellspacing="0" width="100%" style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 10px;">
  <tr>
    <td>
      <table cellpadding="0" cellspacing="0" width="600" align="center" style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
        <tr>
          <td style="font-size: 18px; color: #333333;">
            <p style="margin: 0 0 20px;">Ciao <strong>${firstName + " " + lastName}</strong> 👋,</p>

            <p style="margin: 0 0 20px;">
              Siamo contenti di darti il benvenuto su <strong>ChurchLab</strong>!
            </p>

            <p style="margin: 0 0 20px;">
              Il tuo account per la chiesa <strong>${churchName}</strong> è stato creato con successo. Sei pronto a semplificare l'organizzazione del tuo team di lode e migliorare la comunicazione.
            </p>
            
            <p style="margin: 0 0 20px;">
              Inizia subito a gestire i tuoi membri, creare i tuoi setlist e pianificare i turni del tuo team.
            </p>


            <p style="text-align: center; margin: 30px 0;">
              <a href="https://www.churchlab.it/protected/dashboard/account" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Vai alla Dashboard
              </a>
            </p>

            <p style="margin: 0 0 20px; font-size: 14px; color: #666666;">
              Se hai domande o hai bisogno di assistenza, non esitare a contattarci.
            </p>
            
            <p style="margin: 0; font-size: 14px; color: #666666;">
              A presto,<br>
              Il Team ChurchLab
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
