"use client";

import { useUserStore } from "@/store/useUserStore";
import { useEffect, useState } from "react";
import { addToast, Button, Input, Textarea } from "@heroui/react";
import { useChurchStore } from "@/store/useChurchStore";
import { FaPlus } from "react-icons/fa6";
import { FaRegTrashAlt } from "react-icons/fa";
import { TagWithDescription } from "@/utils/types/types";
import insertTagsAction from "./insertTagsAction";
import deleteTagsAction from "./deleteTagsAction";
import updateTagsAction from "./updateTagsAction";

export default function PersonalizeSongsTagsModal() {
  const { loadingChurchData, tags, fetchChurchData } = useChurchStore();

  const { userData } = useUserStore();
  const [searchText, setSearchText] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  const [personalizedTags, setPersonalizedTags] = useState<
    TagWithDescription[]
  >([]);

  const [refetchTrigger, setRefetchTrigger] = useState(false);
  const [duplicateError, setDuplicateError] = useState({
    status: false,
    name: "",
  });
  function diffTags(
    personalizedTags: TagWithDescription[],
    tags: TagWithDescription[]
  ) {
    const toInsert: TagWithDescription[] = [];
    const toUpdate: TagWithDescription[] = [];
    const toDelete: TagWithDescription[] = [];

    const existingTagsMap = new Map(tags.map((tag) => [tag.id, tag]));

    // Determine inserts and updates
    for (const tag of personalizedTags) {
      if (!tag.id) {
        toInsert.push(tag); // New tag (no ID)
      } else {
        const original = existingTagsMap.get(tag.id);
        if (
          original &&
          (original.tag !== tag.tag || original.description !== tag.description)
        ) {
          toUpdate.push(tag); // Tag exists but has changed
        }
      }
    }

    const personalizedIds = new Set(
      personalizedTags.map((tag) => tag.id).filter(Boolean)
    );

    // Determine deletes
    for (const tag of tags) {
      if (tag.id && !personalizedIds.has(tag.id)) {
        toDelete.push(tag); // Tag is no longer present
      }
    }

    return { toInsert, toUpdate, toDelete };
  }

  useEffect(() => {
    if (!loadingChurchData && tags) {
      setPersonalizedTags(tags);
    }
  }, [loadingChurchData, tags]);
  useEffect(() => {
    if (!loadingChurchData) {
      const { toInsert, toUpdate, toDelete } = diffTags(personalizedTags, tags);
      const hasDiffs =
        toInsert.length > 0 || toUpdate.length > 0 || toDelete.length > 0;
      setHasChanges(hasDiffs);
    }
  }, [personalizedTags, tags, loadingChurchData]);
  const saveTags = async () => {
    setHasChanges(false);
    const { toInsert, toUpdate, toDelete } = diffTags(personalizedTags, tags);
    console.log("Insert:", toInsert);
    console.log("Update:", toUpdate);
    console.log("Delete:", toDelete);

    if (toDelete.length >= 1) {
      const response = await deleteTagsAction(toDelete, userData.church_id);
      if (!response.success) {
        addToast({
          title: `Errore durante l'eliminazione del Tag`,
          description: response.error,
          color: "danger",
        });
      }
    }
    if (toUpdate.length >= 1) {
      const response = await updateTagsAction(
        personalizedTags,
        userData.church_id
      );
      if (!response.success) {
        addToast({
          title: `Errore durante l'aggiornamento del Tag`,
          description: response.error,
          color: "danger",
        });
      }
    }
    if (toInsert.length >= 1) {
      const response = await insertTagsAction(toInsert, userData.church_id);
      if (!response.success) {
        addToast({
          title: `Errore durante creazione del Tag`,
          description: response.error,
          color: "danger",
        });
      }
    }
    fetchChurchData(userData.church_id);
  };
  const addTagsfunction = (tagsToAdd: string) => {
    const newTags = tagsToAdd
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");

    const duplicates: string[] = [];

    const uniqueNewTags = newTags.filter((tag) => {
      const isDuplicate = personalizedTags.some(
        (t) => t.name?.toLowerCase() === tag.toLowerCase()
      );
      if (isDuplicate) {
        duplicates.push(tag);
        return false; // exclude from tags to be added
      }
      return true;
    });

    if (duplicates.length > 0) {
      setDuplicateError({
        status: true,
        name: duplicates.join(", "),
      });
      return;
    }

    const tagObjects = uniqueNewTags.map((name) => ({
      name,
      description: "",
    }));

    setPersonalizedTags((prev) => [...prev, ...tagObjects]);
    setDuplicateError({ status: false, name: "" }); // clear previous errors
  };
  const removeTag = (tagNameToRemove: string) => {
    setPersonalizedTags((prevSkills) =>
      prevSkills.filter((tagObj) => tagObj.name !== tagNameToRemove)
    );
  };

  return (
    <>
      <h2> Personalizza Tag Canzoni</h2>

      <>
        <div>
          {personalizedTags.map((tagObj, idx) => (
            <div
              key={idx}
              className="flex nborder ncard max-w-[90vw] flex-col items-start gap-2  w-[500px] "
            >
              <h4 className="font-normal">{tagObj.name}</h4>
              <div className="flex flex-row gap-4 items-center justify-center w-full">
                <Textarea
                  size="sm"
                  variant="bordered"
                  radius="sm"
                  className=" w-full"
                  minRows={1}
                  placeholder="Es. Canzoni energiche per la lode"
                  value={tagObj.description}
                  onChange={(e) => {
                    const newDesc = e.target.value;
                    setPersonalizedTags((prev) =>
                      prev.map((t) =>
                        t.name === tagObj.name
                          ? { ...t, description: newDesc }
                          : t
                      )
                    );
                  }}
                />
                <Button
                  size="sm"
                  color="danger"
                  variant="light"
                  isIconOnly
                  onPress={() => removeTag(tagObj.name ?? "")}
                >
                  <FaRegTrashAlt />
                </Button>
              </div>
            </div>
          ))}
          {duplicateError.status && (
            <div className="flex nborder ncard max-w-[90vw] flex-col items-start gap-2 !bg-red-100 w-[500px] ">
              <div className="flex flex-row gap-4 items-center justify-center w-full">
                <small className="text-red-700">
                  Non è possibile aggiungere due tag con lo stesso nome.{" "}
                  <strong>{duplicateError.name}</strong>
                </small>
              </div>
            </div>
          )}
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
              placeholder="Adorazione, Lode"
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
          <small>Per aggiungere più tag dividili con una virgola " , ".</small>
          <br />
        </div>
      </>

      {hasChanges && (
        <Button
          color="primary"
          onPress={() => {
            saveTags();
          }}
        >
          Salva
        </Button>
      )}
    </>
  );
}
