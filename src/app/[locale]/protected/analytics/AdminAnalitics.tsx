// components/ChurchAnalyticsDashboard.tsx

"use client";

import React, { useState, useEffect } from "react";
import { fetchAllChurchesData } from "./analyticsQueries"; // Adjust this import path to your API file

type Church = {
  id: string;
  church_name: string;
  pastor: string;
  address: string;
  created_at: string;

  website: string | null;
  provincia: string | null;
  comune: string | null;
  city: string | null;
  subscription_status: string;
  plan: string;
};

type Props = {
  churches: Church[];
};

export default function AdminAnalitics() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [churches, setChurches] = useState([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log("Starting fetch");
        const churches = await fetchAllChurchesData();
        console.log("Fetched churches:", churches);
        const sortedChurches = [...churches].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setChurches(sortedChurches);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError(
          "Impossibile caricare i dati della dashboard. Riprova più tardi."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">Caricamento dati...</div>
    );
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Time Range Selector */}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                Name
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                Pastor
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                Address
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                Website
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                Plan
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                Created
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                Members
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                Events
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {churches.map((church: any) => (
              <tr key={church.id}>
                <td className="px-4 py-2 text-sm text-gray-800">
                  {church.church_name}
                </td>
                <td className="px-4 py-2 text-sm text-gray-800">
                  {church.pastor}
                </td>
                <td className="px-4 py-2 text-sm text-gray-800">
                  {church.address}, {church.comune ?? "-"},{" "}
                  {church.provincia ?? "-"}
                </td>

                <td className="px-4 py-2 text-sm text-blue-600">
                  {church.website ? (
                    <a
                      href={
                        church.website.startsWith("http")
                          ? church.website
                          : `https://${church.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {church.website}
                    </a>
                  ) : (
                    "-"
                  )}
                </td>

                <td className="px-4 py-2 text-sm text-gray-800 capitalize">
                  {church.plan} ({church.subscription_status})
                </td>

                <td className="px-4 py-2 text-sm text-gray-500">
                  {new Date(church.created_at).toLocaleDateString()}
                </td>

                {/* NEW COLUMNS */}
                <td className="px-4 py-2 text-sm text-gray-800 text-center">
                  {church.membersCount}
                </td>
                <td className="px-4 py-2 text-sm text-gray-800 text-center">
                  {church.eventsCount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
