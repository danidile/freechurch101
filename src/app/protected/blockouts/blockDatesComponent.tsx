"use client";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/react";
import { parseDate } from "@internationalized/date";
import { useRouter } from "next/navigation";

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
import { updateBlockoutsAction } from "./updateBlockoutsAction";
import { RangeValue, RangeValueString } from "@/utils/types/types";
import { useUserStore } from "@/store/useUserStore";
import { addBlockoutAction } from "./addBlockoutsAction";
import { deleteBlockoutAction } from "./deleteBlockoutsAction";
import LoadingBlockoutsPage from "./loading";
import { getBlockoutsByUserId } from "@/hooks/GET/getBlockoutsByUserId";
import { FaPlus } from "react-icons/fa6";

export default function BlockDatesComponent({}: {}) {
  const { userData, loading } = useUserStore();

  const [blockedDates, setBlockedDates] = useState<RangeValue[]>([]);
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
  }, [userData.loggedIn, loading]);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [value, setValue] = useState<RangeValue | null>({
    start: today(getLocalTimeZone()).add({ days: 3 }),
    end: today(getLocalTimeZone()).add({ days: 7 }),
  });

  const formatter = new Intl.DateTimeFormat("it-IT", {
    weekday: "short",
    day: "2-digit",
    month: "long",
    // year: "numeric",
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
    }
  };

  const deleteBlock = async (blockId: string) => {
    await deleteBlockoutAction({ blockId });

    setBlockedDates((prev) => prev.filter((date) => date.id !== blockId));
  };

  return (
    <I18nProvider locale="it-IT-u-ca-gregory">
      <div className="gap-0">
        <h3 className="loading-none">Blocca date</h3>
        <p className="">
          Inserisci durante quali date non sarai disponibile per le turnazioni.
        </p>
      </div>
      {/* <div className="mx-auto flex-col relative">
            <RangeCalendar
              color="danger"
              className="calendar-heroui"
              aria-label="Date (Uncontrolled)"
              onChange={setValue}
              minValue={today(getLocalTimeZone()).add({ days: 1 })}
              allowsNonContiguousRanges
              isReadOnly
              isDateUnavailable={(date) =>
                blockedDates.some(
                  (range) =>
                    date.compare(range.start) >= 0 &&
                    date.compare(range.end) <= 0
                )
              }
              firstDayOfWeek="mon"
            />
          </div> */}
      <div className="flex flex-col items-center justify-center">
        <Table
          key="Songs-table"
          className="w-full min-w-[300px] max-w-[600px] my-4"
          aria-label="Team members table"
          bottomContent={
            <Button
              isIconOnly
              color="primary"
              size="lg"
              className="ml-auto mr-0"
              onPress={onOpen}
            >
              <FaPlus />
            </Button>
          }
        >
          <TableHeader>
            <TableColumn>Inizio</TableColumn>
            <TableColumn>Fine</TableColumn>
            <TableColumn>Azioni</TableColumn>
          </TableHeader>
          <TableBody items={blockedDates}>
            {(date) => (
              <TableRow key={date.id} className="capitalize">
                <TableCell>
                  {formatter.format(date.start.toDate(getLocalTimeZone()))}
                </TableCell>
                <TableCell>
                  {formatter.format(date.end.toDate(getLocalTimeZone()))}
                </TableCell>
                <TableCell>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="flat"
                    color="danger"
                    onPress={() => {
                      deleteBlock(date.id);
                    }}
                  >
                    <FaRegTrashAlt />
                  </Button>{" "}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

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
                    onChange={() => setValue}
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
