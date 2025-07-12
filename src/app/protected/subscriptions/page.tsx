"use client";

import { FaCheck } from "react-icons/fa6";
import { Button } from "@heroui/button";
import CheckoutButton from "./CheckoutButton";

export default function PricingPage() {
  const tiers = [
    {
      name: "Gratis",
      price: "€0",
      description: "Ideale per team piccoli",
      features: [
        "100 Canzoni",
        "10 Membri",
        "1 Team",
        "8 eventi per stanza",
        "1 stanza",
        "8 elementi per evento",
      ],
    },
    {
      name: "Basic",
      price: "€15",
      description: "Tutto il necessario per partire",
      features: [
        "200 Canzoni",
        "30 Membri",
        "5 Team",
        "Eventi illimitati per stanza",
        "3 stanze",
        "20 elementi per evento",
      ],
      priceCode: "price_1RhSJPPiftofwQpL9u5gveG5",
    },
    {
      name: "Pro",
      price: "€30",
      description: "Perfetto per team in crescita",
      features: [
        "Canzoni illimitate",
        "80 Membri",
        "15 Team",
        "Eventi illimitati per stanza",
        "15 stanze",
        "Elementi illimitati per evento",
      ],
      priceCode: "price_1RhSKAPiftofwQpL9pyDiFxv",
    },
  ];

  const enterprise = {
    name: "Enterprise",
    description:
      "Soluzioni personalizzate per chiese di grandi dimensioni e organizzazioni.",
    price: "Personalizzato",
    features: [
      "100 Canzoni",
      "10 Membri",
      "2 Team",
      "8 eventi per stanza",
      "1 stanza",
      "8 elementi per evento",
    ],
    cta: (
      <Button color="primary" variant="solid">
        Chiedi più informazioni
      </Button>
    ),
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Piani di abbonamento
        </h2>
        <p className="text-gray-600 mb-10">
          Scegli il piano più adatto alla tua chiesa.
        </p>
        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div key={tier.name} className="rounded-2xl p-6 shadow-lg border">
              <h3 className="text-2xl font-semibold text-gray-800">
                {tier.name}
              </h3>
              <p className="text-gray-500 mb-4">{tier.description}</p>
              <div className="text-4xl font-bold text-gray-900 mb-4">
                {tier.price}/mese
              </div>
              <div className="text-gray-700 mb-6 space-y-2 flex flex-col justify-center items-center">
                {tier.features.map((feature) => (
                  <small
                    key={feature}
                    className="flex flex-row items-center justify-center gap-1"
                  >
                    <FaCheck color="#34b233" />
                    {feature}
                  </small>
                ))}
              </div>
              <div className="w-full">
                {tier.priceCode && <CheckoutButton price={tier.priceCode} />}
              </div>
            </div>
          ))}
        </div>

        {/* Enterprise Tier */}
        <div className="mt-10 bg-white py-12 px-6 rounded-2xl p-6 shadow-lg border mx-auto max-w-[400px]">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            {enterprise.name}
          </h3>
          <p className="text-gray-700 mb-6">{enterprise.description}</p>
          <div className="text-2xl font-semibold text-gray-800 mb-6">
            Prezzo: {enterprise.price}
          </div>
          <div className="text-gray-700 mb-6 space-y-2 flex flex-col justify-center items-center">
            {enterprise.features.map((feature) => (
              <small
                key={feature}
                className="flex flex-row items-center justify-center gap-1"
              >
                <FaCheck color="#34b233" />
                {feature}
              </small>
            ))}
          </div>
          <div className="w-full">{enterprise.cta}</div>
        </div>
      </div>
    </div>
  );
}
