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
  ModalFooter,
  ModalContent,
  Modal,
  ModalHeader,
  ModalBody,
} from "@heroui/react";
import { FaPlus } from "react-icons/fa";

import { useState } from "react";

export function AddRole({
  
  churchMemberId,
  addRolefunction,
  type,
}: {
  type: string;
  churchMemberId: string;
  addRolefunction: (churchMemberId: string, roleToAdd: string) => void;
}) {
  const [searchText, setSearchText] = useState("");

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // END SEARCHBAR DATA

  return (
    <>
      <Button
        isIconOnly
        radius="full"
        variant="light"
        size="sm"
        className="mx-0 "
        onPress={onOpen}
      >
        <FaPlus />
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Aggiungi abilità
              </ModalHeader>
              <ModalBody>
                <div className="songs-searchbar-form">
                  <Input
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)} // Update state with input value
                    color="primary"
                    type="text"
                    placeholder="Cantante..."
                    className="song-searchbar"
                    onKeyDown={(e: React.KeyboardEvent) => {
                      if (e.key === "Enter") {
                        addRolefunction(churchMemberId, searchText);
                        setSearchText(""); // Clear input after adding

                        onClose();
                      }
                    }} // Listen for Enter key
                  />
                  <Button
                    color="primary"
                    variant="ghost"
                    onPress={() => {
                      if (searchText.trim() !== "") {
                        // Prevent empty input submission
                        addRolefunction(churchMemberId, searchText);
                        setSearchText(""); // Clear input after adding
                        onClose();
                      }
                    }}
                  >
                    <FaPlus />
                  </Button>
                </div>
                <small>
                  Per aggiungere più abilità dividile con una virgola " , ".
                </small>
                <br />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
