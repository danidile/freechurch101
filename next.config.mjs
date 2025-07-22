/** @type {import('next').NextConfig} */
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const isProd = process.env.NODE_ENV !== "development";

const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          ...(isProd
            ? [
                {
                  key: "Content-Security-Policy",
                  value: `
default-src 'self';
script-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com https://static.cloudflareinsights.com https://js.stripe.com;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src https://fonts.gstatic.com;
img-src 'self' data: blob: https://kadorwmjhklzakafowpu.supabase.co https://*.stripe.com;
connect-src 'self' https://kadorwmjhklzakafowpu.supabase.co https://api.stripe.com https://churchlab.it;
frame-src https://js.stripe.com https://hooks.stripe.com;
worker-src blob: 'self';
`.replace(/\n/g, ""),
                },
              ]
            : []),
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
  webpack(config) {
    config.resolve.alias["@"] = path.resolve(__dirname, "src");
    return config;
  },
  turbopack: {
    root: path.join(__dirname, ".."),
  },
};

export default nextConfig;
