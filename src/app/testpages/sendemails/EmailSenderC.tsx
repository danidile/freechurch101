"use client";
import { Button } from "@heroui/button";

export default function EmailSenderC() {
  async function sendTestEmail() {
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: "danidile94@gmail.com",
        subject: "Benvenuto su ChurchLab!",
        text: "Benvenuto su ChurchLab, la piattaforma per organizzare il tuo team di lode.",
        html: `
      <div style="font-family: Arial, sans-serif; color: #111; padding: 20px; max-width: 600px; margin: auto;">
        <h2 style="color: #111;">Benvenuto su ChurchLab! 🙌</h2>
        <p>Ciao e grazie per esserti iscritto alla nostra piattaforma.</p>
        <p>ChurchLab ti aiuta a organizzare le prove, scegliere i brani e comunicare con il tuo team di lode in modo semplice e veloce.</p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
        <p>Hai bisogno di aiuto? Scrivici pure a <a href="mailto:info@churchlab.it">info@churchlab.it</a></p>
        <p style="margin-top: 30px;">Con gioia, <br/>Il team di ChurchLab</p>
      </div>
    `,
      }),
    });

    const data = await response.json();
    console.log(data);
  }

  return <Button onPress={sendTestEmail}>Cliccami</Button>;
}
