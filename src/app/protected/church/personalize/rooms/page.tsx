"use client";

import { useUserStore } from "@/store/useUserStore";
import { useEffect, useState } from "react";
import { addToast, Button, Input, Textarea } from "@heroui/react";
import { useChurchStore } from "@/store/useChurchStore";
import { FaPlus } from "react-icons/fa6";
import { FaRegTrashAlt } from "react-icons/fa";
import { roomsType } from "@/utils/types/types";

import insertRoomsAction from "./insertRoomsAction";
import updateRoomsAction from "./updateRoomsAction";
import deleteRoomsAction from "./deleteRoomsAction";
import { FiSave } from "react-icons/fi";
import { MdOutlineEdit } from "react-icons/md";

export default function PersonalizeRoomsModal() {
  const { loadingChurchData, rooms, fetchChurchData } = useChurchStore();
  const [currentlyEditingIndex, setCurrentlyEditingIndex] = useState<
    number | null
  >(null);

  const { userData } = useUserStore();
  const [hasChanges, setHasChanges] = useState(false);

  const [personalizedRooms, setPersonalizedRooms] = useState<roomsType[]>([]);

  const [duplicateError, setDuplicateError] = useState({
    status: false,
    name: "",
  });
  function diffRooms(personalizedRooms: roomsType[], rooms: roomsType[]) {
    const toInsert: roomsType[] = [];
    const toUpdate: roomsType[] = [];
    const toDelete: roomsType[] = [];

    const existingRoomsMap = new Map(rooms.map((room) => [room.id, room]));

    // Determine inserts and updates
    for (const room of personalizedRooms) {
      if (!room.id) {
        toInsert.push(room); // New room (no ID)
      } else {
        const original = existingRoomsMap.get(room.id);
        if (
          original &&
          (original.name !== room.name || original.address !== room.address)
        ) {
          toUpdate.push(room); // room exists but has changed
        }
      }
    }

    const personalizedIds = new Set(
      personalizedRooms.map((room) => room.id).filter(Boolean)
    );

    // Determine deletes
    for (const room of rooms) {
      if (room.id && !personalizedIds.has(room.id)) {
        toDelete.push(room); // room is no longer present
      }
    }

    return { toInsert, toUpdate, toDelete };
  }

  useEffect(() => {
    if (!loadingChurchData && rooms) {
      setPersonalizedRooms(rooms);
    }
  }, [loadingChurchData, rooms]);
  useEffect(() => {
    if (!loadingChurchData) {
      const { toInsert, toUpdate, toDelete } = diffRooms(
        personalizedRooms,
        rooms
      );
      const hasDiffs =
        toInsert.length > 0 || toUpdate.length > 0 || toDelete.length > 0;
      setHasChanges(hasDiffs);
    }
  }, [personalizedRooms, rooms, loadingChurchData]);

  const saveRooms = async () => {
    setHasChanges(false);
    const { toInsert, toUpdate, toDelete } = diffRooms(
      personalizedRooms,
      rooms
    );
    console.log("Insert:", toInsert);
    console.log("Update:", toUpdate);
    console.log("Delete:", toDelete);

    if (toDelete.length >= 1) {
      const response = await deleteRoomsAction(toDelete, userData.church_id);
      if (!response.success) {
        addToast({
          title: `Errore durante l'eliminazione della stanza`,
          description: response.error,
          color: "danger",
        });
      }
    }
    if (toUpdate.length >= 1) {
      const response = await updateRoomsAction(
        personalizedRooms,
        userData.church_id
      );
      if (!response.success) {
        addToast({
          title: `Errore durante l'aggiornamento della stanza`,
          description: response.error,
          color: "danger",
        });
      }
    }
    if (toInsert.length >= 1) {
      const response = await insertRoomsAction(toInsert, userData.church_id);
      if (!response.success) {
        addToast({
          title: `Errore durante creazione della stanza`,
          description: response.error,
          color: "danger",
        });
      }
    }
    setCurrentlyEditingIndex(null);
    fetchChurchData(userData.church_id);
  };

  const addRoomFunction = () => {
    const newRoom: roomsType = {
      id: "", // or generate a temporary unique id if needed
      name: "",
      address: "",
      comune: "",
      church: "",
    };

    setPersonalizedRooms((prev) => [...prev, newRoom]);
    setDuplicateError({ status: false, name: "" }); // clear previous errors
  };
  const removeRoom = (roomToRemove: string) => {
    setPersonalizedRooms((prevSkills) =>
      prevSkills.filter((roomObj) => roomObj.name !== roomToRemove)
    );
  };

  return (
    <div className="w-full max-w-[500px]">
      <h2> Personalizza Stanze</h2>

      {personalizedRooms.map((room, idx) => (
        <div
          key={idx}
          className="w-full max-w-[600px] bg-white  p-3 flex flex-col gap-1"
        >
          {/* Header: nome stanza + azioni */}
          <div className="flex justify-between items-center gap-4">
            <div className="flex-1">
              {currentlyEditingIndex === idx ? (
                <Input
                  size="sm"
                  variant="bordered"
                  radius="sm"
                  placeholder="Sala principale..."
                  value={room.name}
                  onChange={(e) => {
                    const newName = e.target.value;
                    setPersonalizedRooms((prev) =>
                      prev.map((r, i) =>
                        i === idx ? { ...r, name: newName } : r
                      )
                    );
                  }}
                />
              ) : (
                <p className="text-base font-semibold text-gray-800">
                  {room.name}
                </p>
              )}
            </div>

            <div className="flex gap-2">
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
                )}{" "}
              </Button>
              {currentlyEditingIndex !== idx && (
                <>
                  <Button
                    size="sm"
                    color="danger"
                    variant="light"
                    isIconOnly
                    onPress={() => removeRoom(room.name ?? "")}
                  >
                    <FaRegTrashAlt />
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Indirizzo */}
          <div className="flex items-center gap-2">
            {currentlyEditingIndex === idx ? (
              <Textarea
                size="sm"
                variant="bordered"
                radius="sm"
                className="w-full"
                minRows={1}
                placeholder="Indirizzo: Es. Via XX Settembre, 9E"
                value={room.address}
                onChange={(e) => {
                  const newAddress = e.target.value;
                  setPersonalizedRooms((prev) =>
                    prev.map((r, i) =>
                      i === idx ? { ...r, address: newAddress } : r
                    )
                  );
                }}
              />
            ) : (
              <p className="text-sm text-gray-600">
                {room.address || (
                  <span className="italic text-gray-400">
                    Indirizzo non specificato
                  </span>
                )}
              </p>
            )}
          </div>
        </div>
      ))}

      {duplicateError.status && (
        <div className="flex nborder ncard max-w-[90vw] flex-col items-start gap-2 !bg-red-100 w-[500px] ">
          <div className="flex flex-row gap-4 items-center justify-center w-full">
            <small className="text-red-700">
              Non è possibile aggiungere due stanze con lo stesso nome.{" "}
              <strong>{duplicateError.name}</strong>
            </small>
          </div>
        </div>
      )}
      <div className="flex flex-row gap-4 max-w-[300px] mx-auto ">
        {!currentlyEditingIndex && (
          <>
            <Button
              size="sm"
              color="primary"
              variant="ghost"
              fullWidth
              onPress={() => {
                addRoomFunction();
                setCurrentlyEditingIndex(personalizedRooms.length);
              }}
            >
              <FaPlus /> Aggiungi stanza
            </Button>
          </>
        )}

        {hasChanges && (
          <Button
            size="sm"
            fullWidth
            color="primary"
            onPress={() => {
              saveRooms();
            }}
          >
            Salva
          </Button>
        )}
      </div>
      <br />
    </div>
  );
}
