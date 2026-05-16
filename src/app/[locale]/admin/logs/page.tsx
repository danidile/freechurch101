"use client";

import { useUserStore } from "@/store/useUserStore";
import LogsComponent from "./LogsComponent";
import { FaLock } from "react-icons/fa";

export default function Page() {
  const { userData } = useUserStore();

  if (!userData) {
    return <p className="text-gray-500 text-center mt-10">Caricamento...</p>;
  }

  if (userData.email === "danidile94@gmail.com") {
    return <LogsComponent />;
  } else {
    return (
      <div className="flex flex-col items-center justify-center mt-20 text-center text-gray-700 px-4">
        <FaLock className="text-4xl text-gray-200 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Accesso non consentito</h2>
        <p className="max-w-md">
          Mi dispiace, non hai i permessi necessari per visualizzare questa
          pagina.
          <br />
          Se pensi che ci sia un errore, contatta l'amministratore.
        </p>
      </div>
    );
  }
}
