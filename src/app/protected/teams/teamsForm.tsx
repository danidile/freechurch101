"use client";
import { MdMoreVert } from "react-icons/md";
import { churchMembersT, eventSchema, setListSongT, setListT } from "@/utils/types/types";
import {
  Button,
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
import { addSetlist } from "./create-team/addSetlistAction";
import { updateSetlist } from "./[teamsId]/update/updateSetlist";
import { SelectTeamMemberDrawer } from "./SelectTeamMemberDrawer";

export default function TeamsForm({
  churchMembers,
  page,
  songsList,
  setlistData,
}: {
  page: string;
  songsList: TsongNameAuthor[];
  setlistData: setListT;
  churchMembers: churchMembersT[];
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
  const [state, setState] = useState<churchMembersT[]>(
    setlistData?.setListSongs || []
  );
  const [eventDetails, setEventDetails] = useState<setListT>(setlistData);
  let x: string;

  const {
    handleSubmit,
    register,
    watch,
    formState: { isSubmitting },
  } = useForm<formValues>({
    resolver: zodResolver(eventSchema),
  });

  // SEARCHBAR DATA

  // -------------------------------------------

  // -------------------------------------------

  // ADD AND REMOVE SONG TO SETLIST
  const addSongtoSetlist = (member: churchMembersT) => {
    setState([
      ...state,
      {
        id: member.id,
        email: member.email,
        name: member.name,
        lastname: member.lastname,
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
    const watchAllFields = watch(); // when pass nothing as argument, you are watching everything
    const updatedSetlist: setListT = {
      id: setlistData?.id || crypto.randomUUID(),
      event_title: watchAllFields.event_title,
      date: watchAllFields.date,
      setListSongs: state,
    };
    console.log("updatedSetlist");
    console.log(updatedSetlist);
    console.log("setlistData");
    console.log(setlistData);

    if (page === "create") {
      addSetlist(updatedSetlist);
    } else if (page === "update") {
      updateSetlist(updatedSetlist, setlistData);
    }
  };

  return (
    <div className="container-sub">
      <div className="form-div crea-setlist-container">
        <form onSubmit={handleSubmit(convertData)}>
          <h4>
            {page === "create" && "Crea"}
            {page === "update" && "Aggiorna"} Team
          </h4>

          <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
            <div className="gap-1.5">
              <Input
                {...register("event_title")}
                label="Nome Team"
                variant="underlined"
                labelPlacement="outside"
                className="title-input"
                required
                defaultValue={eventDetails?.event_title || "Worship Team"}
                placeholder="Worship Team"
              />
            </div>

            <h5 className="mt-6">Membri del Team</h5>

            {state.map((member, index) => {
              return (
                <div className="setlist-section" key={member.id}>
                  <Input
                    name={"type" + member.id}
                    key={member.id}
                    value={member.id.toString()}
                    className="hide-input"
                    {...register(`sections.${index}.id`)}
                  />
                  <p>
                      {member.name + " " + member.lastname}
                  </p>

                  
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
                          id={member.id}
                          onPress={() => removeSection(member.id)}
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
              <SelectTeamMemberDrawer
                type="add"
                churchMembers={churchMembers}
                addOrUpdatefunction={addSongtoSetlist} // Pass function correctly
                section={null}
              />
            </div>
            <br />
            <Button
              color="primary"
              variant="shadow"
              type="submit"
              disabled={isSubmitting}
            >
              {page === "create" && "Crea"}
              {page === "update" && "Aggiorna"} Team
            </Button>
          </div>
          <div>{/* <pre>{JSON.stringify(state, null, 2)}</pre> */}</div>
        </form>
      </div>
     
    </div>
  );
}
