import { chromium } from "@playwright/test";

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const urls = ["http://localhost:3000", "/login", "/contact"]; // add all your pages

  for (let url of urls) {
    try {
      const res = await page.goto(url, { waitUntil: "networkidle" });
      const errors: string[] = [];

      page.on("pageerror", (err) => errors.push(err.message));
      page.on("console", (msg) => {
        if (msg.type() === "error") errors.push(msg.text());
      });

      if (errors.length) {
        console.error(`❌ Error on ${url}:`, errors);
        process.exit(1); // fail the build
      } else {
        console.log(`✅ ${url} loaded fine`);
      }
    } catch (err) {
      console.error(`❌ Failed to load ${url}`, err);
      process.exit(1);
    }
  }

  await browser.close();
})();
