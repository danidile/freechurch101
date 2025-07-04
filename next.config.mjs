import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */

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
          // ✅ Only include CSP in production
          ...(isProd
            ? [
                {
                  key: "Content-Security-Policy",
                  value: `
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src https://fonts.gstatic.com;
    img-src 'self' data:  https://kadorwmjhklzakafowpu.supabase.co;
    connect-src 'self' https://kadorwmjhklzakafowpu.supabase.co;
    worker-src blob: 'self';

  `.replace(/\n/g, ""), // remove line breaks
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
};

export default withSentryConfig(nextConfig, {
  org: "churchlab-0b",
  project: "javascript-nextjs",
  silent: !process.env.CI,
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
  prerenderConcurrency: 2,
  widenClientFileUpload: true,
  staticPageGenerationTimeout: 300,
  tunnelRoute: "/monitoring",
  disableLogger: true,
  automaticVercelMonitors: true,
});
