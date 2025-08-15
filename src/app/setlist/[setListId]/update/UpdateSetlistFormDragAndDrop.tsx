"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  TimeInput,
  user,
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
  setListSongT,
  setListT,
  teamData,
} from "@/utils/types/types";
import { Button, Select, SelectItem, Tooltip } from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useMemo, useRef, useState } from "react";
import { TsongNameAuthor, formValues } from "@/utils/types/types";
import { addSetlist } from "../../addSetlist/addSetlistAction";
import { updateSetlist } from "./updateSetlist";
import { SelectWorshipTeamMemberDrawer } from "@/app/protected/teams/SelectWorshipTeamMemberDrawer";
import { RiDeleteBinLine } from "react-icons/ri";
import { AnimatePresence, motion, Reorder } from "framer-motion";
import { FaArrowDown, FaPlus, FaRegCalendarAlt } from "react-icons/fa";
import { ScheduleComponents } from "./ScheduleComponents";
import { useChurchStore } from "@/store/useChurchStore";
import { MdEditNote, MdOutlineTitle } from "react-icons/md";
import { TbClockHour2, TbMusicPlus } from "react-icons/tb";
import BlockoutsCalendarComponent from "@/app/protected/blockouts-calendar/calendarComponent";
import { useUserStore } from "@/store/useUserStore";
import CDropdown, { CDropdownOption } from "@/app/components/CDropdown";
import { getSetlistTeamLeadBySetlistAndUserId } from "@/hooks/GET/getSetlistTeamLeadBySetlistAndUserId";
import { useRouter } from "next/navigation";
import { logEventClient } from "@/utils/supabase/logClient";
export default function UpdateSetlistForm({
  teams,
  page,
  songsList,
  setlistData,
  canEditEventData = false,
}: {
  teams: teamData[] | null;
  page: string;
  songsList: TsongNameAuthor[];
  setlistData: setListT;
  canEditEventData?: boolean;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedRoom, setSelectedRoom] = useState<string | null>(
    setlistData?.room ?? null
  );
  const router = useRouter();

  const { userData, setUserData } = useUserStore();

  const { eventTypes, rooms, scheduleTemplates, fetchChurchScheduleTemplates } =
    useChurchStore();
  const [churchRooms, setChurchRooms] = useState<roomsType[]>([]);
  const date = new Date();
  const todaysDate = date.toISOString().split("T")[0];
  function parseSetlistDate(dateString?: string): DateValue {
    return parseDate((dateString || todaysDate).split("T")[0]);
  }
  const [eventDate, setEventDate] = useState<DateValue>(() =>
    parseSetlistDate(setlistData?.date)
  );

  useEffect(() => {
    if (rooms) {
      setChurchRooms(rooms);
    }
  }, [rooms]);
  const [schedule, setSchedule] = useState<setListSongT[]>(
    setlistData?.schedule || []
  );

  const [teamsState, setTeamsState] = useState<teamData[]>(
    (teams || []).filter((team) => team.selected.length > 0)
  );

  const [previousEventDate, setPreviousEventDate] = useState<DateValue | null>(
    () => {
      if (setlistData?.date) {
        return parseDate(setlistData.date.split("T")[0]); // "2025-07-09"
      }
      return parseDate(todaysDate);
    }
  );
  const [pendingDate, setPendingDate] = useState<DateValue | null>(() => {
    if (setlistData?.date) {
      return parseDate(setlistData.date.split("T")[0]); // "2025-07-09"
    }
    return parseDate(todaysDate);
  });
  const container = useRef(null);

  const [alreadySubmitting, setAlreadySubmitting] = useState<boolean>(false);
  useEffect(() => {
    fetchChurchScheduleTemplates(userData.church_id);
    if (setlistData) {
      getSetlistTeamLeadBySetlistAndUserId(userData.id, setlistData.id).then(
        (lead: { team_id: string; role: string }[]) => {
          if (lead.length >= 1)
            setUserData({
              ...userData,
              teams: [...userData.teams, ...lead], // ✅ creates a new array reference
            });
        }
      );
    }
  }, []);
  const {
    handleSubmit,
    register,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<formValues>({
    defaultValues: {
      hour: setlistData?.hour || "20:00",
      event_type: setlistData?.event_type || "",
      eventDate: setlistData?.date
        ? setlistData.date.split("T")[0] // just the "YYYY-MM-DD" string
        : "",
    },
  });
  const addTeam = (id: string) => {
    if (teamsState.some((t) => t.id === id)) return;
    const found = teams.find((t) => t.id === id);
    if (found) setTeamsState((prev) => [...prev, found]);
  };

  const getUnavailableMembers = (newDate: string, teams: teamData[]) => {
    return teams.flatMap((team) =>
      team.selected.filter((member) =>
        member.blockouts?.some(
          (blockout) => newDate >= blockout.start && newDate <= blockout.end
        )
      )
    );
  };

  const addMemberToTeam = (member: churchMembersT, teamId: string) => {
    setTeamsState((prevTeams) =>
      prevTeams.map((team) => {
        if (team.id === teamId) {
          return {
            ...team,
            selected: team.selected?.some((m) => m.id === member.id)
              ? team.selected
              : [...(team.selected || []), member],
          };
        } else {
          return team;
        }
      })
    );
  };

  const removeMemberToTeam = (profile: string, teamId: string) => {
    setTeamsState((prevTeams) =>
      prevTeams.map((team) =>
        team.id === teamId
          ? {
              ...team,
              selected: team.selected.filter(
                (member) => member.profile !== profile
              ),
            }
          : team
      )
    );
  };

  const addRoleToMemberTeam = (
    profile: string,
    teamId: string,
    selectedRole: string
  ) => {
    setTeamsState((prevTeams) =>
      prevTeams.map((team) => {
        if (team.id !== teamId) return team;

        return {
          ...team,
          selected: team.selected.map((member) =>
            member.profile === profile
              ? { ...member, selected_roles: selectedRole } // Or use 'selectedRole' key if you want to store it separately
              : member
          ),
        };
      })
    );
  };

  const addItemToSetlist = (item: string) => {
    setSchedule([
      ...schedule,
      {
        id: crypto.randomUUID(),
        type: item,
      },
    ]);
  };

  const addScheduleItems = (items: Omit<setListSongT, "id" | "order">[]) => {
    setSchedule((prev) => {
      const startingOrder = prev.length;
      const newItems: setListSongT[] = items.map((item, index) => ({
        ...item,
        id: crypto.randomUUID(),
        order: startingOrder + index,
      }));
      return [...prev, ...newItems];
    });
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
    try {
      if (alreadySubmitting) return;
      setAlreadySubmitting(true);
      const watchAllFields = watch();

      // --- Step 1: Validate essential fields before proceeding ---
      if (
        !watchAllFields.eventDate ||
        !watchAllFields.event_type ||
        !selectedRoom
      ) {
        const missingFields = [];
        if (!watchAllFields.eventDate) missingFields.push("Event Date");
        if (!watchAllFields.event_type) missingFields.push("Event Type");
        if (!selectedRoom) missingFields.push("Room");

        const errorMessage = `Missing required fields: ${missingFields.join(", ")}. Please complete the form.`;

        console.error("❌ Data Validation Error:", errorMessage);
        throw new Error(errorMessage);
      }
      const condensedTeams = teamsState.map((team) => {
        return {
          id: team.id,
          is_worship: team.is_worship,
          selected: team.selected,
          team_name: team.team_name,
        };
      });
      // --- Step 2: Construct the updatedSetlist object with defensive checks ---
      const updatedSetlist: setListT = {
        id: setlistData?.id || crypto.randomUUID(),
        event_type: watchAllFields.event_type,
        date: watchAllFields.eventDate.toString(), // Ensure this conversion is robust
        private: watchAllFields.private,
        room: selectedRoom,
        teams: condensedTeams,
        schedule: schedule,
        hour: watchAllFields.hour,
      };
      const jsonStr = JSON.stringify(updatedSetlist);

      // Measure size in bytes
      const sizeInBytes = new TextEncoder().encode(jsonStr).length;
      console.log("Object size in bytes:", sizeInBytes);

      console.log("Sending new Data", updatedSetlist);

      let result;
      if (page === "create") {
        result = await addSetlist(updatedSetlist);
      } else if (page === "update") {
        result = await updateSetlist(updatedSetlist, setlistData);
      } else {
        throw new Error("Invalid page mode: 'create' or 'update' expected.");
      }

      // --- Step 3: Handle the server response more clearly ---
      if (!result) {
        throw new Error("The server did not return a valid response.");
      }

      if (result.success) {
        console.log("✅ Operation successful:", result.message);
        router.push(`/setlist/${updatedSetlist.id}`);
      } else {
        console.error("❌ Operation failed:", result);
        console.error("Errors:", result.errors);

        // Log specific server-side errors for debugging
        result.errors.forEach((error, index) => {
          console.error(
            `Error ${index + 1} [${error.operation}]:`,
            error.message
          );
          if (error.details) {
            console.error("Details:", error.details);
          }
        });
        // You can add a user-facing toast or notification here with result.message
      }
    } catch (error: any) {
      console.error("🔥 Unexpected error in convertData:", error);

      // Log a specific client-side error event
      await logEventClient({
        event: "update_setlist_data_error",
        level: "error",
        meta: {
          function: "convertData",
          user_id: userData.id, // Pass the user_id if you have it available on the client

          message:
            error.message ||
            "An unknown error occurred during form submission.",

          stack: error.stack,
          error: error,
          // Add any other relevant client-side data
        },
      });

      // You can also display a user-facing error message here
      // e.g., showToast(error.message);
    } finally {
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

  const scheduleTemplateOptions: CDropdownOption[] = useMemo(() => {
    const customOption: CDropdownOption = {
      label: (
        <div className="flex items-center gap-2 cursor-pointer text-gray-500 italic">
          Importa Template
        </div>
      ),
      value: null,
    };

    const templateOptions = scheduleTemplates.map((team) => ({
      label: (
        <div className="flex items-center gap-2 cursor-pointer hover:text-blue-500 transition duration-200">
          {team.name}
        </div>
      ),
      value: team.id,
    }));

    return [customOption, ...templateOptions];
  }, [scheduleTemplates]);

  const optionsTurnazioni: CDropdownOption[] = useMemo(() => {
    // if(teams?.length>=1)
    return teams
      ?.filter(
        (team) =>
          userData.teams
            .filter(
              (team) => team.role === "leader" || userData.role === "admin"
            )
            .some((item) => item.team_id === team.id) &&
          !teamsState.some((el) => el.team_name === team.team_name)
      )
      .map((team) => ({
        label: (
          <div className="flex items-center gap-2 cursor-pointer hover:text-blue-500 transition duration-200">
            {team.team_name}
          </div>
        ),
        value: team.id,
      }));
  }, [teams, teamsState, userData]);

  //date modal change
  const [isDateConflictModalOpen, setIsDateConflictModalOpen] = useState(false);
  const [conflictedMembers, setConflictedMembers] = useState<churchMembersT[]>(
    []
  );

  const getRolesFromTeamMembers = (
    sectionId: string,
    memberProfile: string | undefined
  ): string[] | undefined => {
    if (!teams) return undefined;

    const team = teams.find((t) => t.id === sectionId);
    if (!team || !team.team_members) return undefined;

    const teamMember = team.team_members.find(
      (tm) => tm.profile === memberProfile
    );

    return teamMember?.roles;
  };

  return (
    <div className="container-sub">
      <I18nProvider locale="it-IT-u-ca-gregory">
        <div className=" crea-setlist-container">
          <form onSubmit={handleSubmit(convertData)}>
            <div className="flex items-center">
              <div className="flex items-center gap-2">
                <h3>
                  {page === "create" && "Crea"}
                  {page === "update" && "Aggiorna"} Evento
                </h3>
              </div>
            </div>
            {canEditEventData ? (
              <>
                <div className="flex flex-col gap-2 mt-8">
                  {/* EVENT TYPE */}
                  <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                    <Controller
                      name="event_type"
                      control={control}
                      rules={{ required: "Tipo evento obbligatorio" }}
                      defaultValue={setlistData?.event_type || ""}
                      render={({ field, fieldState }) => (
                        <>
                          <Select
                            {...field}
                            fullWidth
                            items={eventTypes}
                            label="Tipo di evento"
                            size="sm"
                            variant="underlined"
                            placeholder="Seleziona il tipo di evento"
                            selectedKeys={
                              field.value ? new Set([field.value]) : new Set()
                            }
                            onSelectionChange={(keys) => {
                              const value = Array.from(keys)[0] || "";
                              field.onChange(value);
                            }}
                            isInvalid={!!fieldState.error}
                            errorMessage={fieldState.error?.message}
                          >
                            {(type) => (
                              <SelectItem key={type.key}>
                                {type.alt ? type.alt : type.label}
                              </SelectItem>
                            )}
                          </Select>
                        </>
                      )}
                    />

                    {churchRooms && churchRooms.length === 1 ? (
                      <p>
                        Location:{" "}
                        <span className="font-medium">
                          {churchRooms[0].name} - {churchRooms[0].address},{" "}
                          {churchRooms[0].comune}
                        </span>
                      </p>
                    ) : (
                      <Controller
                        name="room_id" // define this in your formValues
                        control={control}
                        rules={{ required: "Devi selezionare una location" }}
                        defaultValue={selectedRoom || ""}
                        render={({ field, fieldState }) => (
                          <Select
                            label="Seleziona la Location"
                            variant="underlined"
                            size="sm"
                            placeholder="Scegli una stanza"
                            selectedKeys={
                              field.value ? new Set([field.value]) : new Set()
                            }
                            onSelectionChange={(keys) => {
                              const selectedId = Array.from(keys)[0] || "";
                              field.onChange(selectedId);
                              setSelectedRoom(String(selectedId));
                            }}
                            isInvalid={!!fieldState.error}
                            errorMessage={fieldState.error?.message}
                          >
                            {churchRooms.map((room) => (
                              <SelectItem key={room.id} textValue={room.name}>
                                <div>
                                  <p className="font-regular">{room.name}</p>
                                  {room.address && (
                                    <small className="text-default-500">
                                      {room.address}, {room.comune}
                                    </small>
                                  )}
                                </div>
                              </SelectItem>
                            ))}
                          </Select>
                        )}
                      />
                    )}
                  </div>

                  {/* HOUR + DATE */}
                  <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                    {/* HOUR */}
                    <Controller
                      name="hour"
                      control={control}
                      rules={{ required: "Ora obbligatoria" }}
                      render={({ field }) => {
                        const timeValue = parseTime(field.value);
                        return (
                          <TimeInput
                            size="sm"
                            label="Ora"
                            variant="underlined"
                            startContent={<TbClockHour2 />}
                            value={timeValue}
                            onChange={(newTime) => {
                              const hourStr = newTime.toString();
                              field.onChange(hourStr);
                            }}
                            isInvalid={!!errors.hour}
                            errorMessage={errors.hour?.message}
                          />
                        );
                      }}
                    />

                    {/* DATE */}
                    <Controller
                      name="eventDate"
                      control={control}
                      rules={{ required: "Data obbligatoria" }}
                      render={({ field }) => {
                        // Convert string (field.value) to DateValue for DatePicker, or null if empty
                        const dateValue: DateValue | null = field.value
                          ? parseDate(field.value)
                          : null;

                        return (
                          <DatePicker
                            label="Data"
                            size="sm"
                            variant="underlined"
                            showMonthAndYearPickers
                            value={dateValue}
                            minValue={today(getLocalTimeZone())}
                            onChange={(newDate) => {
                              const newDateStr = newDate.toString(); // DateValue → "YYYY-MM-DD"

                              const unavailable = getUnavailableMembers(
                                newDateStr,
                                teamsState
                              );

                              if (unavailable.length > 0) {
                                setPreviousEventDate(dateValue);
                                setIsDateConflictModalOpen(true);
                                setPendingDate(newDate);
                              } else {
                                field.onChange(newDateStr);
                              }
                            }}
                            disableAnimation
                            isInvalid={!!errors.eventDate}
                            errorMessage={errors.eventDate?.message}
                          />
                        );
                      }}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col gap-2 mt-8">
                  {/* EVENT TYPE */}
                  <div className="gap-1.5 flex flex-col">
                    <p>
                      {" "}
                      <strong>Evento:</strong>{" "}
                      {
                        eventTypes.find(
                          (event) => event.key === setlistData?.event_type
                        )?.label
                      }
                    </p>
                    <p>
                      <strong>Stanza:</strong>{" "}
                      {
                        churchRooms?.find(
                          (room) => room.id === setlistData?.room
                        )?.name
                      }
                    </p>
                    <p className="capitalize">
                      <strong>Data:</strong>{" "}
                      {new Date("2025-07-20T00:00:00").toLocaleDateString(
                        "it-IT",
                        {
                          weekday: "long", // optional: e.g., Sunday
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>{" "}
                    <p>
                      <strong>Ora:</strong>{" "}
                      {setlistData?.hour && (
                        <>
                          {new Intl.DateTimeFormat("it-IT", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })?.format(
                            new Date(`1970-01-01T${setlistData?.hour}`)
                          )}
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </>
            )}

            <div>
              <div className="flex flex-row items-center justify-start gap-2 mt-4">
                <h3 className="w-[120px]">Scaletta</h3>
                <CDropdown
                  placeholder={
                    <>
                      {" "}
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
                {scheduleTemplateOptions.length >= 2 && schedule.length < 3 && (
                  <CDropdown
                    placeholder={
                      <>
                        <FaArrowDown />
                      </>
                    }
                    positionOnMobile="center"
                    buttonPadding="sm"
                    isIconOnly={true}
                    options={scheduleTemplateOptions}
                    onSelect={(option) => {
                      if (option.value) {
                        addScheduleItems(
                          scheduleTemplates.find((e) => e.id === option.value)
                            .schedule
                        );
                      }
                    }}
                  />
                )}
              </div>

              {schedule.length > 0 && (
                <div className="">
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
                          source="setlist"
                          key={section.id} // <-- Add this!
                          removeItemFromSchedule={removeItemFromSchedule}
                          section={section}
                          index={index}
                          songsList={songsList}
                          container={container}
                          worshipTeams={teamsState.filter(
                            (team) => team.is_worship
                          )} // 👈 pass only is_worship === true teams
                          updateNotesSection={updateNotesSection}
                        />
                      );
                    })}
                  </Reorder.Group>
                </div>
              )}
            </div>
            <div className="w-full border-b-1 my-4"></div>
            <div className="flex flex-col gap-2 [&>input]:mb-3 mt-4">
              <div className="flex flex-row justify-start gap-3 items-center">
                <h3 className="w-[120px]">Turnazioni</h3>
                <Tooltip
                  className="text-sm"
                  content="Mostra calendario con date bloccate."
                >
                  <Button
                    isIconOnly
                    className="ml-0"
                    radius="sm"
                    variant="light"
                    onPress={onOpen}
                  >
                    <FaRegCalendarAlt />
                  </Button>
                </Tooltip>
                {optionsTurnazioni?.length > 0 && (
                  <CDropdown
                    placeholder={
                      <>
                        <FaPlus />
                      </>
                    }
                    buttonPadding="sm"
                    isIconOnly={true}
                    options={optionsTurnazioni}
                    onSelect={(option) => {
                      addTeam(option.value);
                    }}
                  />
                )}
              </div>

              <AnimatePresence>
                {teamsState.map((section) => {
                  const canEdit =
                    userData.teams
                      .filter(
                        (team) =>
                          team.role === "leader" || team.role === "editor"
                      )
                      .some((item) => item.team_id === section.id) ||
                    userData.role === "churchadmin" ||
                    userData.role === "churchfounder";
                  return (
                    <div key={section.id} className="">
                      <>
                        <div className="flex flex-row flex-wrap items-center gap-3 my-2.5">
                          <h5 className="font-medium">{section.team_name}</h5>
                          {canEdit && (
                            <SelectWorshipTeamMemberDrawer
                              state={section.selected}
                              type="add"
                              teamMembers={section.team_members}
                              addMemberToTeam={addMemberToTeam} // Pass function correctly
                              section={null}
                              teamId={section.id}
                              date={
                                watch("eventDate")
                                  ? parseDate(watch("eventDate"))
                                  : today(getLocalTimeZone())
                              }
                            />
                          )}
                        </div>
                      </>

                      {section.selected?.length >= 1 && (
                        <>
                          {!section.selected?.some((member) => member.lead) &&
                            canEdit && (
                              <small className="mb-2 px-2 py-1 text-red-600">
                                Seleziona un leader per questo team.
                              </small>
                            )}
                          <table className="w-full text-left  rounded-mdtext-sm atable">
                            <thead className="bg-gray-50">
                              <tr>
                                <th>Nome</th>
                                <th>Ruolo</th>
                                <th className=" w-[40px]"></th>
                              </tr>
                            </thead>
                            <tbody>
                              {section.selected?.map((member, index) => {
                                const roles =
                                  getRolesFromTeamMembers(
                                    section.id,
                                    member.profile
                                  ) || [];

                                const isUnavailable =
                                  member.blockouts?.some((b) => {
                                    const start = new Date(b.start);
                                    const end = new Date(b.end);
                                    const target = new Date(
                                      eventDate.year,
                                      eventDate.month - 1,
                                      eventDate.day
                                    );
                                    return target >= start && target <= end;
                                  }) ?? false;
                                if (canEdit) {
                                  return (
                                    <tr key={index}>
                                      <td>
                                        <div className="flex items-center gap-2 flex-row">
                                          <div className="relative inline-block group">
                                            <input
                                              type="checkbox"
                                              className="accent-blue-600 w-4 h-4 rounded-sm border-gray-300"
                                              checked={!!member.lead} // force boolean: undefined → false
                                              onChange={(e) =>
                                                setTeamsState((prev) =>
                                                  prev.map((team) => {
                                                    if (team.id !== section.id)
                                                      return team;
                                                    return {
                                                      ...team,
                                                      selected:
                                                        team.selected.map(
                                                          (el) =>
                                                            el.profile ===
                                                            member.profile
                                                              ? {
                                                                  ...el,
                                                                  lead: e.target
                                                                    .checked,
                                                                }
                                                              : el
                                                        ),
                                                    };
                                                  })
                                                )
                                              }
                                            />
                                            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                                              Leader
                                            </div>
                                          </div>
                                          {member.name} {member.lastname}{" "}
                                          {isUnavailable && (
                                            <span className="text-xs text-red-500 font-semibold ml-2">
                                              Non disponibile
                                            </span>
                                          )}
                                        </div>
                                      </td>
                                      <td>
                                        {roles.length >= 1 && (
                                          <select
                                            className="aselect"
                                            defaultValue={
                                              roles.includes(
                                                member.selected_roles
                                              )
                                                ? member.selected_roles
                                                : ""
                                            }
                                            onChange={(e) =>
                                              addRoleToMemberTeam(
                                                member.profile,
                                                section.id,
                                                e.target.value
                                              )
                                            }
                                          >
                                            <option value="" disabled>
                                              Seleziona ruolo
                                            </option>
                                            {roles.map((role) => (
                                              <option key={role} value={role}>
                                                {role}
                                              </option>
                                            ))}
                                          </select>
                                        )}
                                      </td>
                                      <td>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            removeMemberToTeam(
                                              member.profile,
                                              section.id
                                            );
                                          }}
                                          className=" text-red-500 hover:text-red-700"
                                        >
                                          <RiDeleteBinLine size={18} />
                                        </button>
                                      </td>
                                    </tr>
                                  );
                                } else {
                                  return (
                                    <tr key={index}>
                                      <td>
                                        <div className="flex items-center gap-2 flex-row">
                                          {member.name} {member.lastname}{" "}
                                        </div>
                                      </td>
                                      <td>{member.selected_roles}</td>
                                      <td></td>
                                    </tr>
                                  );
                                }
                              })}
                            </tbody>
                          </table>
                        </>
                      )}
                    </div>
                  );
                })}
              </AnimatePresence>
            </div>

            <br />

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
        <Modal
          isOpen={isDateConflictModalOpen}
          onClose={() => setIsDateConflictModalOpen(false)}
        >
          <ModalContent>
            <ModalHeader>Membri non disponibili</ModalHeader>
            <ModalBody>
              <p>Alcuni membri non sono disponibili per la data selezionata:</p>
              <ul className="list-disc list-inside">
                {conflictedMembers.map((member) => (
                  <li key={member.id}>
                    {member.name} {member.lastname}
                  </li>
                ))}
              </ul>
              <p>
                Vuoi mantenere la data e rimuovere questi membri, o annullare la
                modifica?
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                onPress={() => {
                  setEventDate(pendingDate); // ❌ will cause "gg/mm/aaaa"
                  setIsDateConflictModalOpen(false);
                }}
              >
                Mantieni data nuova
              </Button>

              <Button
                onPress={() => {
                  setIsDateConflictModalOpen(false);
                  setEventDate(previousEventDate); // Restore previous valid date
                }}
              >
                Annulla
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          placement="center"
          size="4xl"
          className="max-h-[90vh]"
          scrollBehavior="inside"
          shouldBlockScroll
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Calendario
                </ModalHeader>
                <ModalBody>
                  <BlockoutsCalendarComponent />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="primary" onPress={onClose}>
                    Action
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </I18nProvider>
    </div>
  );
}
