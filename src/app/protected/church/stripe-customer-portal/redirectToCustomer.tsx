"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RedirectToCustomer({ url }: { url: string }) {
  const router = useRouter();
  useEffect(() => {
    router.push(url);
  }, []);
  return <p>Caricamento</p>;
}
