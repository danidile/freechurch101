"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [session, setSession] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    fetch(`/api/stripe/session?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setSession(data);
      });
  }, [sessionId]);

  if (!sessionId) return <p>ID mancante</p>;
  if (error) return <p>Errore: {error}</p>;
  if (!session) return <p>Caricamento...</p>;

  return (
    <div className="container-sub">
      <h2>Payment Success</h2>
      <p>Session ID: {session.id}</p>
      <p>Customer Email: {session.customer_email}</p>
      <p>Church: {session.metadata.church}</p>
      <p>Profile ID: {session.customer_email}</p>
    </div>
  );
}
