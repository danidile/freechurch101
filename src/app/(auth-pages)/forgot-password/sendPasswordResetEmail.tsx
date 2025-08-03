"use client";
export default async function sendPasswordResetEmail(
  to: string,
  resetLink: string
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/send-email`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject: "Reimposta la tua password",
        to,
        html: `
      <p>Ciao,D</p>
      <p>Hai richiesto di reimpostare la password. Clicca sul link qui sotto:</p>
      <a href="${resetLink}">Reimposta password</a>
      <p>Se non hai richiesto questo, ignora pure questa email.</p>
    `,
      }),
    }
  );

  const data = await response.json();
  console.log(data);
  return data;
}
