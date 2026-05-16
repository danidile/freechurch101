"use client";

import { useUserStore } from "@/store/useUserStore";
import React, { useState, useMemo } from "react";
import startCheckout from "./startCheckout";

// A simple Check icon component to avoid external dependencies
type FaCheckProps = {
  className?: string;
};

const FaCheck: React.FC<FaCheckProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.454-12.68a.75.75 0 011.04-.208z"
      clipRule="evenodd"
    />
  </svg>
);

export default function ChurchPricingPage() {
  const { userData } = useUserStore();

  const [userCount, setUserCount] = useState(25);
  const BASE_PRICE = 15;
  const BASE_USERS = 25;
  const EXTRA_USER_COST = 0.2;
  const MAX_USERS = 500; // Set a reasonable max for the slider

  // Memoize the price calculation to avoid re-calculating on every render
  const calculatedPrice = useMemo(() => {
    if (userCount <= BASE_USERS) {
      return BASE_PRICE;
    }
    const extraUsers = userCount - BASE_USERS;
    const extraCost = extraUsers * EXTRA_USER_COST;
    return BASE_PRICE + extraCost;
  }, [userCount]);

  const features = [
    "Canzoni illimitate",
    "Membri illimitati (con prezzo scalabile)",
    "Team illimitati",
    "Eventi illimitati",
    "Stanze multiple",
    "Supporto prioritario via email",
    "Accesso a tutte le funzionalità Pro",
  ];

  return (
    <div className="min-h-screen  flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Un Piano Semplice e Scalabile
        </h1>
        <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
          Abbiamo creato un unico piano che cresce con la tua chiesa. Nessuna
          funzionalità nascosta, tutto incluso fin da subito.
        </p>

        <div className="max-w-2xl mx-auto bg-white rounded-2xl">
          {/* Plan Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-semibold text-gray-800">
              Piano Chiesa
            </h2>
            <p className="text-gray-500 mt-2">
              Tutto ciò di cui hai bisogno, senza complicazioni.
            </p>
          </div>

          {/* Price Display */}
          <div className="flex justify-center items-baseline mb-8">
            <span className="text-5xl font-extrabold text-gray-900">
              €{calculatedPrice.toFixed(2)}
            </span>
            <span className="ml-2 text-xl font-medium text-gray-500">
              /mese
            </span>
          </div>

          {/* User Calculator Slider */}
          <div className="bg-gray-100 p-6 rounded-xl mb-8">
            <div className="flex justify-between items-center mb-2">
              <label
                htmlFor="user-slider"
                className="font-medium text-gray-700"
              >
                Numero di Utenti
              </label>
              <span className="px-3 py-1 text-lg font-bold text-indigo-600 bg-indigo-100 rounded-full">
                {userCount}
              </span>
            </div>
            <input
              id="user-slider"
              type="range"
              min="1"
              max={MAX_USERS}
              value={userCount}
              onChange={(e) => setUserCount(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <p className="text-sm text-gray-500 mt-3 text-center">
              Il piano base include{" "}
              <strong className="text-gray-700">{BASE_USERS} utenti</strong> a{" "}
              <strong className="text-gray-700">
                €{BASE_PRICE.toFixed(2)}/mese
              </strong>
              . Ogni utente aggiuntivo costa solo{" "}
              <strong className="text-gray-700">
                €{EXTRA_USER_COST.toFixed(2)}
              </strong>
              .
            </p>
          </div>

          {/* Features List */}
          <ul className="space-y-4 text-left mb-10">
            {features.map((feature) => (
              <li key={feature} className="flex items-center">
                <FaCheck className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>

          <button
            className="w-full bg-gray-900 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-black transition-transform transform hover:scale-102"
            onClick={() =>
              startCheckout(
                "price_1RhSJPPiftofwQpL9u5gveG5",
                userData.id,
                userData.email,
                userData.church_id
              )
            }
          >
            Scegli Piano
          </button>
        </div>
      </div>
    </div>
  );
}
