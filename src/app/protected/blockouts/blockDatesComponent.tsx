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
} from "@heroui/react";
import { getLocalTimeZone, today } from "@internationalized/date";
import { useState } from "react";
import { I18nProvider } from "@react-aria/i18n";
import { FaRegTrashAlt } from "react-icons/fa";
import { updateBlockoutsAction } from "./updateBlockoutsAction";
import { RangeValue, RangeValueString } from "@/utils/types/types";

export default function BlockDatesComponent({
  preBlockedDates,
}: {
  preBlockedDates: RangeValueString[];
}) {
  const router = useRouter();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [value, setValue] = useState<RangeValue | null>({
    start: today(getLocalTimeZone()).add({ days: 3 }),
    end: today(getLocalTimeZone()).add({ days: 7 }),
  });

  const [blockedDates, setBlockedDates] = useState<RangeValue[]>(
    preBlockedDates.map(({ id, profile, start, end }) => ({
      start: parseDate(start.toString()),
      end: parseDate(end.toString()),
      id,
      profile,
    })) || null
  );
  const formatter = new Intl.DateTimeFormat("it-IT", {
    weekday: "short",
    day: "2-digit",
    month: "long",
    // year: "numeric",
  });

  const addBlock = (onClose: () => void) => {
    if (value) {
      const updated = [...blockedDates, value].sort((a, b) =>
        a.start.compare(b.start)
      );
      setBlockedDates(updated);
    }
    onClose();
  };

  const updateBlockouts = async () => {
    const sanitized = blockedDates.map(({ id, profile, start, end }) => ({
      start: start.toString(), // or start.toDate(getLocalTimeZone()).toLocaleDateString("sv-SE")
      end: end.toString(),
      id,
      profile,
    }));
    console.log(sanitized);

    await updateBlockoutsAction({
      blockedDates: sanitized,
      preBlockedDates,
    });

    router.refresh();
  };

  return (
    <I18nProvider locale="it-IT-u-ca-gregory">
      <Card className="max-w-[500px]" shadow="none">
        <CardHeader className="flex-col border-b-1 px-5 py-5 ">
          <h2>Blocca date</h2>
          <p className="text-center">
            Inserisci durante quali date non sarai disponibile per le
            turnazioni.
          </p>
        </CardHeader>
        <CardBody className="py-5">
          <div className="mx-auto flex-col relative">
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
          </div>
          <div className="container-sub">
            {blockedDates.map((date, idx) => (
              <div key={idx} className="flex gap-3 items-center my-2">
                <p className="capitalize ">
                  {formatter.format(date.start.toDate(getLocalTimeZone()))} –{" "}
                  {formatter.format(date.end.toDate(getLocalTimeZone()))}
                </p>
                <Button
                  isIconOnly
                  size="sm"
                  variant="flat"
                  color="danger"
                  onPress={() =>
                    setBlockedDates((prev) => prev.filter((_, i) => i !== idx))
                  }
                >
                  <FaRegTrashAlt />
                </Button>
              </div>
            ))}
            <Button
              color="primary"
              size="lg"
              className="mx-auto"
              onPress={onOpen}
            >
              Aggiungi blocco data
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="flex flex-col gap-1 border-b-2 border-black">
                      Blocco date
                    </ModalHeader>
                    <ModalBody className="flex flex-col justify-center items-center">
                      <p>
                        Seleziona il periodo di tempo in cui non sei
                        disponibile.
                      </p>
                      <RangeCalendar
                        color="danger"
                        className="your-custom-calendar-class"
                        aria-label="Date (Uncontrolled)"
                        onChange={setValue}
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
                          {" "}
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
        </CardBody>
        <CardFooter className="border-t-1 p-5">
          <Button fullWidth color="danger" size="lg" onPress={updateBlockouts}>
            Aggiorna giorni blocco
          </Button>
        </CardFooter>
      </Card>
    </I18nProvider>
  );
}
