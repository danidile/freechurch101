"use client";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  RangeCalendar,
  Skeleton,
} from "@heroui/react";
import { today, getLocalTimeZone } from "@internationalized/date";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import { I18nProvider } from "@react-aria/i18n";
import { FaRegTrashAlt } from "react-icons/fa";

export default function LoadingBlockoutsPage() {
  return (
    <I18nProvider locale="it-IT-u-ca-gregory">
      <Card className="max-w-[500px]" shadow="none">
        <CardHeader className="flex-col border-b-1 px-5 py-5 ">
          <h3>Blocca date</h3>
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
              minValue={today(getLocalTimeZone()).add({ days: 1 })}
              allowsNonContiguousRanges
              isReadOnly
              firstDayOfWeek="mon"
            />
          </div>
          <div className="flex flex-col items-center justify-center">
            <Button color="primary" size="lg" className="mx-auto">
              Aggiungi blocco data
            </Button>
          </div>
        </CardBody>
      </Card>
    </I18nProvider>
  );
}
