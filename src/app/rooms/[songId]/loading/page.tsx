"use client";
import { Button, Skeleton } from "@heroui/react";

import { FaPlus, FaMinus } from "react-icons/fa";

export default function Loading() {
  return (
    <div className="container-sub">
      <div className="song-presentation-container">
        <div>
          <div className="view-selector-container">
            <Button size="md">Testo</Button>

            <div className="transopose-section">
              <p>Tonalità:</p>

              <Button isIconOnly variant="light" size="md">
                <FaMinus />
              </Button>
              <Button isIconOnly variant="light" size="md">
                <FaPlus />
              </Button>
            </div>
          </div>
          <Skeleton className="h-7 w-3/5 mt-7 mb-2 rounded-md" />
          <Skeleton className="h-3 w-40 mt-3 rounded-sm" />
          {[...Array(6)].map((song) => {
            return (
              <>
                <Skeleton className="h-3 w-96 mt-3 rounded-sm" />
                <Skeleton className="h-3 w-72 mt-3 rounded-sm" />
                <Skeleton className="h-3 w-52 mt-3 rounded-sm" />
                <Skeleton className="h-3 w-80 mt-3 rounded-sm" />
                <Skeleton className="h-3 w-64 mt-3 rounded-sm" />
              </>
            );
          })}

          <div></div>
        </div>
      </div>
    </div>
  );
}
