"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import {
  Button,
  Input,
  Select,
  SelectItem,
  Tabs,
  Tab,
  Card,
  CardBody,
  RadioGroup,
  Radio,
  Divider,
} from "@heroui/react";
import { TimeInput } from "@heroui/react";
import { Time } from "@internationalized/date";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useChurchStore } from "@/store/useChurchStore";
import { eventSchema, formValues } from "./types";
import { createEventsArray } from "./convertForm";
import SetListTabs from "@/app/components/SetListTabsComponent";
import { useUserStore } from "@/store/useUserStore";
import CalendarComponent from "@/app/components/calendarComponent";

export const weekDays = [
  { key: "monday", label: "Lunedì" },
  { key: "tuesday", label: "Martedì" },
  { key: "wednesday", label: "Mercoledì" },
  { key: "thursday", label: "Giovedì" },
  { key: "friday", label: "Venerdì" },
  { key: "saturday", label: "Sabato" },
  { key: "sunday", label: "Domenica" },
];

export default function CreateMultipleEventsForm() {
  const [type, setType] = useState<string>("settimanale");
  const [eventsPreview, setEventsPreview] = useState<any[]>([]);
  const { eventTypes } = useChurchStore();
  const { userData, loading } = useUserStore();

  const date = new Date();
  const todaysDate = date.toISOString().split("T")[0];
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const {
    handleSubmit,
    register,
    control,
    formState: { isSubmitting, errors },
  } = useForm<formValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      event_type: "sundayservice",
      date: todaysDate,
      weeklyRepeatType: "settimanale",
    },
  });

  const generatePreview = () => {
    // Manually trigger form validation before generating the preview
    handleSubmit(async (data) => {
      const createdEvents = createEventsArray(data, type);

      // Transform the created events to match the SetListTabs component's expected data structure
      const formattedEvents = createdEvents.map((event, index) => {
        const dateObj = new Date(event.date);
        const hour = dateObj.getHours().toString().padStart(2, "0");
        const minute = dateObj.getMinutes().toString().padStart(2, "0");

        return {
          id: `preview-${index}-${Date.now()}`, // Add a unique ID for the key
          event_type: event.event_type,
          date: event.date,
          hour: `${hour}:${minute}`, // Add the hour in "HH:MM" format
          setlistTeams: [] as unknown[], // Add an empty team array with explicit type
        };
      });

      setEventsPreview(formattedEvents);
    })();
  };

  const handleFinalSubmit = async (data: formValues) => {
    const formattedData = createEventsArray(data, type);
    console.log("Submitting the following events:", formattedData);
    // Here you would call an API or a Redux action to submit the data
  };

  return (
    <div className="container-sub">
      <div className="form-div crea-setlist-container">
        <form onSubmit={handleSubmit(handleFinalSubmit)}>
          <h4>Crea Eventi</h4>

          <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
            <Select
              {...register("event_type")}
              fullWidth
              items={eventTypes}
              label="Tipo di evento"
              variant="underlined"
              placeholder="Seleziona il tipo di evento"
            >
              {(type) => (
                <SelectItem key={type.key}>
                  {type.alt ? type.alt : type.label}
                </SelectItem>
              )}
            </Select>
            {errors.event_type && (
              <p className="text-red-500 text-sm">
                {errors.event_type.message}
              </p>
            )}

            <Input
              type="date"
              {...register("date")}
              label="Data inizio"
              variant="bordered"
              size="sm"
              defaultValue={todaysDate}
            />
            {errors.date && (
              <p className="text-red-500 text-sm">{errors.date.message}</p>
            )}

            <Tabs
              aria-label="Tipo evento"
              fullWidth
              selectedKey={type}
              onSelectionChange={(key) => setType(key.toString())}
            >
              <Tab key="settimanale" title="Settimanale">
                <Card>
                  <CardBody>
                    <div className="flex w-full justify-center mb-8 items-center flex-wrap md:flex-nowrap gap-4">
                      <p>Ripetizione:</p>
                      <Controller
                        name="weeklyRepeatType"
                        control={control}
                        defaultValue="settimanale"
                        render={({ field }) => (
                          <RadioGroup
                            color="primary"
                            orientation="horizontal"
                            aria-label="Tipo di ripetizione settimanale"
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <Radio value="settimanale">Settimanale</Radio>
                            <Radio value="alterne">Settimane alterne</Radio>
                          </RadioGroup>
                        )}
                      />
                    </div>

                    <div className="flex w-full justify-center mb-4 items-center flex-wrap md:flex-nowrap gap-4">
                      <p className="min-w-12">Tutti i</p>
                      <Select
                        aria-label="Giorno della settimana"
                        variant="bordered"
                        className="max-w-xs"
                        defaultSelectedKeys={["monday"]}
                        {...register("weekday")}
                      >
                        {weekDays.map((weekDay) => (
                          <SelectItem
                            key={weekDay.key}
                            textValue={weekDay.label}
                          >
                            {weekDay.label}
                          </SelectItem>
                        ))}
                      </Select>
                      {(errors as any).weekday && (
                        <p className="text-red-500 text-sm">
                          {(errors as any).weekday.message}
                        </p>
                      )}

                      <p className="min-w-14 text-right">alle ore</p>
                      <Controller
                        name="weeklyTime"
                        control={control}
                        defaultValue={new Time(20, 0)}
                        render={({ field: { onChange, value } }) => (
                          <TimeInput
                            aria-label="Orario evento settimanale"
                            variant="bordered"
                            value={value || new Time(20, 0)}
                            onChange={onChange}
                          />
                        )}
                      />
                      {"weeklyTime" in errors && errors.weeklyTime && (
                        <p className="text-red-500 text-sm">
                          {errors.weeklyTime.message}
                        </p>
                      )}
                    </div>

                    <div className="flex w-full justify-center mb-4 items-center flex-wrap md:flex-nowrap gap-4">
                      <p className="min-w-32">per le prossime</p>
                      <Select
                        aria-label="Numero di settimane"
                        defaultSelectedKeys={["2"]}
                        variant="bordered"
                        className="max-w-xs"
                        {...register("repetition")}
                      >
                        {Array.from({ length: 12 }).map((_, index) => (
                          <SelectItem
                            key={(index + 2).toString()}
                            textValue={(index + 2).toString()}
                          >
                            {index + 2}
                          </SelectItem>
                        ))}
                      </Select>
                      <p className="min-w-28">settimane</p>
                    </div>
                  </CardBody>
                </Card>
              </Tab>

              <Tab key="monthly" title="Mensile">
                <Card>
                  <CardBody>
                    <div className="flex w-full justify-center mb-4 items-center flex-wrap md:flex-nowrap gap-4">
                      <p className="min-w-9">Ogni</p>
                      <Select
                        aria-label="Ordine del giorno mensile"
                        variant="bordered"
                        className="max-w-xs"
                        defaultSelectedKeys={["first"]}
                        {...register("monthOrder")}
                      >
                        <SelectItem key="first" textValue="Primo">
                          Primo
                        </SelectItem>
                        <SelectItem key="second" textValue="Secondo">
                          Secondo
                        </SelectItem>
                        <SelectItem key="third" textValue="Terzo">
                          Terzo
                        </SelectItem>
                        <SelectItem key="last" textValue="Ultimo">
                          Ultimo
                        </SelectItem>
                      </Select>
                      {"monthOrder" in errors && (errors as any).monthOrder && (
                        <p className="text-red-500 text-sm">
                          {(errors as any).monthOrder.message}
                        </p>
                      )}

                      <Select
                        aria-label="Giorno della settimana"
                        variant="bordered"
                        className="max-w-xs"
                        defaultSelectedKeys={["monday"]}
                        {...register("monthlyWeekday")}
                      >
                        {weekDays.map((weekDay) => (
                          <SelectItem
                            key={weekDay.key}
                            textValue={weekDay.label}
                          >
                            {weekDay.label}
                          </SelectItem>
                        ))}
                      </Select>
                      {(errors as any).monthlyWeekday && (
                        <p className="text-red-500 text-sm">
                          {(errors as any).monthlyWeekday.message}
                        </p>
                      )}
                      <p className="min-w-20">del mese</p>
                    </div>

                    <div className="flex w-full mb-4 items-center flex-wrap md:flex-nowrap gap-4">
                      <p className="min-w-16">Alle ore:</p>
                      <Controller
                        name="monthlyTime"
                        control={control}
                        defaultValue={new Time(20, 0)}
                        render={({ field: { onChange, value } }) => (
                          <TimeInput
                            variant="bordered"
                            value={value || new Time(20, 0)}
                            aria-label="Orario evento mensile"
                            onChange={onChange}
                          />
                        )}
                      />
                      {"monthlyTime" in errors && errors.monthlyTime && (
                        <p className="text-red-500 text-sm">
                          {errors.monthlyTime.message}
                        </p>
                      )}
                    </div>

                    <div className="flex w-full mb-4 items-center flex-wrap md:flex-nowrap gap-4">
                      <p className="min-w-28">per i prossimi</p>
                      <Select
                        aria-label="Numero di mesi"
                        defaultSelectedKeys={["2"]}
                        variant="bordered"
                        className="max-w-32"
                        {...register("repetition")}
                      >
                        {Array.from({ length: 11 }).map((_, index) => (
                          <SelectItem
                            key={(index + 2).toString()}
                            textValue={(index + 2).toString()}
                          >
                            {index + 2}
                          </SelectItem>
                        ))}
                      </Select>
                      <p className="min-w-28">mesi.</p>
                    </div>
                  </CardBody>
                </Card>
              </Tab>
            </Tabs>
          </div>

          <br />
          <div className="flex w-full flex-row gap-4">
            <Button
              color="primary"
              variant="flat"
              type="button"
              fullWidth
              onPress={() => {
                generatePreview();
                onOpen();
              }}
              disabled={isSubmitting}
            >
              Crea
            </Button>
          </div>
          <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="center"
            size="2xl"
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    Anteprima Eventi
                  </ModalHeader>
                  <ModalBody className="max-h-[600px]">
                    {eventsPreview.length > 0 ? (
                      <CalendarComponent
                        viewMode="compact"
                        userData={userData}
                        setlists={eventsPreview}
                      />
                    ) : (
                      <p className="text-gray-500 italic">
                        Nessun evento da visualizzare. Compila il modulo e
                        clicca su "Anteprima Eventi".
                      </p>
                    )}
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      fullWidth
                      color="danger"
                      variant="light"
                      onPress={onClose}
                    >
                      Close
                    </Button>
                    <Button
                      color="primary"
                      variant="shadow"
                      type="submit"
                      fullWidth
                      disabled={isSubmitting}
                    >
                      Crea Eventi
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </form>
      </div>
    </div>
  );
}
