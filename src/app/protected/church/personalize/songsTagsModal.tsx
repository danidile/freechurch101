"use client";

import { useUserStore } from "@/store/useUserStore";
import { useEffect, useState } from "react";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Chip,
} from "@heroui/react";

import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import updateEventTypesAction from "./updateEventTypesAction";
import { defaultEventTypes } from "@/constants";
import { eventType } from "@/utils/types/types";
import { getpersonalizedEventTypesByChurch } from "@/hooks/GET/getpersonalizedEventTypesByChurch";
import { useChurchStore } from "@/store/useChurchStore";
import addEventTypesAction from "./addEventTypesAction";
import removeEventTypesAction from "./removeEventTypesAction";
import { FaPlus } from "react-icons/fa6";
import upsertTagsAction from "./upsertTagsAction";

export default function PersonalizeSongsTagsModal() {
  const { fetchChurchData, loadingChurchData, tags } = useChurchStore();
  const [personalizedTags, setPersonalizedTags] = useState<string[]>([]);
  const { userData, loading } = useUserStore();
  const [searchText, setSearchText] = useState("");

  const [refetchTrigger, setRefetchTrigger] = useState(false);

  const {
    isOpen: isOpenCustomizeTags,
    onOpen: onOpenCustomizeTags,
    onOpenChange: onOpenChangeTags,
  } = useDisclosure();

  useEffect(() => {
    if (!loadingChurchData && tags) {
      setPersonalizedTags(tags);
    }
  }, [loadingChurchData, tags]);

  const removeTag = (tagToRemove: string) => {
    setPersonalizedTags((prevSkills: string[]) =>
      prevSkills.filter((tag) => tag !== tagToRemove)
    );
    console.log("tagToRemove", tagToRemove);
  };

  const saveTags = async () => {
    console.log("personalizedTags",personalizedTags);
    const response = await upsertTagsAction(personalizedTags, userData.church_id);
    setRefetchTrigger(!refetchTrigger);
  };
  const addTagsfunction = (tagsToAdd: string) => {
    const newTags = tagsToAdd.split(",").map((role) => role.trim());
    setPersonalizedTags((prevSkills) => [...prevSkills, ...newTags]);
  };
  return (
    <>
      <Button
        color="primary"
        size="md"
        variant="solid"
        onPress={onOpenCustomizeTags}
      >
        Personalizza Tag
      </Button>

      <Modal
        className="max-h-[700px]"
        placement="center"
        scrollBehavior="inside"
        size="lg"
        isOpen={isOpenCustomizeTags}
        onOpenChange={onOpenChangeTags}
      >
        <ModalContent>
          {(onCloseCustomizeTypesModal) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Personalizza tipi evento
              </ModalHeader>
              <ModalBody>
                {/* Your edit form goes here */}
                <>
                  <div className="team-members-skills-div">
                    <p>Tag: </p>
                    {personalizedTags.map((tag: string) => {
                      return (
                        <Chip
                          color="primary"
                          variant="flat"
                          className="capitalize"
                          onClose={() => removeTag(tag)}
                        >
                          {tag}
                        </Chip>
                      );
                    })}
                    <div className="songs-searchbar-form">
                      <Input
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onBlur={() => {
                          if (searchText.trim() !== "") {
                            addTagsfunction(searchText.trim());
                            setSearchText("");
                          }
                        }}
                        size="sm"
                        type="text"
                        color="primary"
                        variant="bordered"
                        placeholder="Upbeat"
                        onKeyDown={(e: React.KeyboardEvent) => {
                          if (e.key === "Enter") {
                            addTagsfunction(searchText.trim());
                            setSearchText("");
                          }
                        }}
                      />
                      <Button
                        size="sm"
                        color="primary"
                        variant="ghost"
                        isIconOnly
                        onPress={() => {
                          if (searchText.trim() !== "") {
                            // Prevent empty input submission
                            addTagsfunction(searchText);
                            setSearchText(""); // Clear input after adding
                          }
                        }}
                      >
                        <FaPlus />
                      </Button>
                    </div>
                    <small>
                      Per aggiungere più tag dividili con una virgola " , ".
                    </small>
                    <br />
                  </div>
                </>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={onCloseCustomizeTypesModal}
                >
                  Annulla
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    saveTags();
                    onCloseCustomizeTypesModal();
                  }}
                >
                  Salva
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
