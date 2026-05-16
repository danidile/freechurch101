"use client";
import { Button } from "@heroui/button";

export default function EmailSenderC() {
  const churchName = "newLife";
  const firstName = "Daniele";
  const lastName = "Di Lecce";

  async function sendTestEmail() {
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: "danidile94@gmail.com",
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
    });

    const data = await response.json();
    console.log(data);
  }

  return <Button onPress={sendTestEmail}>Cliccami</Button>;
}
