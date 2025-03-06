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
  teamId,
  state,
  teamMembers,
  addMemberToTeam,
  type,
  section,
}: {
  teamId: string;
  state: churchMembersT[];
  type: string;
  teamMembers: churchMembersT[];
  addMemberToTeam: (song: setListSongT, teamId: string) => void;
  section: number;
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
                    {members
                      .filter(
                        (member) => !state.some((m) => m.profile === member.profile)
                      )
                      .map((member, index) => {
                        console.log("member");
                        console.log(member);
                        return (
                          <div
                            className="song-card-searchBar"
                            style={{ cursor: "pointer" }}
                            key={member.profile}
                            onClick={() => {
                              addMemberToTeam(member, teamId);
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
