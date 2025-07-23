"use client";
import React, { useState, useEffect } from "react";
import { I18nProvider } from "@react-aria/i18n";
import { getLocalTimeZone, today, parseDate } from "@internationalized/date";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { useUserStore } from "@/store/useUserStore";
import { addBlockoutAction } from "./addBlockoutsAction";
import { deleteBlockoutAction } from "./deleteBlockoutsAction";
import { getBlockoutsByUserId } from "@/hooks/GET/getBlockoutsByUserId";
import { BlockedDate, RangeValueString } from "@/utils/types/types";
import DateRangePicker from "@/app/components/DataRangePicker";

export default function BlockDatesComponent() {
  const { userData, loading } = useUserStore();
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [value, setValue] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });
  const [showPicker, setShowPicker] = useState(false);
  const [alreadySubmitting, setAlreadySubmitting] = useState<boolean>(false);

  useEffect(() => {
    async function fetchEverything() {
      if (userData.loggedIn && !loading) {
        const fetched = await getBlockoutsByUserId();
        setBlockedDates(
          fetched.map(({ id, start, end }) => ({
            id,
            start: new Date(start),
            end: new Date(end),
          }))
        );
      }
      setValue({ start: null, end: null });
    }
    fetchEverything();
  }, [userData.loggedIn, loading, refreshKey]);

  const formatter = new Intl.DateTimeFormat("it-IT", {
    weekday: "short",
    day: "2-digit",
    month: "long",
  });
  function formatDateLocal(date: Date): string {
    return date.toLocaleDateString("sv-SE"); // Outputs in YYYY-MM-DD format
  }
  const addBlock = async () => {
    setAlreadySubmitting(true);
    console.log(value.start, value.end);
    if (value.start && value.end) {
      const newBlock: BlockedDate = {
        id: crypto.randomUUID(),
        start: value.start,
        end: value.end,
      };

      const sanitized: RangeValueString = {
        start: formatDateLocal(newBlock.start),
        end: formatDateLocal(newBlock.end),
      };
      console.log("sanitized", sanitized);

      await addBlockoutAction({ blockedDates: sanitized });
      setRefreshKey((prev) => prev + 1);
    }
    setAlreadySubmitting(false);
  };

  const deleteBlock = async (blockId: string) => {
    await deleteBlockoutAction({ blockId });
    setBlockedDates((prev) => prev.filter((d) => d.id !== blockId));
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="container-sub">
      <I18nProvider locale="it-IT-u-ca-gregory">
        <h4>Blocca date</h4>
        <p>
          Inserisci durante quali date non sarai disponibile per le turnazioni.
        </p>
        {/* Table of Blocked Dates */}
        <div className="w-[500px] max-w-[95vw] my-4">
          <table className="btable w-full">
            <thead>
              <tr>
                <th className="!text-center">Inizio</th>
                <th className="!text-center">Fine</th>
                <th className="!text-center">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {blockedDates.map((date) => (
                <tr key={date.id} className="capitalize">
                  <td>{formatter.format(date.start)}</td>
                  <td>{formatter.format(date.end)}</td>
                  <td>
                    <button
                      className="text-red-600 hover:text-red-400 mx-auto"
                      onClick={() => deleteBlock(date.id)}
                      title="Elimina blocco"
                    >
                      <FaRegTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
              {/* Row for new selection */}
              {/* {value.start && value.end && (
                <tr className="bg-gray-100 capitalize">
                  <td>{formatter.format(value.start)}</td>
                  <td>{formatter.format(value.end)}</td>
                  <td className="text-gray-400 mx-auto">Da salvare</td>
                </tr>
              )} */}
            </tbody>
          </table>
        </div>
        {/* Date Range Picker & Add Button */}
        {/* Toggle Button */}
        {!showPicker && (
          <button
            onClick={() => setShowPicker(true)}
            className="mt-4 bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded-lg"
            disabled={showPicker}
          >
            <FaPlus className="inline-block mr-2" />
            Aggiungi blocco
          </button>
        )}
        {/* DateRangePicker & Save Button */}
        {showPicker && (
          <div className=" mt-1 text-center w-[500px] max-w-[95vw] ">
            <DateRangePicker
              startDate={value.start}
              endDate={value.end}
              onChange={(range) =>
                setValue({ start: range.start, end: range.end })
              }
              blockedDates={blockedDates}
              minDate={today(getLocalTimeZone()).toDate(getLocalTimeZone())}
              disabledRanges={blockedDates}
            />

            <button
              onClick={async () => {
                await addBlock();
                setShowPicker(false); // hide picker after save
              }}
              className={`button-style w-full ${alreadySubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={alreadySubmitting}
            >
              {alreadySubmitting ? (
                <div
                  className="h-6 mx-auto w-6 animate-spin rounded-full border-4 border-black border-t-gray-200"
                  aria-label="Loading..."
                />
              ) : (
                <> Salva</>
              )}
            </button>
          </div>
        )}{" "}
      </I18nProvider>
    </div>
  );
}
