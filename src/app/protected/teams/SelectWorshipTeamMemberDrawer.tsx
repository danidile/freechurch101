"use client";
import { churchMembersT, setListSongT, songType } from "@/utils/types/types";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import {
  Button,
  Input,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  useDisclosure,
} from "@heroui/react";
import { FaPlus } from "react-icons/fa";

import { useState } from "react";

export function SelectWorshipTeamMemberDrawer({
  state,
  churchMembers,
  addMemberToTeam,
  type,
  section,
}: {
  state: churchMembersT[];
  type: string;
  churchMembers: churchMembersT[];
  addMemberToTeam: (song: setListSongT, section: number) => void;
  section: number;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [members, setmembers] = useState(churchMembers);
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
        radius="full"
        color="primary"
        variant="flat"
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
                    <div className="songs-searchbar-form">
                      <Input
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)} // Update local state
                        color="primary"
                        type="text"
                        placeholder="Cerca membri"
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
                    {members
                      .filter(
                        (member) => !state.some((m) => m.profile === member.id)
                      )

                      .map((member, index) => {
                        return (
                          <div
                            className="song-card-searchBar"
                            style={{ cursor: "pointer" }}
                            key={member.profile}
                            onClick={() => {
                              addMemberToTeam(member, section);
                              onClose();
                            }}
                          >
                            <div className="song-card-searchBar">
                              <p className="song-card-searchBar">
                                {member.name + " " + member.lastname}
                                <br />
                                <small>{member.roles.join(", ")}</small>
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
