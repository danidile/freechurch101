"use server";
import { createClient } from "@/utils/supabase/server";
import { roomsType } from "@/utils/types/types";

const updateRoomsAction = async (rooms: roomsType[], churchId: string) => {
  const supabase = createClient();

  for (const room of rooms) {
    if (!room.id) continue;

    const { error } = await supabase
      .from("rooms")
      .update({
        name: room.name,
        address: room.address,
      })
      .eq("id", room.id)
      .eq("church", churchId);

    if (error) {
      console.error(
        `Errore aggiornando la Stanza con ID ${room.id}/ ${room.name}:`,
        error
      );
      return {
        success: false,
        error: error.message,
      };
    }
  }
  console.error("Room Updated successfully");

  return {
    success: true,
  };
};

export default updateRoomsAction;
