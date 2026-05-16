"use client";
import { MdMoreVert } from "react-icons/md";
import { CgArrowsExchange } from "react-icons/cg";
import { churchMembersT, setListSongT, songType } from "@/utils/types/types";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import {
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { FaPlus } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, KeyboardEvent } from "react";
import { fadeInUp, transitionSpring } from "@/motion/motionVariants";

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
  const [members, setMembers] = useState(churchMembers);
  const [searchText, setSearchText] = useState("");

  // Sync members when prop changes
  useEffect(() => {
    setMembers(churchMembers);
  }, [churchMembers]);

  // Optional: handle Enter key to trigger search (you can customize this)
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      aggiornaLista();
    }
  };

  // Search/filter function: filters the members list based on searchText
  function aggiornaLista() {
    const filtered = churchMembers.filter((member) =>
      `${member.name} ${member.lastname}`
        .toLowerCase()
        .includes(searchText.toLowerCase())
    );
    setMembers(filtered);
  }

  // Always update the filtered list when searchText changes
  useEffect(() => {
    aggiornaLista();
  }, [searchText, churchMembers]);

  return (
    <>
      <Button
        isIconOnly
        radius="sm"
        color="primary"
        variant="solid"
        size="lg"
        className="mr-0"
        onPress={onOpen}
      >
        <FaPlus />
      </Button>

      <Modal
        className="h-[70vh]"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <div className="songs-header flex flex-col gap-2">
                  <h4>Lista Membri</h4>
                  <div className="songs-searchbar-form flex gap-2 items-center">
                    <Input
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      color="primary"
                      type="text"
                      placeholder="Cerca membri"
                      className="song-searchbar"
                      onKeyDown={handleKeyDown}
                    />
                    <Button
                      color="primary"
                      variant="ghost"
                      onPress={aggiornaLista}
                    >
                      <ManageSearchIcon />
                    </Button>
                  </div>
                </div>
              </ModalHeader>

              <ModalBody>
                <div className="container-song-list">
                  <AnimatePresence>
                    {members
                      .filter(
                        (member) => !state.some((m) => m.profile === member.id)
                      )
                      .map((member, index) => (
                        <motion.div
                          key={index}
                          layout
                          variants={fadeInUp}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={transitionSpring(index * 0.02)}
                          className="song-card-searchBar cursor-pointer"
                          onClick={() => addMemberToTeam(member, section)}
                        >
                          <div className="song-card-searchBar">
                            <p>
                              {member.name} {member.lastname}
                              <br />
                              <small>{member.email}</small>
                            </p>
                          </div>
                        </motion.div>
                      ))}
                  </AnimatePresence>
                </div>
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
