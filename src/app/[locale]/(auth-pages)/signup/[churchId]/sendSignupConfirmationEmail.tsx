"use client";

/**
 * Sends a welcome email to a member who just registered with a church.
 *
 * @param registration The new member's details.
 * @returns The response data from the email sending API.
 */
export default async function sendSignupConfirmationEmail(registration: {
  churchName: string;
  firstName: string;
  lastName: string;
  email: string;
}) {
  const { churchName, firstName, lastName, email } = registration;

  const response = await fetch(`/api/send-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      to: email,
      subject: `🎉 Benvenuto in ${churchName} su ChurchLab!`,
      text: `Ciao ${firstName}, il tuo account su ChurchLab per la chiesa ${churchName} è stato creato con successo.`,
      html: `
      <table cellpadding="0" cellspacing="0" width="100%" style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 10px;">
  <tr>
    <td>
      <table cellpadding="0" cellspacing="0" width="600" align="center" style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
        <tr>
          <td style="font-size: 18px; color: #333333;">
            <p style="margin: 0 0 20px;">Ciao <strong>${firstName + " " + lastName}</strong> 👋,</p>

            <p style="margin: 0 0 20px;">
              Il tuo account è stato creato con successo e ora fai parte della chiesa <strong>${churchName}</strong> su <strong>ChurchLab</strong>!
            </p>

            <p style="margin: 0 0 20px;">
              Da qui potrai vedere i tuoi turni, gestire le tue disponibilità e collaborare con il tuo team di lode.
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
  });

  const data = await response.json();
  return data;
}
