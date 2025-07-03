"use client";
import { MdMoreVert } from "react-icons/md";
import { CgArrowsExchange } from "react-icons/cg";
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
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { FaPlus } from "react-icons/fa";

import { useEffect, useState } from "react";

export function SelectTeamMemberDrawer({
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

  // just makes sure that when the state updates it updates also here.
  useEffect(() => {
    setmembers(churchMembers);
  }, [churchMembers]);
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

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
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
              </ModalHeader>
              <ModalBody>
                <>
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
                            }}
                          >
                            <div className="song-card-searchBar">
                              <p className="song-card-searchBar">
                                {member.name + " " + member.lastname}
                                <br />
                                <small>{member.email}</small>
                              </p>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Chiudi
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
