"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";
import { useChurchStore } from "@/store/useChurchStore";
import RoomsTableComponent from "./RoomsTableComponent";

export default function RoomsPageClient() {
  const { rooms, loadingChurchData } = useChurchStore();

  const hasRooms = rooms && rooms.length > 0;
  
  if (loadingChurchData) {
    return (
      <div className="container-sub text-center mt-10">
        <p className="text-sm text-gray-500">Caricamento stanze...</p>
      </div>
    );
  }
  return (
    <div className="container-sub">
      {hasRooms ? (
        <RoomsTableComponent rooms={rooms} />
      ) : (
        <div className="text-center mt-10">
          <h4 className="text-lg font-medium text-gray-700">
            Nessuna stanza trovata
          </h4>
          <p className="text-sm text-gray-500">
            Inizia aggiungendo una stanza per la tua chiesa.
          </p>
        </div>
      )}
    </div>
  );
}
