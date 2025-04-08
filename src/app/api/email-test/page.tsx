"use client";
import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    fetch("/api/sendEmail", { method: "POST" });
  }, []);

  return <p>Sending email...</p>;
}
