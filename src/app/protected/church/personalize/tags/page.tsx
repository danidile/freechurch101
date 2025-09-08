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
import { RiEdit2Line, RiEditLine } from "react-icons/ri";
import { IoIosClose } from "react-icons/io";
import { MdOutlineEdit, MdOutlineEditOff } from "react-icons/md";
import { FiSave } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { HeaderCL } from "@/app/components/header-comp";
import { LuTags } from "react-icons/lu";

export default function PersonalizeSongsTagsModal() {
  const { loadingChurchData, tags, fetchChurchData } = useChurchStore();
  const [currentlyEditingIndex, setCurrentlyEditingIndex] = useState<
    number | null
  >(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { userData } = useUserStore();
  const [hasChanges, setHasChanges] = useState(false);

  const [personalizedTags, setPersonalizedTags] = useState<
    TagWithDescription[]
  >([]);

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
          (original.name !== tag.name ||
            original.description !== tag.description)
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
        setErrorMessage("Errore durante l'eliminazione del Tag");
      } else {
        setSuccessMessage("Tag eliminato con successo");
      }
    }
    if (toUpdate.length >= 1) {
      const response = await updateTagsAction(
        personalizedTags,
        userData.church_id
      );
      if (!response.success) {
        setErrorMessage("Errore durante l'aggiornamento del Tag");
      } else {
        setSuccessMessage("Tag aggiornato con successo");
      }
    }
    if (toInsert.length >= 1) {
      const response = await insertTagsAction(toInsert, userData.church_id);
      if (!response.success) {
        setErrorMessage("Errore durante la creazione del Tag");
      } else {
        setSuccessMessage("Tag creato con successo");
      }
    }
    fetchChurchData(userData.church_id);
  };
  const addTagsfunction = () => {
    const newTag: TagWithDescription = {
      name: "",
      description: "",
    };

    setPersonalizedTags((prev) => [...prev, newTag]);
    setDuplicateError({ status: false, name: "" }); // clear previous errors
  };
  const removeTag = (tagNameToRemove: string) => {
    setPersonalizedTags((prevSkills) =>
      prevSkills.filter((tagObj) => tagObj.name !== tagNameToRemove)
    );
  };

  return (
    <div className="max-w-2xl w-full p-4 rounded-lg mx-auto">
      <HeaderCL icon={LuTags} title=" Personalizza Tag Canzoni" />
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="mt-4 rounded-lg bg-green-50 p-4 border border-green-600 text-green-800 text-sm"
          >
            ✅ {successMessage}
          </motion.div>
        )}

        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="mt-4 rounded-lg bg-red-50 p-4 border border-red-600 text-red-800 text-sm"
          >
            ❌ {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>
      <>
        {personalizedTags.map((tagObj, idx) => (
          <div
            key={idx}
            className="w-full max-w-[400px] bg-white  p-3 flex flex-col gap-1 border-b-1 "
          >
            <div className="flex justify-between items-center gap-4">
              <div className="flex-1">
                {currentlyEditingIndex === idx ? (
                  <Input
                    size="sm"
                    variant="bordered"
                    radius="sm"
                    className="w-full"
                    value={tagObj.name}
                    onChange={(e) => {
                      const newName = e.target.value;
                      setPersonalizedTags((prev) =>
                        prev.map((t, i) =>
                          i === idx ? { ...t, name: newName } : t
                        )
                      );
                    }}
                  />
                ) : (
                  <p className="text-sm font-medium text-gray-800">
                    {tagObj.name}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  color="primary"
                  variant="light"
                  isIconOnly
                  onPress={() =>
                    setCurrentlyEditingIndex((prev) =>
                      prev === idx ? null : idx
                    )
                  }
                >
                  {currentlyEditingIndex === idx ? (
                    <FiSave size={17} />
                  ) : (
                    <MdOutlineEdit size={17} />
                  )}
                </Button>
                {currentlyEditingIndex !== idx && (
                  <>
                    {" "}
                    <Button
                      size="sm"
                      color="danger"
                      variant="light"
                      isIconOnly
                      onPress={() => removeTag(tagObj.name ?? "")}
                    >
                      <FaRegTrashAlt />
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-row gap-4 items-center justify-center w-full">
              {currentlyEditingIndex === idx ? (
                <Textarea
                  size="sm"
                  variant="bordered"
                  radius="sm"
                  className="w-full"
                  minRows={1}
                  placeholder="Es. Canzoni energiche per la lode"
                  value={tagObj.description}
                  onChange={(e) => {
                    const newDesc = e.target.value;
                    setPersonalizedTags((prev) =>
                      prev.map((t, i) =>
                        i === idx ? { ...t, description: newDesc } : t
                      )
                    );
                  }}
                />
              ) : (
                <p className="text-sm text-gray-700 w-full">
                  {tagObj.description || "—"}
                </p>
              )}
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
      </>
      <div className="songs-searchbar-form">
        <Button
          size="sm"
          color="primary"
          variant="ghost"
          onPress={() => {
            addTagsfunction();
            setCurrentlyEditingIndex(personalizedTags.length);
          }}
        >
          <FaPlus /> Aggiungi Tag
        </Button>
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
      </div>
    </div>
  );
}
