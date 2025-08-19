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
import { Calendar, Clock, Trash2 } from "lucide-react";
import { LuCalendarOff } from "react-icons/lu";
import { HeaderCL } from "@/app/components/header-comp";

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
  const calculateDuration = (start: Date, end: Date) => {
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };
  return (
    <div className="max-w-lg mx-auto p-2 bg-white min-h-screen">
      <I18nProvider locale="it-IT-u-ca-gregory">
        

        <div className="mb-6">
          {blockedDates.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <LuCalendarOff
                className="w-12 h-12 text-gray-800 mx-auto mb-4"
                strokeWidth={1}
              />
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Nessuna data bloccata
              </h3>
              <p className="text-gray-500">
                Aggiungi il tuo primo blocco di date
              </p>
            </div>
          ) : (
            <div className="text-center flex flex-col gap-2  p-2 sm:p-4 bg-gray-50 rounded-lg">
              {blockedDates.map((date) => (
                <div
                  key={date.id}
                  className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-400 hidden sm:block" />
                    <div>
                      <p className="capitalize font-medium text-gray-900 text-left">
                        {" "}
                        {formatter.format(date.start)} →{" "}
                        {formatter.format(date.end)}
                      </p>
                      <p className=" text-left text-sm text-gray-500">
                        {calculateDuration(date.start, date.end)} giorn
                        {calculateDuration(date.start, date.end) !== 1
                          ? "i"
                          : "o"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteBlock(date.id)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Elimina blocco"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {!showPicker && (
          <div className="flex justify-center items-center">
            <button
              onClick={() => setShowPicker(true)}
              className="mt-4 bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded-lg"
              disabled={showPicker}
            >
              <FaPlus className="inline-block mr-2" />
              Aggiungi blocco
            </button>
          </div>
        )}
        {/* DateRangePicker & Save Button */}
        {showPicker && (
          <div className="mx-auto mt-1 text-center w-[500px] max-w-[95vw] ">
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
            {value.start && (
              <button
                onClick={async () => {
                  await addBlock();
                  setShowPicker(false); // hide picker after save
                }}
                className={`max-w-[300px] mx-auto button-style w-full ${alreadySubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
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
            )}
          </div>
        )}
      </I18nProvider>
    </div>
  );
}
