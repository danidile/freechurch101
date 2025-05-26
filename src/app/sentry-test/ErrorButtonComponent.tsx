"use client";
import { Button } from "@heroui/button";
import * as Sentry from "@sentry/nextjs";

export default function ErrorButton() {
  function sendError() {
    try {
      const error = new Error("Test Error!");
      const eventId = Sentry.captureException(error, {
        extra: { userId: "123" },
        tags: { section: "checkout" },
      });
      console.log("Error sent to Sentry, event ID:", eventId);
    } catch (err) {
      console.error("Error not sent to Sentry:", err);
    }
  }

  return (
    <Button className="my-auto mx-auto" onPress={() => sendError()}>
      Send error to sentry
    </Button>
  );
}
