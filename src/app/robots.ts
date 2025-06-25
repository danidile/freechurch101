// app/robots.ts
export default function robots() {
  return new Response(
    `User-agent: *
Disallow:`,
    {
      headers: {
        "Content-Type": "text/plain",
      },
    }
  );
}
