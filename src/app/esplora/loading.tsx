"use client";
import { Skeleton } from "@heroui/react";

export default function Loading() {
  return (
    <div className="container-sub">
      <div className="visita-feed-section">
        <h3>Le ultime uscite</h3>
        <div className="visita-feed-container">
          {[...Array(4)].map((album) => {
            return (
              <div className="mb-10">
                <Skeleton className="h-72 w-72 rounded-lg"/>
                <Skeleton className="w-3/5 h-3 mt-6 mb-2 rounded-lg"/>
                <Skeleton className="w-4/5 h-3 rounded-lg"/>
              </div>
            );
          })}
        </div>
      </div>

      <h3 className="text-center">Trova la tua canzone!</h3>
    </div>
  );
}
