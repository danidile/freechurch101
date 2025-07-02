"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Chip,
} from "@heroui/react";

import {
  ChipColor,
  ChurchMemberByTeam,
  churchMembersT,
  eventSchema,
  setListSongT,
  setListT,
  teamData,
} from "@/utils/types/types";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectItem,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Tooltip,
} from "@heroui/react";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { TwitterPicker, ColorResult } from "react-color";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useRef, useState } from "react";
import { TsongNameAuthor, formValues } from "@/utils/types/types";
import { addSetlist } from "../../addSetlist/addSetlistAction";
import { updateSetlist } from "./updateSetlist";
import { SelectWorshipTeamMemberDrawer } from "@/app/protected/teams/SelectWorshipTeamMemberDrawer";
import { RiDeleteBinLine } from "react-icons/ri";
import { AnimatePresence, motion, Reorder } from "framer-motion";
import { BiColorFill } from "react-icons/bi";
import colors from "@/utils/eventsColors";
import { FaPlus } from "react-icons/fa";
import { ScheduleComponents } from "./ScheduleComponents";
import { useChurchStore } from "@/store/useChurchStore";
import { MdEditNote, MdOutlineTitle } from "react-icons/md";
import { TbMusicPlus } from "react-icons/tb";
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
  const { eventTypes } = useChurchStore();

  const date = new Date();
  const todaysDate = date.toISOString().split("T")[0];
  const [eventDate, setEventDate] = useState<string>(
    setlistData?.date?.split("T")[0] || todaysDate
  );
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
  const [eventDetails, setEventDetails] = useState<setListT>(setlistData);
  const [previousEventDate, setPreviousEventDate] = useState<string>(
    setlistData?.date?.split("T")[0] || todaysDate
  );
  const [pendingDate, setPendingDate] = useState<string>(
    setlistData?.date?.split("T")[0] || todaysDate
  );
  const container = useRef(null);
  useEffect(() => {
    setEventDetails(setlistData);
  }, [setlistData]);
  const {
    handleSubmit,
    register,
    watch,
    formState: { isSubmitting },
  } = useForm<formValues>({
    resolver: zodResolver(eventSchema),
  });

  const addTeam = (id: string) => {
    setTeamsState([
      ...teamsState,
      teams[teams.findIndex((section) => section.id === id)],
    ]);
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

  const addSongtoSetlist = (song: setListSongT) => {
    setState([
      ...state,
      {
        id: crypto.randomUUID(),
        song: song.id,
        song_title: song.song_title,
        author: song.author,
        type: song.type,
        key: "A",
      },
    ]);
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

  const removeSection = (id: string) => {
    setState(state.filter((section) => section.id !== id));
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

  const convertData = async (data: formValues) => {
    console.log("schedule", schedule);

    console.log("teamsState", teamsState);

    console.log("teams", teams);
    const newTeam: any = [];
    team.map((member) => {
      newTeam.push({ profile: member.profile });
    });
    console.log("team");
    console.log(teamsState);
    const watchAllFields = watch(); // when pass nothing as argument, you are watching everything
    const updatedSetlist: setListT = {
      id: setlistData?.id || crypto.randomUUID(),
      event_title: watchAllFields.event_title,
      event_type: data.event_type,
      date: watchAllFields.date,
      private: data.private,
      setListSongs: state,
      teams: teamsState,
      color: eventColor,
      schedule: schedule,
    };
    console.log("updatedSetlist");
    console.log(updatedSetlist);
    if (page === "create") {
      addSetlist(updatedSetlist);
    } else if (page === "update") {
      updateSetlist(updatedSetlist, setlistData);
    }
  };

  const handleColorChange = (color: ColorResult) => {
    setEventColor(color.hex);
  };

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

  const renderCell = useCallback(
    (user: ChurchMemberByTeam, columnKey: React.Key) => {
      const cellValue = user[columnKey.toString() as keyof ChurchMemberByTeam];

      switch (columnKey) {
        case "name":
          return <p>{user.name + " " + user.lastname}</p>;
        case "roles":
          return <p>{user.selected_roles}</p>;

        case "status":
          const statusColorMap: Record<string, ChipColor> = {
            pending: "warning",
            confirmed: "success",
            denied: "danger",
          };

          const colorChip: ChipColor = statusColorMap[user.status] ?? "default";
          return (
            <Chip
              className="capitalize"
              color={colorChip}
              size="sm"
              variant="flat"
            >
              {user.status === "pending" && <>In attesa</>}
              {user.status === "confirmed" && <>Confermato</>}
              {user.status === "denied" && <>Rifiutato</>}
            </Chip>
          );

        default:
          if (Array.isArray(cellValue)) {
            // se è array di stringhe
            if (typeof cellValue[0] === "string") {
              return <p>{cellValue.join(", ")}</p>;
            }
            // altrimenti (array di oggetti) ritorna null o una stringa fallback
            return null;
          }
          // per altri tipi (string, boolean, JSX.Element) ritorna direttamente
          return cellValue as React.ReactNode;
      }
    },
    []
  );
  return (
    <div className="container-sub">
      <div className=" crea-setlist-container">
        <form onSubmit={handleSubmit(convertData)}>
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <Popover placement="bottom-start">
                <PopoverTrigger>
                  <Button isIconOnly style={{ backgroundColor: eventColor }}>
                    <BiColorFill color="white" size={24} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent style={{ borderWidth: "0px !important" }}>
                  <TwitterPicker colors={colors} onChange={handleColorChange} />
                </PopoverContent>
              </Popover>
              <h4>
                {page === "create" && "Crea"}
                {page === "update" && "Aggiorna"} Evento
              </h4>
            </div>
          </div>

          <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
            <div className="gap-1.5">
              <Select
                {...register("event_type")}
                fullWidth
                defaultSelectedKeys={new Set([setlistData?.event_type]) || null}
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
              {/* <Input
                {...register("event_title")}
                label="Tipo di evento"
                variant="underlined"
                labelPlacement="outside"
                size="sm"
                required
                defaultValue={eventDetails?.event_title || ""}
                placeholder="Serata di Preghiera..."
              /> */}
            </div>
            {/* <div className="flex justify-center">
              <Checkbox
                {...register("private")}
                defaultSelected={eventDetails?.private || false}
              >
                Evento Privato
              </Checkbox>
              <Tooltip content="Selezionando 'evento privato' l'evento sarà visibile solo ai leader della chiesa e membri aggiunti alla turnazione.">
                <Button
                  isIconOnly
                  radius="md"
                  variant="light"
                  size="sm"
                  className="ml-1"
                >
                  <IoMdInformationCircleOutline size={"22"} />
                </Button>
              </Tooltip>
            </div> */}

            <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
              <Input
                type="date"
                {...register("date")}
                label="Event Date"
                variant="bordered"
                size="sm"
                value={eventDate || ""} // controlled input
                onChange={(e) => {
                  const newDate = e.target.value;
                  const unavailable = getUnavailableMembers(
                    newDate,
                    teamsState
                  );
                  console.log(eventDate);
                  if (unavailable.length > 0) {
                    setPreviousEventDate(eventDate);
                    setIsDateConflictModalOpen(true);
                    setPendingDate(newDate);
                  } else {
                    setEventDate(newDate);
                  }
                }}
              />
            </div>
          </div>
          <div className="">
            <h5 className="p-4">Scaletta</h5>
            {schedule.length > 0 && (
              <div className="ncard nborder !p-3">
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

            <div className="transpose-button-container mr-8">
              <Dropdown>
                <DropdownTrigger>
                  <Button variant="bordered">
                    <FaPlus />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Static Actions">
                  <DropdownItem
                    key="title"
                    as={Button}
                    color="primary"
                    variant="light"
                    onPress={() => addItemToSetlist("title")}
                    startContent={<MdOutlineTitle />}
                  >
                    Titolo
                  </DropdownItem>
                  <DropdownItem
                    key="song"
                    as={Button}
                    color="primary"
                    variant="light"
                    onPress={() => addItemToSetlist("song")}
                    startContent={<TbMusicPlus />}
                  >
                    Canzone
                  </DropdownItem>
                  <DropdownItem
                    key="note"
                    variant="light"
                    color="primary"
                    as={Button}
                    onPress={() => addItemToSetlist("note")}
                    startContent={<MdEditNote />}
                  >
                    Nota
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
              {/* <SelectSongsDrawer
              type="add"
              songsList={songsList}
              addOrUpdatefunction={addSongtoSetlist} // Pass function correctly
              section={null}
            /> */}
            </div>
          </div>
          <div className="flex flex-col gap-2 [&>input]:mb-3 mt-4">
            <div className="form-div crea-setlist-container">
              <h5>Turnazioni</h5>
            </div>
            <Dropdown>
              <DropdownTrigger>
                <Button variant="bordered">Aggiungi Team</Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions">
                {teams &&
                  teams
                    .filter(
                      (team) =>
                        !teamsState.some(
                          (el) => el.team_name === team.team_name
                        )
                    )
                    .map((team: teamData) => (
                      <DropdownItem
                        key={team.id}
                        onPress={() => addTeam(team.id)}
                      >
                        {team.team_name}
                      </DropdownItem>
                    ))}
              </DropdownMenu>
            </Dropdown>
            <AnimatePresence>
              {teamsState.map((section, index) => {
                return (
                  <>
                    <Table
                      key={section.id}
                      aria-label="Team members table"
                      topContent={
                        <h6 className="font-bold">{section.team_name}</h6>
                      }
                      bottomContent={
                        <div className="team-title-container">
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
                      }
                    >
                      <TableHeader>
                        <TableColumn>Nome</TableColumn>
                        <TableColumn>Ruolo</TableColumn>
                        <TableColumn>Azioni</TableColumn>
                      </TableHeader>
                      <TableBody
                        items={
                          section.selected?.map((member) => ({
                            ...member,
                            teamId: section.id,
                            teamName: section.team_name,
                            roles:
                              getRolesFromTeamMembers(
                                section.id,
                                member.profile
                              ) || [],
                            isUnavailable:
                              member.blockouts?.some((b) => {
                                const start = new Date(b.start);
                                const end = new Date(b.end);
                                const target = new Date(eventDate);
                                return target >= start && target <= end;
                              }) ?? false,
                          })) || []
                        }
                      >
                        {(item) => (
                          <TableRow key={item.profile + section.id}>
                            <TableCell>
                              {item.name} {item.lastname}
                            </TableCell>
                            <TableCell>
                              {item.roles.length >= 1 && (
                                <Select
                                  aria-label="Select roles"
                                  className="max-w-[150px]"
                                  size="sm"
                                  placeholder="Seleziona Ruolo"
                                  defaultSelectedKeys={
                                    item.roles.includes(item.selected_roles)
                                      ? new Set([item.selected_roles])
                                      : undefined
                                  }
                                  onSelectionChange={(e) =>
                                    addRoleToMemberTeam(
                                      item.profile,
                                      item.teamId,
                                      e.currentKey as string
                                    )
                                  }
                                >
                                  {item.roles.map((role) => (
                                    <SelectItem key={role}>{role}</SelectItem>
                                  ))}
                                </Select>
                              )}
                            </TableCell>

                            <TableCell>
                              <Button
                                size="sm"
                                isIconOnly
                                color="danger"
                                variant="light"
                                onPress={() =>
                                  removeMemberToTeam(item.profile, section.id)
                                }
                              >
                                <RiDeleteBinLine size={20} />
                              </Button>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </>
                );
              })}
            </AnimatePresence>
          </div>

          <br />
          <Button
            color="primary"
            variant="shadow"
            type="submit"
            fullWidth
            disabled={isSubmitting}
          >
            {page === "create" && "Crea"}
            {page === "update" && "Aggiorna"} Evento
          </Button>
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
    </div>
  );
}
