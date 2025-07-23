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
  CalendarDate,
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
import {
  Button,
  Select,
  SelectItem,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Tooltip,
} from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useMemo, useRef, useState } from "react";
import { TsongNameAuthor, formValues } from "@/utils/types/types";
import { addSetlist } from "../../addSetlist/addSetlistAction";
import { updateSetlist } from "./updateSetlist";
import { SelectWorshipTeamMemberDrawer } from "@/app/protected/teams/SelectWorshipTeamMemberDrawer";
import { RiDeleteBinLine } from "react-icons/ri";
import { AnimatePresence, motion, Reorder } from "framer-motion";
import { FaPlus, FaRegCalendarAlt } from "react-icons/fa";
import { ScheduleComponents } from "./ScheduleComponents";
import { useChurchStore } from "@/store/useChurchStore";
import { MdEditNote, MdOutlineTitle } from "react-icons/md";
import { TbClockHour2, TbMusicPlus } from "react-icons/tb";
import BlockoutsCalendarComponent from "@/app/protected/blockouts-calendar/calendarComponent";
import { useUserStore } from "@/store/useUserStore";
import CDropdown, { CDropdownOption } from "@/app/components/CDropdown";
export default function UpdateSetlistForm({
  teams,
  page,
  songsList,
  setlistData,
}: {
  teams: teamData[] | null;
  page: string;
  songsList: TsongNameAuthor[];
  setlistData: setListT;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedRoom, setSelectedRoom] = useState<string | null>(
    setlistData?.room ?? null
  );
  const { userData } = useUserStore();

  const { eventTypes, rooms } = useChurchStore();
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

  const [state, setState] = useState<setListSongT[]>(
    setlistData?.setListSongs || []
  );
  const [schedule, setSchedule] = useState<setListSongT[]>(
    setlistData?.schedule || []
  );
  const [eventColor, setEventColor] = useState<string>(
    setlistData?.color || "#fe564b"
  );
  const [teamsState, setTeamsState] = useState<teamData[]>(
    (teams || []).filter((team) => team.selected.length > 0)
  );
  const [team, setTeam] = useState<churchMembersT[]>([]);
  const [showBlockoutsCalendar, setShowBlockoutsCalendar] =
    useState<boolean>(false);
  const [eventDetails, setEventDetails] = useState<setListT>(setlistData);
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
  useEffect(() => {
    setEventDetails(setlistData);
  }, [setlistData]);
  const [alreadySubmitting, setAlreadySubmitting] = useState<boolean>(false);

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
          console.log(team.id, " ", teamId, " are matvhing!");
          return {
            ...team,
            selected: team.selected?.some((m) => m.id === member.id)
              ? team.selected
              : [...(team.selected || []), member],
          };
        } else {
          console.log(team.id, " ", teamId, " are NOT matvhing!");

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

  const removeItemFromSchedule = (id: string) => {
    setSchedule(schedule.filter((section) => section.id !== id));
  };
  const updateKey = (index: number, value: string) => {
    setSchedule((prevState) => {
      // Update the object at the given index
      return prevState.map((item, idx) => {
        if (idx === index) {
          return { ...item, key: value }; // Update the key field of the matched object
        }
        return item; // Return the rest of the items unchanged
      });
    });
  };

  const updateTitleSection = (text: string, section: number) => {
    setSchedule((prevState) => {
      const index = prevState.findIndex((s, index) => index === section);
      const newSong = {
        title: text,
      };
      if (index === -1) return prevState; // No match found, return original state

      const updatedState = [...prevState]; // Create a new array (immutability)
      updatedState[index] = { ...updatedState[index], ...newSong }; // Update only the found section

      return updatedState; // Set the new state
    });
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

  const updateSongtoSetlist = (song: setListSongT, section: number) => {
    setSchedule((prevState) => {
      const index = prevState.findIndex((s, index) => index === section);
      const newSong = {
        song: song.id,
        song_title: song.song_title,
        author: song.author,
        key: "A",
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
    console.log("AlreadySubmitting", alreadySubmitting);

    const newTeam: any = [];
    team.map((member) => {
      newTeam.push({ profile: member.profile });
    });
    console.log("team");
    console.log(teamsState);
    const watchAllFields = watch(); // when pass nothing as argument, you are watching everything
    const updatedSetlist: setListT = {
      id: setlistData?.id || crypto.randomUUID(),
      event_type: watchAllFields.event_type,
      date: watchAllFields.eventDate.toString(),
      private: watchAllFields.private,
      room: selectedRoom,
      setListSongs: state,
      teams: teamsState,
      color: eventColor,
      schedule: schedule,
      hour: watchAllFields.hour,
    };
    console.log("updatedSetlist");
    console.log(updatedSetlist);
    if (page === "create") {
      await addSetlist(updatedSetlist);
    } else if (page === "update") {
      await updateSetlist(updatedSetlist, setlistData);
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
  const optionsTurnazioni: CDropdownOption[] = useMemo(() => {
    return teams
      .filter(
        (team) =>
          userData.leaderOf.includes(team.id) &&
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
    console.log("eventDetails:", eventDetails);
    console.log("eventDetails?.teams:", eventDetails?.teams);
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
                <h4>
                  {page === "create" && "Crea"}
                  {page === "update" && "Aggiorna"} Evento
                </h4>
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-8">
              {/* EVENT TYPE */}
              <div className="gap-1.5">
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
              </div>

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
            <div>
              <div className="flex flex-row items-center justify-start gap-2 mt-4">
                <h5>Scaletta</h5>
                <CDropdown
                  placeholder={
                    <>
                      <FaPlus />
                    </>
                  }
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
                          key={section.id} // <-- Add this!
                          updateSongtoSetlist={updateSongtoSetlist}
                          removeItemFromSchedule={removeItemFromSchedule}
                          section={section}
                          index={index}
                          songsList={songsList}
                          updateKey={updateKey}
                          container={container}
                          updateTitleSection={updateTitleSection}
                          updateNotesSection={updateNotesSection}
                        />
                      );
                    })}
                  </Reorder.Group>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2 [&>input]:mb-3 mt-4">
              <div className="flex flex-row justify-start gap-3 items-center">
                <h5>Turnazioni</h5>
                <Tooltip
                  className="text-sm"
                  content="Mostra calendario con date bloccate."
                >
                  <Button isIconOnly className="ml-0" onPress={onOpen}>
                    <FaRegCalendarAlt />
                  </Button>
                </Tooltip>
              </div>

              {optionsTurnazioni.length > 0 && (
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

              <AnimatePresence>
                {teamsState.map((section) => (
                  <div key={section.id} className="mt-4">
                    <div className="flex flex-row flex-wrap items-center gap-3 my-2.5">
                      <h4 className="font-medium">{section.team_name}</h4>
                      <SelectWorshipTeamMemberDrawer
                        state={section.selected}
                        type="add"
                        teamMembers={section.team_members}
                        addMemberToTeam={addMemberToTeam} // Pass function correctly
                        section={null}
                        teamId={section.id}
                        date={eventDate}
                      />
                    </div>
                    {section.selected?.length >= 1 && (
                      <table className="w-full text-left border border-gray-200 rounded-md overflow-hidden text-sm atable">
                        <thead className="bg-gray-50">
                          <tr>
                            <th> Nome</th>
                            <th> Ruolo</th>
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

                            return (
                              <tr key={index}>
                                <td>
                                  {member.name} {member.lastname}{" "}
                                  {isUnavailable && (
                                    <span className="text-xs text-red-500 font-semibold ml-2">
                                      Non disponibile
                                    </span>
                                  )}
                                </td>
                                <td>
                                  {roles.length >= 1 && (
                                    <select
                                      className="aselect"
                                      defaultValue={
                                        roles.includes(member.selected_roles)
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
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                ))}
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
