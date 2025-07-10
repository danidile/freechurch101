"use client";
import { churchMembersT, setListSongT, songType } from "@/utils/types/types";
import {
  Button,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  useDisclosure,
} from "@heroui/react";
import { FaPlus } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { DateValue } from "@internationalized/date";

export function SelectWorshipTeamMemberDrawer({
  teamId,
  state,
  teamMembers,
  addMemberToTeam,
  type,
  section,
  date,
}: {
  teamId: string;
  state: churchMembersT[];
  type: string;
  teamMembers: churchMembersT[];
  addMemberToTeam: (song: setListSongT, teamId: string) => void;
  section: number;
  date: DateValue;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [members, setmembers] = useState(teamMembers);
  const [searchText, setSearchText] = useState(""); // Local state for search input

  const aggiornaLista = () => {
    // const filteredSongs = songsList.filter(
    //   (song: songType) =>
    //     song.song_title.toLowerCase().includes(searchText.toLowerCase()) ||
    //     song.author.toLowerCase().includes(searchText.toLowerCase())
    // );
    // setSongs(filteredSongs);
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      aggiornaLista(); // Trigger search on Enter key
    }
  };

  // END SEARCHBAR DATA

  return (
    <>
      <Button
        isIconOnly
        color="primary"
        size="lg"
        className="mr-0"
        onPress={onOpen}
      >
        <FaPlus />
      </Button>

      <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1"></DrawerHeader>
              <DrawerBody>
                <>
                  <div className="songs-header">
                    <h4>Lista Membri</h4>
                  </div>
                  <div className="container-song-list">
                    <AnimatePresence>
                      {members
                        .filter(
                          (member) =>
                            !state.some((m) => m.profile === member.profile)
                        )
                        .map((member, index) => {
                          const isUnavailable =
                            member.blockouts &&
                            member.blockouts.some((b) => {
                              const start = new Date(b.start);
                              const end = new Date(b.end);
                              const target = new Date(
                                date.year,
                                date.month - 1,
                                date.day
                              );

                              return target >= start && target <= end;
                            });

                          return (
                            <motion.div
                              initial={{
                                opacity: 0,
                                y: 25,
                              }}
                              animate={{
                                opacity: 1,
                                y: 0,
                              }}
                              exit={{
                                opacity: 0,
                                x: 80,
                              }}
                              transition={{ duration: 0.3, delay: index * 0.1 }} // Aggiunge un ritardo progressivo
                              layout
                              className={`song-card-searchBar ${isUnavailable ? "opacity-50 !cursor-default" : ""}`}
                              style={{ cursor: "pointer" }}
                              key={member.profile}
                              onClick={() => {
                                if (!isUnavailable)
                                  addMemberToTeam(member, teamId);
                              }}
                            >
                              <div
                                className={`song-card-searchBar ${isUnavailable ? "opacity-50 !cursor-default" : ""}`}
                              >
                                <p className="song-card-searchBar">
                                  {member.name + " " + member.lastname}
                                  <br />
                                  {!isUnavailable && (
                                    <small>{member.roles.join(", ")}</small>
                                  )}
                                  {isUnavailable && (
                                    <span className="text-red-500 block text-sm mt-1">
                                      Non è disponibile in questa data.
                                    </span>
                                  )}
                                </p>
                              </div>
                            </motion.div>
                          );
                        })}{" "}
                    </AnimatePresence>
                  </div>
                </>
              </DrawerBody>
              <DrawerFooter>
                <Button fullWidth color="primary" onPress={onClose}>
                  Chiudi
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
