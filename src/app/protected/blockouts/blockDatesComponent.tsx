"use client";
import { parseDate } from "@internationalized/date";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  RangeCalendar,
  Button,
  useDisclosure,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
import { getLocalTimeZone, today } from "@internationalized/date";
import { useEffect, useState } from "react";
import { I18nProvider } from "@react-aria/i18n";
import { FaRegTrashAlt } from "react-icons/fa";
import { RangeValue, RangeValueString } from "@/utils/types/types";
import { useUserStore } from "@/store/useUserStore";
import { addBlockoutAction } from "./addBlockoutsAction";
import { deleteBlockoutAction } from "./deleteBlockoutsAction";
import { getBlockoutsByUserId } from "@/hooks/GET/getBlockoutsByUserId";
import { FaPlus } from "react-icons/fa6";

export default function BlockDatesComponent({}: {}) {
  const { userData, loading } = useUserStore();

  const [blockedDates, setBlockedDates] = useState<RangeValue[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  useEffect(() => {
    const fetchEverything = async () => {
      // Now wait until user is definitely available
      if (userData.loggedIn && !loading) {
        const fetchedBlockouts = await getBlockoutsByUserId();
        setBlockedDates(
          fetchedBlockouts.map(({ id, profile, start, end }) => ({
            start: parseDate(start.toString()),
            end: parseDate(end.toString()),
            id,
            profile,
          })) || null
        );
      }
    };

    fetchEverything();
  }, [userData.loggedIn, loading, refreshKey]);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [value, setValue] = useState<RangeValue | null>({
    start: today(getLocalTimeZone()).add({ days: 3 }),
    end: today(getLocalTimeZone()).add({ days: 7 }),
  });

  const formatter = new Intl.DateTimeFormat("it-IT", {
    weekday: "short",
    day: "2-digit",
    month: "long",
  });

  const addBlock = async (onClose: () => void) => {
    if (value) {
      const newBlock = {
        ...value,
        id: crypto.randomUUID(), // Add a unique id
      };

      const updated = [...blockedDates, newBlock].sort((a, b) =>
        a.start.compare(b.start)
      );
      onClose();

      setBlockedDates(updated);

      const sanitized: RangeValueString = {
        start: newBlock.start.toString(),
        end: newBlock.end.toString(),
      };

      await addBlockoutAction({ blockedDates: sanitized });
      setRefreshKey((prev) => prev + 1); // increment to force refetch
    }
  };

  const deleteBlock = async (blockId: string) => {
    await deleteBlockoutAction({ blockId });
    setRefreshKey((prev) => prev + 1); // increment to force refetch
    setBlockedDates((prev) => prev.filter((date) => date.id !== blockId));
  };

  return (
    <I18nProvider locale="it-IT-u-ca-gregory">
      <div className="gap-0">
        <h4 className="loading-none">Blocca date</h4>
        <p className="">
          Inserisci durante quali date non sarai disponibile per le turnazioni.
        </p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className=" w-[500px] max-w-[95vw] my-4 relative">
          <table className="btable">
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
                  <td>
                    {formatter.format(date.start.toDate(getLocalTimeZone()))}
                  </td>
                  <td>
                    {formatter.format(date.end.toDate(getLocalTimeZone()))}
                  </td>
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
            </tbody>
          </table>

          {/* Floating Button */}
          <button
            className=" mt-4  bg-[#2f6de6] hover:bg-[#2f6ce6e2] transition text-white p-3 rounded-full shadow-md"
            onClick={onOpen}
            title="Aggiungi blocco"
          >
            <FaPlus />
          </button>
        </div>

        <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 border-b-2 border-black">
                  Blocco date
                </ModalHeader>
                <ModalBody className="flex flex-col justify-center items-center">
                  <p>
                    Seleziona il periodo di tempo in cui non sei disponibile.
                  </p>
                  <RangeCalendar
                    color="danger"
                    className="your-custom-calendar-class"
                    aria-label="Date (Uncontrolled)"
                    onChange={(val) => setValue({ ...val })}
                    minValue={today(getLocalTimeZone()).add({ days: 1 })}
                    allowsNonContiguousRanges
                    isDateUnavailable={(date) =>
                      blockedDates.some(
                        (range) =>
                          date.compare(range.start) >= 0 &&
                          date.compare(range.end) <= 0
                      )
                    }
                    firstDayOfWeek="mon"
                  />
                  <p className="text-default-500 text-sm">
                    Data selezionata:{" "}
                    <span className="capitalize">
                      {value
                        ? formatter.formatRange(
                            value.start.toDate(getLocalTimeZone()),
                            value.end.toDate(getLocalTimeZone())
                          )
                        : "--"}
                    </span>
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button fullWidth color="danger" onPress={onClose}>
                    Cancella
                  </Button>
                  <Button
                    fullWidth
                    color="primary"
                    onPress={() => addBlock(onClose)}
                  >
                    Aggiungi
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </I18nProvider>
  );
}
