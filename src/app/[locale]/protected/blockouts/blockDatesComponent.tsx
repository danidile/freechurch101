"use client";
import React, { useState, useEffect } from "react";
import { I18nProvider } from "@react-aria/i18n";
import { getLocalTimeZone, today } from "@internationalized/date";
import { useUserStore } from "@/store/useUserStore";
import { addBlockoutAction } from "./addBlockoutsAction";
import { deleteBlockoutAction } from "./deleteBlockoutsAction";
import { getBlockoutsByUserId } from "@/hooks/GET/getBlockoutsByUserId";
import { BlockedDate, RangeValueString } from "@/utils/types/types";
import DateRangePicker from "@/app/[locale]/components/DataRangePicker";
import { Button, Chip } from "@heroui/react";
import { FiPlus } from "react-icons/fi";
import { LuCalendarOff, LuCalendarPlus } from "react-icons/lu";
import { TbTrash } from "react-icons/tb";
import ChurchLabLoader from "@/app/[locale]/components/churchLabSpinner";

const formatter = new Intl.DateTimeFormat("it-IT", {
  weekday: "short",
  day: "2-digit",
  month: "long",
});

function formatDateLocal(date: Date): string {
  return date.toLocaleDateString("sv-SE");
}

function calculateDuration(start: Date, end: Date): number {
  return Math.ceil(Math.abs(end.getTime() - start.getTime()) / 86400000) + 1;
}

export default function BlockDatesComponent() {
  const { userData, loading } = useUserStore();
  const [blockedDates, setBlockedDates] = useState<BlockedDate[] | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [value, setValue] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });
  const [showPicker, setShowPicker] = useState(false);
  const [alreadySubmitting, setAlreadySubmitting] = useState(false);

  useEffect(() => {
    async function fetchEverything() {
      if (userData.loggedIn && !loading) {
        const fetched = await getBlockoutsByUserId();
        setBlockedDates(
          fetched.map(({ id, start, end }) => ({
            id,
            start: new Date(start + "T00:00:00"),
            end: new Date(end + "T00:00:00"),
          })),
        );
      }
      setValue({ start: null, end: null });
    }
    fetchEverything();
  }, [userData.loggedIn, loading, refreshKey]);

  const addBlock = async () => {
    setAlreadySubmitting(true);
    if (value.start && value.end) {
      const sanitized: RangeValueString = {
        start: formatDateLocal(value.start),
        end: formatDateLocal(value.end),
      };
      await addBlockoutAction({ blockedDates: sanitized });
      setRefreshKey((prev) => prev + 1);
    }
    setAlreadySubmitting(false);
  };

  const deleteBlock = async (blockId: string) => {
    await deleteBlockoutAction({ blockId });
    setBlockedDates((prev) => prev?.filter((d) => d.id !== blockId) ?? null);
    setRefreshKey((prev) => prev + 1);
  };

  const todayStr = formatDateLocal(new Date()); // YYYY-MM-DD in local time

  const upcomingDates =
    blockedDates?.filter((b) => formatDateLocal(b.end) >= todayStr) ?? null;

  const totalDays =
    upcomingDates?.reduce(
      (sum, b) => sum + calculateDuration(b.start, b.end),
      0,
    ) ?? 0;

  return (
    <div className="flex flex-col gap-4 w-full p-2 max-w-xl mx-auto">
      <I18nProvider locale="it-IT-u-ca-gregory">
        {/* Stats Row */}
        {upcomingDates && (
          <div className="md:grid grid-cols-2 gap-3 hidden">
            <div className="bg-default-100 rounded-xl p-3">
              <p className="text-xs text-default-500 mb-1">Blocchi attivi</p>
              <p className="text-2xl font-medium">{upcomingDates.length}</p>
            </div>
            <div className="bg-default-100 rounded-xl p-3">
              <p className="text-xs text-default-500 mb-1">Giorni bloccati</p>
              <p className="text-2xl font-medium">{totalDays}</p>
            </div>
          </div>
        )}

        {/* List */}
        {!blockedDates ? (
          <ChurchLabLoader height="200px" />
        ) : upcomingDates!.length === 0 && !showPicker ? (
          <div
            onClick={() => setShowPicker(true)}
            className="flex flex-col items-center justify-center gap-3 py-14 text-default-400 border border-divider rounded-xl"
          >
            <LuCalendarOff size={30} strokeWidth={1.2} />
            <div className="text-center">
              <p className="text-sm font-medium text-default-600">
                Nessuna data bloccata
              </p>
              <p className="text-xs text-default-400 mt-1">
                Aggiungi il tuo primo blocco di date
              </p>
            </div>
          </div>
        ) : (
          (upcomingDates!.length > 0 || showPicker) && (
            <div className="border border-divider rounded-xl">
              {upcomingDates!.map((date, idx) => {
                const dur = calculateDuration(date.start, date.end);
                return (
                  <div
                    key={date.id}
                    className={`flex border-b-1 items-center justify-between px-4 py-3 hover:bg-default-50 transition-colors ${
                      idx < upcomingDates!.length - 1
                        ? "border-b border-divider"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center bg-danger-50 text-danger-700">
                        <LuCalendarOff size={16} strokeWidth={1.5} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-default-900 capitalize truncate">
                          {formatter.format(date.start)} →{" "}
                          {formatter.format(date.end)}
                        </p>
                        <p className="text-xs text-default-500 mt-0.5">
                          {dur} giorn{dur !== 1 ? "i" : "o"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteBlock(date.id)}
                      className="w-8 h-8 rounded-lg border border-divider flex items-center justify-center text-default-400 hover:bg-danger-50 hover:text-danger-600 hover:border-danger-200 transition-colors flex-shrink-0"
                      title="Elimina blocco"
                      aria-label={`Elimina blocco dal ${formatter.format(date.start)}`}
                    >
                      <TbTrash size={15} />
                    </button>
                  </div>
                );
              })}
              <div
                onClick={() => setShowPicker(true)}
                className={`flex items-center justify-between px-4 py-3 w-full hover:bg-default-50 transition-colors`}
              >
                <div className="flex items-center gap-2 min-w-0 w-full justify-center">
                  <div className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center bg-blue-50 text-blue-700">
                    <LuCalendarPlus size={16} strokeWidth={1.5} />
                  </div>
                  <div className="flex w-full items-center justify-between hover:bg-default-50 transition-colors">
                    <DateRangePicker
                      startDate={value.start}
                      endDate={value.end}
                      onChange={(range) =>
                        setValue({ start: range.start, end: range.end })
                      }
                      blockedDates={blockedDates}
                      minDate={today(getLocalTimeZone()).toDate(
                        getLocalTimeZone(),
                      )}
                      disabledRanges={blockedDates}
                    />
                    <div className="flex gap-2">
                      {/* <Button
                        size="sm"
                        variant="flat"
                        color="default"
                        onPress={() => {
                          setShowPicker(false);
                          setValue({ start: null, end: null });
                        }}
                      >
                        Annulla
                      </Button> */}
                      {value.start && value.end && (
                        <Button
                          size="sm"
                          variant="solid"
                          color="primary"
                          className="px-8"
                          isDisabled={
                            !value.start || !value.end || alreadySubmitting
                          }
                          isLoading={alreadySubmitting}
                          onPress={async () => {
                            await addBlock();
                            setShowPicker(false);
                          }}
                        >
                          Salva blocco
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {upcomingDates!.length > 0 && (
                <div className="px-4 py-2 bg-default-50 border-t border-divider text-xs text-default-400">
                  {upcomingDates!.length} blocch
                  {upcomingDates!.length !== 1 ? "i" : "o"} attiv
                  {upcomingDates!.length !== 1 ? "i" : "o"}
                </div>
              )}
            </div>
          )
        )}
      </I18nProvider>
    </div>
  );
}
