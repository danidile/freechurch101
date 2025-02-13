"use client";
import { MdMoreVert } from "react-icons/md";
import { CgArrowsExchange } from "react-icons/cg";
import {
  eventSchema,
  setListSongT,
  setListT,
  songType,
} from "@/utils/types/types";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectItem,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  useDisclosure,
} from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { TsongNameAuthor, formValues } from "@/utils/types/types";
import { PiMusicNotesPlusFill } from "react-icons/pi";
import { addSetlist } from "../../addSetlist/addSetlistAction";
import { updateSetlist } from "./updateSetlist";

function SelectSongsDrawer({
  songsList,
  addOrUpdatefunction,
  type,
  section,
}: {
  type: string;
  songsList: TsongNameAuthor[];
  addOrUpdatefunction: (song: setListSongT, section: number) => void;
  section: number;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [songs, setSongs] = useState(songsList);
  const [searchText, setSearchText] = useState(""); // Local state for search input

  const aggiornaLista = () => {
    const filteredSongs = songsList.filter(
      (song: songType) =>
        song.song_title.toLowerCase().includes(searchText.toLowerCase()) ||
        song.author.toLowerCase().includes(searchText.toLowerCase())
    );
    setSongs(filteredSongs);
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      aggiornaLista(); // Trigger search on Enter key
    }
  };

  // END SEARCHBAR DATA

  return (
    <>
      {type === "add" && (
        <Button onPress={onOpen}>
          Aggiungi canzone
          <PiMusicNotesPlusFill />
        </Button>
      )}
      {type === "update" && (
        <Button
          size="sm"
          isIconOnly
          variant="light"
          className="p-0"
          onPress={onOpen}
        >
          <CgArrowsExchange />
        </Button>
      )}

      <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1">
                Aggiungi Canzone
              </DrawerHeader>
              <DrawerBody>
                <>
                  <div className="songs-header">
                    <h4>Lista canzoni</h4>
                    <div className="songs-searchbar-form">
                      <Input
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)} // Update local state
                        color="primary"
                        type="text"
                        placeholder="Cerca canzone"
                        className="song-searchbar"
                        onKeyDown={handleKeyDown} // Listen for Enter key
                      />
                      <Button
                        color="primary"
                        variant="ghost"
                        onPress={() => aggiornaLista()} // Handle search
                      >
                        <ManageSearchIcon />
                      </Button>
                    </div>
                  </div>
                  <div className="container-song-list">
                    {songs.map((song, index) => {
                      return (
                        <div
                          key={song.id}
                          onClick={() => {
                            addOrUpdatefunction(song, section);
                            onClose();
                          }}
                        >
                          <div key={song.id}>
                            <p key={song.id}>
                              {song.song_title}
                              <br />
                              {song.author && <small>{song.author}</small>}
                              {!song.author && <small>Unknown</small>}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              </DrawerBody>
              <DrawerFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default function UpdateSetlistForm({
  page,
  songsList,
  setlistData,
}: {
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
  const [state, setState] = useState<setListSongT[]>(
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

  const date = new Date();
  const todaysDate = date.toISOString().split("T")[0];

  return (
    <div className="container-sub">
      <div className="form-div crea-setlist-container">
        <form onSubmit={handleSubmit(convertData)}>
          <h4>
            {page === "create" && "Crea"}
            {page === "update" && "Aggiorna"} Setlist
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

            <h6 className="mt-6">Struttura</h6>

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
                  <p>
                    <b>
                      {section.song_title}{" "}
                      <SelectSongsDrawer
                        section={index}
                        type="update"
                        songsList={songsList}
                        addOrUpdatefunction={updateSongtoSetlist} // Pass function correctly
                      />
                    </b>
                  </p>

                  <Select
                    size="sm"
                    className="key-selector"
                    defaultSelectedKeys={new Set([ keys.includes(section.key) ? section.key : keys[0]])} // Ensure it's a valid key
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
            <br />
            <Button
              color="primary"
              variant="shadow"
              type="submit"
              disabled={isSubmitting}
            >
              Aggiorna Setlist
            </Button>
          </div>
          <div>{/* <pre>{JSON.stringify(state, null, 2)}</pre> */}</div>
        </form>
      </div>
    </div>
  );
}
