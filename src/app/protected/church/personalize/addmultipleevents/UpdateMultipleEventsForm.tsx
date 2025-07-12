"use client";

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
} from "@heroui/react";
import { TimeInput } from "@heroui/react";
import { Time } from "@internationalized/date";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useChurchStore } from "@/store/useChurchStore";
import { eventSchema, formValues } from "./types";

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
  const { eventTypes } = useChurchStore();

  const {
    handleSubmit,
    register,
    watch,
    getValues,
    setValue,
    formState: { isSubmitting },
  } = useForm<formValues>({
    resolver: zodResolver(eventSchema),
  });

  const convertData = async () => {
    const data = getValues();
    console.log("Data to submit:", data);
    // Submit or process the data as needed
  };

  const date = new Date();
  const todaysDate = date.toISOString().split("T")[0];

  return (
    <div className="container-sub">
      <div className="form-div crea-setlist-container">
        <form onSubmit={handleSubmit(convertData)}>
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

            <Input
              type="date"
              {...register("date")}
              label="Data inizio"
              variant="bordered"
              size="sm"
              defaultValue={todaysDate}
            />

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
                      <RadioGroup
                        color="primary"
                        orientation="horizontal"
                        defaultValue="settimanale"
                        aria-label="Tipo di ripetizione settimanale"
                      >
                        <Radio value="settimanale">Settimanale</Radio>
                        <Radio value="alterne">Settimane alterne</Radio>
                      </RadioGroup>
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

                      <p className="min-w-14 text-right">alle ore</p>
                      <TimeInput
                        aria-label="Orario evento settimanale"
                        variant="bordered"
                        defaultValue={new Time(20, 0)}
                      />
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
                        {...register("months")}
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
                      <p className="min-w-20">del mese</p>
                    </div>

                    <div className="flex w-full mb-4 items-center flex-wrap md:flex-nowrap gap-4">
                      <p className="min-w-16">Alle ore:</p>
                      <TimeInput
                        variant="bordered"
                        defaultValue={new Time(20, 0)}
                        aria-label="Orario evento mensile"
                      />
                    </div>

                    <div className="flex w-full mb-4 items-center flex-wrap md:flex-nowrap gap-4">
                      <p className="min-w-28">per i prossimi</p>
                      <Select
                        aria-label="Numero di mesi"
                        defaultSelectedKeys={["2"]}
                        variant="bordered"
                        className="max-w-32"
                        {...register("months")}
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
          <Button
            color="primary"
            variant="shadow"
            type="submit"
            disabled={isSubmitting}
          >
            Crea Eventi
          </Button>
        </form>
      </div>
    </div>
  );
}
