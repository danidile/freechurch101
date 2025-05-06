import * as Sentry from "@sentry/nextjs";
import { basicUserData } from "../types/userData";

export function sendErrorToSentry(message: string, userData: basicUserData) {
  try {
    // Create an error with the actual message passed in
    const error = new Error(message);

    const eventId = Sentry.captureException(error, {
      extra: {
        church: userData.church_name,
        name: userData.name,
        lastname: userData.lastname,
        role: userData.role,
        page: typeof window !== "undefined" ? window.location.href : "unknown",
      },
      tags: {
        source: "customErrorHandler",
      },
    });

    console.log("Error sent to Sentry, event ID:", eventId);
  } catch (err) {
    console.error("Error not sent to Sentry:", err);
  }
}
