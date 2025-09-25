"use client";
import { keys } from "@/constants";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { Input } from "@heroui/input";
import { setListSongT, teamData, TsongNameAuthor } from "@/utils/types/types";
import { Button } from "@heroui/button";
import { MdHistory, MdMoreVert } from "react-icons/md";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { useEffect, useState } from "react";
import { getSongHistory } from "@/hooks/GET/getSongHistory";

export function SongFormComponent({
  section,
  index,
  source = "setlist",
  songsList,
  worshipTeams,
  setSchedule,
}: {
  source: string;
  section: setListSongT;
  index: number;
  songsList: TsongNameAuthor[];
  worshipTeams: teamData[];
  setSchedule: React.Dispatch<React.SetStateAction<setListSongT[] | null>>;
}) {
  const sectionIndex = index;
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isOpenHistory,
    onOpen: onOpenHistory,
    onOpenChange: onOpenChangeHistory,
  } = useDisclosure();

  // Use a local state for the search filter, not for the whole list
  const [history, setHistory] = useState(null);
  const [triggerFetch, setTriggerFetch] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filteredSongs, setFilteredSongs] =
    useState<TsongNameAuthor[]>(songsList);

  // Update the filtered list whenever the songsList prop or searchText changes
  useEffect(() => {
    const newFilteredSongs = songsList
      ? songsList?.filter(
          (song: TsongNameAuthor) =>
            song.song_title?.toLowerCase().includes(searchText.toLowerCase()) ||
            song.author?.toLowerCase().includes(searchText.toLowerCase())
        )
      : [];
    setFilteredSongs(newFilteredSongs);
  }, [songsList, searchText]);

  const worshipMembers = Array.from(
    new Map(
      worshipTeams
        ?.filter((team) => team.is_worship)
        .flatMap((team) => team.selected)
        .map((member) => [member.profile, member])
    ).values()
  );

  useEffect(() => {
    if (triggerFetch) {
      console.log("Fetching history for song:", section.song);
      const result = getSongHistory(section.song);
      if (result) {
        result.then((data) => {
          setHistory(data);
        });
      }
    }
  }, [triggerFetch, section.song]); // Added section.song to the dependency array

  return (
    <div className="setlist-section">
      <p
        onClick={() => {
          if (source === "setlist") onOpen();
        }}
        className={`${source === "setlist" ? "cursor-pointer" : ""}`}
      >
        {section.song_title}
        {!section.song_title && <>Canzone da scegliere</>}
      </p>

      {section.song && (
        <Button
          onPress={() => {
            onOpenHistory();
            setTriggerFetch(true);
          }}
          size="sm"
          variant="flat"
          isIconOnly
        >
          <MdHistory color="#6a6a6a" size={24} />
        </Button>
      )}

      {source === "setlist" && (
        <>
          <select
            value={
              section.key && keys.includes(section.key) ? section.key : keys[0]
            }
            onChange={(e) => {
              const newKey = e.target.value;
              setSchedule((prevState) =>
                prevState.map((item, idx) =>
                  idx === index ? { ...item, key: newKey } : item
                )
              );
            }}
            className="aselect"
            aria-label="key-selector"
          >
            {keys.map((key) => (
              <option key={key} value={key}>
                {key + " "}
              </option>
            ))}
          </select>
          <select
            value={section.singer || ""}
            onChange={(e) => {
              const newSinger = e.target.value;
              setSchedule((prevState) =>
                prevState.map((item, idx) =>
                  idx === index ? { ...item, singer: newSinger } : item
                )
              );
            }}
            className="aselect min-w-[100px]"
            aria-label="Seleziona membro del team"
          >
            {worshipMembers.length === 0 ? (
              <option disabled value="">
                Nessun membro disponibile
              </option>
            ) : (
              <>
                <option value="">Seleziona voce guida</option>
                {worshipMembers.map((member) => (
                  <option key={member.profile} value={member.profile}>
                    {member.name} {member.lastname}
                  </option>
                ))}
              </>
            )}
          </select>
        </>
      )}

      <Dropdown>
        <DropdownTrigger>
          <Button
            isIconOnly
            radius="full"
            variant="light"
            size="sm"
            className="mr-0"
          >
            <MdMoreVert className="text-2xl" />
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Static Actions">
          {source === "setlist" && (
            <DropdownItem
              key="update"
              as={Button}
              className="p-1"
              onPress={onOpen}
              variant="light"
            >
              {section.song_title && <>Modifica canzone</>}
              {!section.song_title && <>Seleziona canzone</>}
            </DropdownItem>
          )}

          <DropdownItem
            key="delete"
            className="p-1 selection:"
            as={Button}
            color="danger"
            variant="light"
            id={section.id}
            onPress={() =>
              setSchedule((schedule) =>
                schedule.filter((element) => element.id !== section.id)
              )
            }
            accessKey={String(index)}
          >
            Elimina
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Modal
        placement="center"
        scrollBehavior="inside"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        hideCloseButton={true}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="songs-searchbar-form">
                  <Input
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    color="primary"
                    type="text"
                    placeholder="Cerca canzone"
                    className="song-searchbar"
                  />
                  <Button color="primary" variant="ghost">
                    <ManageSearchIcon />
                  </Button>
                </div>
              </ModalHeader>
              <ModalBody>
                <>
                  <div className="songs-header">
                    <div className="container-song-list">
                      {/* Use the new filteredSongs state here */}
                      {filteredSongs.map((song, mapIndex) => {
                        return (
                          <div
                            style={{ cursor: "pointer" }}
                            key={(song.id + mapIndex).toString()}
                            onClick={() => {
                              setSchedule((prevState) => {
                                const index = prevState.findIndex(
                                  (s, idx) => idx === sectionIndex
                                );
                                const newSong = {
                                  song: song.id,
                                  song_title: song.song_title,
                                  author: song.author,
                                  key: "A",
                                };
                                if (index === -1) return prevState;

                                const updatedState = [...prevState];
                                updatedState[index] = {
                                  ...updatedState[index],
                                  ...newSong,
                                };

                                return updatedState;
                              });
                              setTriggerFetch(false);
                              setHistory(null);
                              onClose();
                            }}
                          >
                            <div className=" flex flex-col gap-0">
                              <p>{song.song_title}</p>
                              <small>
                                {song.author ? (
                                  <>{song.author}</>
                                ) : (
                                  <>Unknown</>
                                )}
                              </small>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              </ModalBody>
              <ModalFooter>
                <Button fullWidth color="primary" onPress={onClose}>
                  Chiudi
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal isOpen={isOpenHistory} onOpenChange={onOpenChangeHistory}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Storico Canzone{" "}
              </ModalHeader>
              <ModalBody>
                {history ? (
                  <div>
                    <small>
                      In questa tabella puoi vedere quando la canzone è stata
                      suonata, chi ha cantato e in quale tonalità.
                    </small>
                    <table className="atable">
                      <thead>
                        <tr>
                          <th>Data</th>
                          <th>Cantante</th>
                          <th>Chiave</th>
                        </tr>
                      </thead>
                      <tbody>
                        {history.map((entry: any, index: number) => {
                          const date = new Date(entry.setlist_id.date);
                          const readableDate = date.toLocaleString("it-IT", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          });
                          return (
                            <tr key={index} className="capitalize">
                              <td>{readableDate}</td>
                              <td>
                                {entry.singer?.name} {entry.singer?.lastname}
                              </td>
                              <td>{entry.key}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p> Questa canzone non è mai stata suonata</p>
                )}
              </ModalBody>
              <ModalFooter>
                <Button
                  fullWidth
                  color="primary"
                  variant="light"
                  onPress={onClose}
                >
                  Chiudi
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
