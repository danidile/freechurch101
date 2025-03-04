"use client";
import { MdDelete, MdMoreVert } from "react-icons/md";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import {
  churchMembersT,
  eventSchema,
  setListSongT,
  setListT,
  teamData,
} from "@/utils/types/types";
import {
  Button,
  Chip,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectItem,
} from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { TsongNameAuthor, formValues } from "@/utils/types/types";
import { addSetlist } from "../../addSetlist/addSetlistAction";
import { updateSetlist } from "./updateSetlist";
import { SelectSongsDrawer } from "./SelectSongsDrawer";
import { SelectWorshipTeamMemberDrawer } from "@/app/protected/teams/SelectWorshipTeamMemberDrawer";
import { RiDeleteBinLine } from "react-icons/ri";

export default function UpdateSetlistForm({
  teams,
  page,
  songsList,
  setlistData,
  worshipTeamMembers,
}: {
  teams: teamData[];
  page: string;
  songsList: TsongNameAuthor[];
  setlistData: setListT;
  worshipTeamMembers: churchMembersT[];
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
  const [state, setState] = useState<setListSongT[]>(
    setlistData?.setListSongs || []
  );
  const [teamsState, setTeamsState] = useState<teamData[]>(
    teams.filter((team) => team.selected.length > 0) || []
  );
  const [team, setTeam] = useState<churchMembersT[]>([]);
  const [eventDetails, setEventDetails] = useState<setListT>(setlistData);
  let x: string;
  console.log("team");
  console.log(team);
  const {
    handleSubmit,
    register,
    watch,
    formState: { isSubmitting },
  } = useForm<formValues>({
    resolver: zodResolver(eventSchema),
  });

  // TeamData

  // -------------------------------------------

  const addTeam = (id: string) => {
    setTeamsState([
      ...teamsState,
      teams[teams.findIndex((section) => section.id === id)],
    ]);
    console.log("teamsState");
    console.log(teamsState);
  };

  const addMemberToTeam = (member: churchMembersT, teamId: string) => {
    setTeamsState((prevTeams) =>
      prevTeams.map((team) =>
        team.id === teamId
          ? { ...team, selected: [...(team.selected || []), member] }
          : team
      )
    );
    console.log("teamsState");
    console.log(teamsState);
  };
  // TeamData

  // -------------------------------------------

  const removeMemberToTeam = (profile: string) => {
    setTeam(team.filter((section) => section.profile !== profile));
  };
  // -------------------------------------------

  // END TeamData

  const addSongtoSetlist = (song: setListSongT) => {
    setState([
      ...state,
      {
        id: crypto.randomUUID(),
        song: song.id,
        song_title: song.song_title,
        author: song.author,
        type: song.type,
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

  const convertData = async () => {
    const newTeam: any = [];
    team.map((member) => {
      newTeam.push({ profile: member.profile });
    });
    const watchAllFields = watch(); // when pass nothing as argument, you are watching everything
    const updatedSetlist: setListT = {
      id: setlistData?.id || crypto.randomUUID(),
      event_title: watchAllFields.event_title,
      date: watchAllFields.date,
      setListSongs: state,
      teams: teamsState,
    };
    console.log("updatedSetlist");
    console.log(updatedSetlist);

    if (page === "create") {
      addSetlist(updatedSetlist);
    } else if (page === "update") {
      updateSetlist(updatedSetlist, setlistData);
    }
  };
  // console.log("teams");
  // console.log(teams);
  const date = new Date();
  const todaysDate = date.toISOString().split("T")[0];

  return (
    <div className="container-sub">
      <div className="form-div crea-setlist-container">
        <form onSubmit={handleSubmit(convertData)}>
          <h4>
            {page === "create" && "Crea"}
            {page === "update" && "Aggiorna"} Evento
          </h4>

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
            <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
              <Input
                type="date"
                {...register("date")}
                label="Event Date"
                variant="bordered"
                size="sm"
                defaultValue={eventDetails?.date.split("T")[0] || todaysDate}
              />
            </div>

            <h5 className="mt-6">Canzoni</h5>

            {state.map((section, index) => {
              return (
                <div className="setlist-section" key={section.id}>
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
                        keys.includes(section.key) ? section.key : keys[0],
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
                      <SelectItem id={key} key={key} value={key}>
                        {key}
                      </SelectItem>
                    ))}
                  </Select>
                  <Popover placement="bottom" showArrow={true}>
                    <PopoverTrigger>
                      <Button isIconOnly radius="full" variant="flat" size="sm">
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
                </div>
              );
            })}
            <div className="transpose-button-container">
              <SelectSongsDrawer
                type="add"
                songsList={songsList}
                addOrUpdatefunction={addSongtoSetlist} // Pass function correctly
                section={null}
              />
            </div>
          </div>
          <div>{/* <pre>{JSON.stringify(state, null, 2)}</pre> */}</div>

          <br />

          <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
            <div className="form-div crea-setlist-container">
              <h5>Turnazioni</h5>
            </div>
            <Dropdown>
              <DropdownTrigger>
                <Button variant="bordered">Aggiungi Team</Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions">
                {teams.map((team: teamData) => {
                  return (
                    <DropdownItem
                      key={team.id}
                      onPress={() => addTeam(team.id)}
                    >
                      {team.team_name}
                    </DropdownItem>
                  );
                })}
              </DropdownMenu>
            </Dropdown>
            {teamsState.map((section) => {
              return (
                <div className="team-show">
                  <h5>{section.team_name}</h5>

                  {section.selected &&
                    section.selected.map((member, index) => {
                      return (
                        <div
                          className="teammember-container !py-1"
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
                              <b>{member.name + " " + member.lastname}</b>
                            </p>
                            <Button
                              size="sm"
                              className="mx-0"
                              isIconOnly
                              color="danger"
                              type="button"
                              variant="light"
                              id={member.profile}
                              onPress={() => removeMemberToTeam(member.profile)}
                              accessKey={String(index)}
                            >
                              <RiDeleteBinLine size={20} />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  <div className="transpose-button-container">
                    <SelectWorshipTeamMemberDrawer
                      state={team}
                      type="add"
                      teamMembers={section.team_members}
                      addMemberToTeam={addMemberToTeam} // Pass function correctly
                      section={null}
                      teamId={section.id}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <br />
          <Button
            color="primary"
            variant="shadow"
            type="submit"
            disabled={isSubmitting}
          >
            {page === "create" && "Crea"}
            {page === "update" && "Aggiorna"} Evento
          </Button>
        </form>
      </div>
    </div>
  );
}
