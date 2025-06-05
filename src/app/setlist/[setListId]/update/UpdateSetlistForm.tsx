"use client";
import { MdMoreVert } from "react-icons/md";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";

import {
  churchMembersT,
  eventSchema,
  setListSongT,
  setListT,
  teamData,
} from "@/utils/types/types";
import {
  Button,
  Checkbox,
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
import { useState } from "react";
import { TsongNameAuthor, formValues } from "@/utils/types/types";
import { addSetlist } from "../../addSetlist/addSetlistAction";
import { updateSetlist } from "./updateSetlist";
import { SelectSongsDrawer } from "./SelectSongsDrawer";
import { SelectWorshipTeamMemberDrawer } from "@/app/protected/teams/SelectWorshipTeamMemberDrawer";
import { RiDeleteBinLine } from "react-icons/ri";
import { AnimatePresence, motion } from "framer-motion";
import { BiColorFill } from "react-icons/bi";
import colors from "@/utils/eventsColors";

export default function UpdateSetlistForm({
  teams,
  page,
  songsList,
  setlistData,
}: {
  teams: teamData[];
  page: string;
  songsList: TsongNameAuthor[];
  setlistData: setListT;
}) {
  const keys = [
    "A",
    "A#",
    "B",
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
  ];
  const date = new Date();
  const todaysDate = date.toISOString().split("T")[0];
  const [eventDate, setEventDate] = useState<string>(
    setlistData?.date.split("T")[0] || todaysDate
  );
  const [state, setState] = useState<setListSongT[]>(
    setlistData?.setListSongs || []
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
    setlistData?.date.split("T")[0] || todaysDate
  );
  const [pendingDate, setPendingDate] = useState<string>(
    setlistData?.date.split("T")[0] || todaysDate
  );

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
      prevTeams.map((team) =>
        team.id === teamId
          ? {
              ...team,
              selected: team.selected?.some((m) => m.id === member.id)
                ? team.selected
                : [...(team.selected || []), member],
            }
          : team
      )
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

  const removeSection = (id: string) => {
    setState(state.filter((section) => section.id !== id));
  };

  const updateKey = (index: number, value: string) => {
    setState((prevState) => {
      // Update the object at the given index
      return prevState.map((item, idx) => {
        if (idx === index) {
          return { ...item, key: value }; // Update the key field of the matched object
        }
        return item; // Return the rest of the items unchanged
      });
    });
  };

  const updateSongtoSetlist = (song: setListSongT, section: number) => {
    setState((prevState) => {
      const index = prevState.findIndex((s, index) => index === section);
      const newSong = {
        song: song.id,
        song_title: song.song_title,
        author: song.author,
        type: song.type,
      };
      if (index === -1) return prevState; // No match found, return original state

      const updatedState = [...prevState]; // Create a new array (immutability)
      updatedState[index] = { ...updatedState[index], ...newSong }; // Update only the found section

      return updatedState; // Set the new state
    });
  };

  const convertData = async (data: formValues) => {
    const newTeam: any = [];
    team.map((member) => {
      newTeam.push({ profile: member.profile });
    });
    const watchAllFields = watch(); // when pass nothing as argument, you are watching everything
    const updatedSetlist: setListT = {
      id: setlistData?.id || crypto.randomUUID(),
      event_title: watchAllFields.event_title,
      date: watchAllFields.date,
      private: data.private,
      setListSongs: state,
      teams: teamsState,
      color: eventColor,
    };

    console.log("data");
    console.log(data);
    if (page === "create") {
      addSetlist(updatedSetlist);
    } else if (page === "update") {
      updateSetlist(updatedSetlist, setlistData);
    }
  };
  // console.log("teams");
  // console.log(teams);

  const handleColorChange = (color: ColorResult) => {
    setEventColor(color.hex);
  };

  //date modal change
  const [isDateConflictModalOpen, setIsDateConflictModalOpen] = useState(false);
  const [conflictedMembers, setConflictedMembers] = useState<churchMembersT[]>(
    []
  );

  const handleDateChange = (newDate: string) => {
    const unavailable = getUnavailableMembers(newDate, teamsState);

    if (unavailable.length > 0) {
      setConflictedMembers(unavailable);
      setPendingDate(newDate);
      setIsDateConflictModalOpen(true);
    } else {
      setEventDate(newDate);
    }
  };

  return (
    <div className="container-sub">
      <div className="form-div crea-setlist-container">
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
              <Input
                {...register("event_title")}
                label="Tipo di evento"
                variant="underlined"
                labelPlacement="outside"
                size="sm"
                required
                defaultValue={eventDetails?.event_title || ""}
                placeholder="Serata di Preghiera..."
              />
            </div>
            <div className="flex justify-center">
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
            </div>

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

            <h5 className="mt-6">Canzoni</h5>
            {state.length > 0 && (
              <div className="team-show">
                <AnimatePresence>
                  {state.map((section, index) => {
                    return (
                      <motion.div
                        initial={{
                          opacity: 0,
                          x: 85,
                        }}
                        animate={{
                          opacity: 1,
                          x: 0,
                        }}
                        exit={{
                          opacity: 0,
                          x: 80,
                        }}
                        transition={{ duration: 0.3, delay: index * 0.1 }} // Aggiunge un ritardo progressivo
                        layout
                        className="setlist-section"
                        key={section.id}
                      >
                        <Input
                          name={"type" + section.id}
                          key={section.id}
                          value={section.id.toString()}
                          className="hide-input"
                          {...register(`sections.${index}.id`)}
                        />
                        <SelectSongsDrawer
                          section={index}
                          type="update"
                          songsList={songsList}
                          addOrUpdatefunction={updateSongtoSetlist} // Pass function correctly
                        />
                        <p>
                          <b>{section.song_title} </b>
                        </p>

                        <Select
                          size="sm"
                          className="key-selector"
                          defaultSelectedKeys={
                            new Set([
                              keys.includes(section.key)
                                ? section.key
                                : keys[0],
                            ])
                          } // Ensure it's a valid key
                          {...register(`sections.${index}.key`, {
                            onChange: (e) => {
                              const newKey = e.target.value;
                              updateKey(index, newKey); // Pass the actual key value
                            },
                          })}
                          aria-label="tonalità"
                        >
                          {keys.map((key) => (
                            <SelectItem id={key} key={key}>
                              {key}
                            </SelectItem>
                          ))}
                        </Select>
                        <Popover placement="bottom" showArrow={true}>
                          <PopoverTrigger>
                            <Button
                              isIconOnly
                              radius="full"
                              variant="flat"
                              size="sm"
                            >
                              <MdMoreVert className="text-2xl" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent>
                            <div className="px-1 py-2 flex-col gap-2">
                              <div className="my-1"></div>
                              <Button
                                size="sm"
                                className="mx-0"
                                fullWidth
                                color="danger"
                                type="button"
                                variant="light"
                                id={section.id}
                                onPress={() => removeSection(section.id)}
                                accessKey={String(index)}
                              >
                                Elimina
                              </Button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </motion.div>
                    );
                  })}{" "}
                </AnimatePresence>
              </div>
            )}
          </div>
          <div className="transpose-button-container mr-8">
            <SelectSongsDrawer
              type="add"
              songsList={songsList}
              addOrUpdatefunction={addSongtoSetlist} // Pass function correctly
              section={null}
            />
          </div>
          <div>{/* <pre>{JSON.stringify(state, null, 2)}</pre> */}</div>

          <br />

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
                  <motion.div
                    initial={{
                      opacity: 0,
                      x: 85,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    exit={{
                      opacity: 0,
                      x: 80,
                    }}
                    transition={{ duration: 0.3, delay: index * 0.1 }} // Aggiunge un ritardo progressivo
                    layout
                    className="team-show"
                  >
                    <div className="team-title-container">
                      <h5 className="mb-6">{section.team_name}</h5>
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
                    <AnimatePresence>
                      {section.selected &&
                        section.selected.map((member, index) => {
                          const isUnavailable =
                            member.blockouts &&
                            member.blockouts.some((b) => {
                              const start = new Date(b.start);
                              const end = new Date(b.end);
                              const target = new Date(eventDate);
                              return target >= start && target <= end;
                            });
                          return (
                            <motion.div
                              initial={{
                                opacity: 0,
                                x: 85,
                              }}
                              animate={{
                                opacity: 1,
                                x: 0,
                              }}
                              exit={{
                                opacity: 0,
                                x: 80,
                              }}
                              transition={{
                                duration: 0.2,
                                delay: index * 0.06,
                              }} // Aggiunge un ritardo progressivo
                              layout
                              className={`teammember-container !py-1 ${isUnavailable ? " !bg-red-50" : ""}`}
                              key={member.profile}
                            >
                              <div className="teammember-section !py-1">
                                <Input
                                  name={"type" + member.profile}
                                  key={member.id}
                                  value={member.profile}
                                  className="hide-input"
                                  {...register(`sections.${index}.id`)}
                                />
                                <p>
                                  <b>
                                    {member.name + " " + member.lastname}
                                    {isUnavailable && (
                                      <span className="text-red-500 block text-sm mt-1">
                                        Non è disponibile in questa data.
                                      </span>
                                    )}
                                  </b>
                                </p>
                                <Button
                                  size="sm"
                                  className="mx-0"
                                  isIconOnly
                                  color="danger"
                                  type="button"
                                  variant="light"
                                  id={member.profile}
                                  onPress={() =>
                                    removeMemberToTeam(
                                      member.profile,
                                      section.id
                                    )
                                  }
                                  accessKey={String(index)}
                                >
                                  <RiDeleteBinLine size={20} />
                                </Button>
                              </div>
                            </motion.div>
                          );
                        })}
                    </AnimatePresence>
                  </motion.div>
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
