// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

// if (process.env.NODE_ENV === "production") {
Sentry.init({
  dsn: "https://f5980f1deefbad692df173ee0868c4f1@o4509265640685568.ingest.de.sentry.io/4509265642389584",
  environment: process.env.NODE_ENV,

  integrations: [Sentry.replayIntegration()],
  tracesSampleRate: 1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  debug: false,
});
// }

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
