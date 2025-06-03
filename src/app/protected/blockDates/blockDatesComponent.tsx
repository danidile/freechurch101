"use client";
import fbasicUserData from "@/utils/supabase/getUserData";
import { basicUserData } from "@/utils/types/userData";
import { DateRangePicker } from "@heroui/react";
import type { RangeValue } from "@react-types/shared";
import type { DateValue } from "@react-types/datepicker";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import { parseDate, getLocalTimeZone, today } from "@internationalized/date";
import { useState } from "react";
import { useDateFormatter } from "@react-aria/i18n";
import { FaPlus } from "react-icons/fa6";

export default function BlockDatesComponent() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [value, setValue] = useState<RangeValue<DateValue> | null>({
    start: parseDate("2024-04-01"),
    end: parseDate("2024-04-08"),
  });

  const [blockedDates, setBlockedDates] = useState<RangeValue<DateValue>[]>([]);
  let formatter = useDateFormatter({ dateStyle: "long" });

  const addBlock = (onClose: () => void) => {
    if (value) {
      setBlockedDates([...blockedDates, value]);
    }
    onClose();
  };

  return (
    <div className="container-sub">
      {blockedDates.map((date) => {
        return <p>{date.end + " " + date.start}</p>;
      })}
      <Button
        isIconOnly
        color="primary"
        size="lg"
        className="mr-0"
        onPress={onOpen}
      >
        <FaPlus />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Blocco date
              </ModalHeader>
              <ModalBody>
                <p>Seleziona il periodo di tempo in cui non sei disponibile.</p>
                <DateRangePicker
                  minValue={today(getLocalTimeZone()).add({ days: 1 })}
                  fullWidth
                  onChange={setValue}
                  label="Periodo Blocco"
                />
                <p className="text-default-500 text-sm">
                  Data selezionata:{" "}
                  {value
                    ? formatter.formatRange(
                        value.start.toDate(getLocalTimeZone()),
                        value.end.toDate(getLocalTimeZone())
                      )
                    : "--"}
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
  );
}
