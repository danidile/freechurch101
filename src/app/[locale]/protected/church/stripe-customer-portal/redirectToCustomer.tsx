"use client";
import { useRouter } from "@/i18n/navigation";
import { useEffect } from "react";

export default function RedirectToCustomer({ url }: { url: string }) {
  const router = useRouter();
  useEffect(() => {
    router.push(url);
  }, []);
  return <p>Caricamento</p>;
}
