"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  TimeInput,
} from "@heroui/react";

import { I18nProvider } from "@react-aria/i18n";
import {
  DateValue,
  parseTime,
  getLocalTimeZone,
  today,
} from "@internationalized/date";
import { DatePicker } from "@heroui/react";
import { parseDate } from "@internationalized/date";
import {
  churchMembersT,
  roomsType,
  scheduleTemplate,
  scheduleTemplateSchema,
  setListSongT,
  setListT,
  teamData,
} from "@/utils/types/types";
import { Button, Select, SelectItem, Tooltip } from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useMemo, useRef, useState } from "react";
import { TsongNameAuthor, formValues } from "@/utils/types/types";

import { SelectWorshipTeamMemberDrawer } from "@/app/protected/teams/SelectWorshipTeamMemberDrawer";
import { RiDeleteBinLine } from "react-icons/ri";
import { AnimatePresence, motion, Reorder } from "framer-motion";
import { FaPlus, FaRegCalendarAlt, FaRegStar } from "react-icons/fa";
import { useChurchStore } from "@/store/useChurchStore";
import { MdEditNote, MdOutlineTitle } from "react-icons/md";
import { TbClockHour2, TbMusicPlus } from "react-icons/tb";
import BlockoutsCalendarComponent from "@/app/protected/blockouts-calendar/calendarComponent";
import { useUserStore } from "@/store/useUserStore";
import CDropdown, { CDropdownOption } from "@/app/components/CDropdown";
import { getSetlistTeamLeadBySetlistAndUserId } from "@/hooks/GET/getSetlistTeamLeadBySetlistAndUserId";
import { checkPermissionClient } from "@/utils/supabase/permissions/checkPermissionClient";
import { ScheduleComponents } from "@/app/setlist/[setListId]/update/ScheduleComponents";
import { addScheduleTemplate } from "./addScheduleTemplateAction";
import { updateScheduleTemplate } from "./updateScheduleTemplate";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, TauthSchema } from "@/utils/types/auth";
export default function EventScheduleTemplate() {
  const { userData, setUserData } = useUserStore();
  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<scheduleTemplate>({
    resolver: zodResolver(scheduleTemplateSchema),
  });

  const date = new Date();
  const todaysDate = date.toISOString().split("T")[0];
  function parseSetlistDate(dateString?: string): DateValue {
    return parseDate((dateString || todaysDate).split("T")[0]);
  }

  const [schedule, setSchedule] = useState<setListSongT[]>([]);
  const page = "create";

  const container = useRef(null);

  const [alreadySubmitting, setAlreadySubmitting] = useState<boolean>(false);

  const addItemToSetlist = (item: string) => {
    setSchedule([
      ...schedule,
      {
        id: crypto.randomUUID(),
        type: item,
      },
    ]);
  };

  const removeItemFromSchedule = (id: string) => {
    setSchedule(schedule.filter((section) => section.id !== id));
  };

  const updateNotesSection = (text: string, section: number) => {
    setSchedule((prevState) => {
      const index = prevState.findIndex((s, index) => index === section);
      const newSong = {
        note: text,
      };
      if (index === -1) return prevState; // No match found, return original state

      const updatedState = [...prevState]; // Create a new array (immutability)
      updatedState[index] = { ...updatedState[index], ...newSong }; // Update only the found section

      return updatedState; // Set the new state
    });
  };

  const convertData = async () => {
    if (alreadySubmitting) return;
    setAlreadySubmitting(true);
    const watchAllFields = watch();

    const updatedSetlist: scheduleTemplate = {
      id: crypto.randomUUID(),
      name: watchAllFields.name,
      schedule: schedule,
    };
    console.log("updatedSetlist", updatedSetlist);
    if (page === "create") {
      await addScheduleTemplate(updatedSetlist);
    } else if (page === "update") {
      // await updateScheduleTemplate(updatedSetlist, setlistData);
    }
  };
  const options: CDropdownOption[] = [
    {
      label: (
        <div className="flex items-center gap-2 cursor-pointer hover:text-blue-500 transition duration-200">
          <MdOutlineTitle />
          Titolo
        </div>
      ),
      value: "title",
    },
    {
      label: (
        <div className="flex items-center gap-2 cursor-pointer hover:text-blue-500 transition duration-200">
          <TbMusicPlus />
          Canzone
        </div>
      ),
      value: "song",
    },
    {
      label: (
        <div className="flex items-center gap-2 cursor-pointer hover:text-blue-500 transition duration-200">
          <MdEditNote />
          Nota
        </div>
      ),
      value: "note",
    },
  ];

  return (
    <div className="container-sub">
      <I18nProvider locale="it-IT-u-ca-gregory">
        <div className=" crea-setlist-container">
          <form
            onSubmit={(e) => {
              e.preventDefault(); // prevent page reload
              convertData(); // your custom logic
            }}
          >
            <div className="flex items-center">
              <div className="flex items-center gap-2">
                <h3>
                  {page === "create" && "Crea"}
                  {page === "update" && "Aggiorna"} Evento
                </h3>
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Nome template
              </label>
              <input
                {...register("name")}
                required
                type="text"
                id="name"
                name="name"
                placeholder="Serata Giovani..."
                minLength={4}
                className="cinput"
              />
              <div className="flex flex-row items-center justify-start gap-2 mt-4">
                <h3 className="w-[120px]">Scaletta</h3>
                <CDropdown
                  placeholder={
                    <>
                      <FaPlus />
                    </>
                  }
                  positionOnMobile="center"
                  buttonPadding="sm"
                  isIconOnly={true}
                  options={options}
                  onSelect={(option) => {
                    const value = option.value as "title" | "song" | "note";
                    addItemToSetlist(value);
                  }}
                />
              </div>

              {schedule.length > 0 && (
                <div className="ncard-responsive nborder-responsive ">
                  <Reorder.Group
                    values={schedule.map((s) => s.id)}
                    onReorder={(newOrderIds) => {
                      const reordered = newOrderIds.map((id) =>
                        schedule.find((s) => s.id === id)
                      );
                      setSchedule(reordered as setListSongT[]);
                    }}
                    ref={container}
                  >
                    {schedule.map((section, index) => {
                      return (
                        <ScheduleComponents
                          setSchedule={setSchedule}
                          key={section.id} // <-- Add this!
                          removeItemFromSchedule={removeItemFromSchedule}
                          section={section}
                          index={index}
                          source="template"
                          songsList={null}
                          container={container}
                          worshipTeams={null} // 👈 pass only is_worship === true teams
                          updateNotesSection={updateNotesSection}
                        />
                      );
                    })}
                  </Reorder.Group>
                </div>
              )}
            </div>
            <button
              type="submit"
              className={`button-style w-full ${alreadySubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={alreadySubmitting}
            >
              {alreadySubmitting ? (
                <div
                  className="h-6 mx-auto w-6 animate-spin rounded-full border-4 border-black border-t-gray-200"
                  aria-label="Loading..."
                />
              ) : (
                <> {page === "create" ? "Crea" : "Aggiorna"} Evento</>
              )}
            </button>
          </form>
        </div>
      </I18nProvider>
    </div>
  );
}
