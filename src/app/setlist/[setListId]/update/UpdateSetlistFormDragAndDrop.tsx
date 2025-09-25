"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  TimeInput,
  Spinner,
} from "@heroui/react";

import { I18nProvider } from "@react-aria/i18n";
import {
  DateValue,
  parseTime,
  getLocalTimeZone,
  today,
} from "@internationalized/date";
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
import { HeaderCL } from "@/app/components/header-comp";
import { LuCalendarRange } from "react-icons/lu";
import DateRangePicker from "@/app/components/DataRangePicker";
import { useSetlistsStore } from "@/store/useSetlistsStore";
export default function UpdateSetlistForm({
  setTeams,
  teams,
  churchTeams,
  page,
  songsList,
  setlistData,
  canEditEventData = false,
  setSetlistData,
  schedule,
  setSchedule,
  oldData,
}: {
  oldData?: setListT;
  page: string;
  songsList: TsongNameAuthor[];
  canEditEventData?: boolean;
  churchTeams: teamData[] | null;

  setlistData: setListT;
  setSetlistData: React.Dispatch<React.SetStateAction<setListT>>;

  teams: teamData[] | null;
  setTeams: React.Dispatch<React.SetStateAction<teamData[] | null>>;

  schedule: setListSongT[] | null;
  setSchedule: React.Dispatch<React.SetStateAction<setListSongT[] | null>>;
}) {
  // GET STORES
  const { userData, setUserData, fetchNotifications } = useUserStore();
  const { eventTypes, rooms, scheduleTemplates, fetchChurchScheduleTemplates } =
    useChurchStore();
  const { fetchSetlists } = useSetlistsStore();

  //DECLARE HOOKS AND STATES

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const router = useRouter();

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

  // const [teamsState, setTeamsState] = useState<teamData[]>(
  //   (teams || []).filter((team) => team.selected.length > 0)
  // );

  const container = useRef(null);

  const [alreadySubmitting, setAlreadySubmitting] = useState<boolean>(false);
  useEffect(() => {
    fetchChurchScheduleTemplates(userData.church_id);
    if (setlistData) {
      getSetlistTeamLeadBySetlistAndUserId(userData.id, setlistData.id).then(
        (lead: { team_id: string; role: string }[]) => {
          if (lead?.length >= 1)
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
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<formValues>({
    defaultValues: {
      hour: setlistData?.hour || "20:00",
      event_type: setlistData?.event_type || "",
      eventDate: setlistData?.date
        ? setlistData.date.split("T")[0] // just the "YYYY-MM-DD" string
        : today(getLocalTimeZone()).toString(),
    },
  });

  const addTeam = (id: string) => {
    if (teams.some((t) => t.id === id)) return;
    const found = churchTeams.find((t) => t.id === id);
    if (found) setTeams((prev) => [...prev, { ...found, selected: [] }]);
  };

  const optionsTurnazioni: CDropdownOption[] = useMemo(() => {
    if (!churchTeams) return [];
    if (!teams) {
      return churchTeams.map((team) => ({
        label: (
          <div className="flex items-center gap-2 cursor-pointer hover:text-blue-500 transition duration-200">
            {team.team_name}
          </div>
        ),
        value: team.id,
      }));
    }

    return churchTeams
      .filter((team) => !teams.some((t) => t.id === team.id))
      .map((team) => ({
        label: (
          <div className="flex items-center gap-2 cursor-pointer hover:text-blue-500 transition duration-200">
            {team.team_name}
          </div>
        ),
        value: team.id,
      }));
  }, [churchTeams, teams, userData]);

  const addMemberToTeam = (member: churchMembersT, teamId: string) => {
    setTeams((prevTeams) =>
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
    setTeams((prevTeams) =>
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
    setTeams((prevTeams) =>
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
      ...(schedule ?? []),
      {
        id: crypto.randomUUID(),
        type: item,
      },
    ]);
  };

  const addScheduleItems = (items: Omit<setListSongT, "id" | "order">[]) => {
    setSchedule([
      ...(schedule ?? []),
      ...items.map(
        (item, index): setListSongT => ({
          ...item,
          id: crypto.randomUUID(),
          order: (schedule?.length ?? 0) + index,
        })
      ),
    ]);
  };

  const removeItemFromSchedule = (id: string) => {
    setSchedule(schedule.filter((section) => section.id !== id));
  };

  const updateNotesSection = (text: string, section: number) => {
    setSchedule(
      schedule.map((item, idx) =>
        idx === section ? { ...item, note: text } : item
      )
    );
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
        !setlistData.room
      ) {
        const missingFields = [];
        if (!watchAllFields.eventDate) missingFields.push("Event Date");
        if (!watchAllFields.event_type) missingFields.push("Event Type");
        if (!setlistData.room) missingFields.push("Room");

        const errorMessage = `Missing required fields: ${missingFields.join(", ")}. Please complete the form.`;

        console.error("❌ Data Validation Error:", errorMessage);
        throw new Error(errorMessage);
      }
      const condensedTeams = teams?.map((team) => {
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
        room: setlistData.room,
        teams: condensedTeams,
        schedule: schedule,
        hour: watchAllFields.hour,
      };
      // Measure size in bytes
      setAlreadySubmitting(false);
      console.log("updatedSetlist", updatedSetlist);
      let result;
      if (page === "create") {
        result = await addSetlist(updatedSetlist);
      } else if (page === "update") {
        console.log("Old Setlist Data:", oldData);
        console.log("New Setlist Data:", updatedSetlist);
        result = await updateSetlist(updatedSetlist, oldData);
      } else {
        throw new Error("Invalid page mode: 'create' or 'update' expected.");
      }

      // --- Step 3: Handle the server response more clearly ---
      if (!result) {
        throw new Error("The server did not return a valid response.");
      }

      if (result.success) {
        console.log("✅ Operation successful:", result.message);
        fetchSetlists(setlistData.id);
        fetchNotifications(userData.id);

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
        },
      });
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
      <HeaderCL
        icon={LuCalendarRange}
        title={` ${page === "create" ? "Crea" : ""}
                  ${page === "update" ? "Aggiorna" : ""} Evento`}
      />
      <I18nProvider locale="it-IT-u-ca-gregory">
        <div className=" crea-setlist-container">
          <form onSubmit={handleSubmit(convertData)}>
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
                        defaultValue={setlistData?.room || ""}
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
                              setSetlistData({
                                ...setlistData,
                                room: selectedId.toString(),
                              });
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
                    <DateRangePicker
                      startDate={
                        eventDate
                          ? new Date(
                              eventDate.year,
                              eventDate.month - 1,
                              eventDate.day
                            )
                          : null
                      }
                      endDate={
                        eventDate
                          ? new Date(
                              eventDate.year,
                              eventDate.month - 1,
                              eventDate.day
                            )
                          : null
                      }
                      minDate={new Date()}
                      mode="single"
                      onChange={(range) => {
                        setEventDate(
                          parseDate(
                            `${range.start.getFullYear()}-${String(range.start.getMonth() + 1).padStart(2, "0")}-${String(range.start.getDate()).padStart(2, "0")}`
                          )
                        );
                        setValue(
                          "eventDate",
                          range.start
                            ? `${range.start.getFullYear()}-${String(
                                range.start.getMonth() + 1
                              ).padStart(2, "0")}-${String(
                                range.start.getDate()
                              ).padStart(2, "0")}`
                            : ""
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
                {!schedule && <Spinner size="sm" />}
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
                {scheduleTemplateOptions.length >= 2 &&
                  schedule?.length < 3 && (
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

              {schedule && (
                <div className="">
                  <Reorder.Group
                    values={schedule.map((s) => s.id)}
                    onReorder={(newOrderIds) => {
                      const reordered = newOrderIds.map((id) =>
                        schedule.find((s) => s.id === id)
                      );
                      setSetlistData(reordered as setListT);
                    }}
                    ref={container}
                  >
                    {schedule.map((section, index) => {
                      return (
                        <ScheduleComponents
                          schedule={schedule}
                          setSchedule={setSchedule}
                          source="setlist"
                          key={section.id} // <-- Add this!
                          removeItemFromSchedule={removeItemFromSchedule}
                          section={section}
                          index={index}
                          songsList={songsList}
                          container={container}
                          worshipTeams={teams?.filter(
                            (team) => team.is_worship
                          )}
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
                {(!churchTeams || !teams) && <Spinner size="sm" />}

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
                {teams &&
                  teams.map((section) => {
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
                                teamMembers={
                                  section.team_members ||
                                  churchTeams?.find(
                                    (team) => team.id === section.id
                                  ).team_members
                                }
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
                                                  setTeams((prev) =>
                                                    prev.map((team) => {
                                                      if (
                                                        team.id !== section.id
                                                      )
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
                                                                    lead: e
                                                                      .target
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
