"use server";
import { createClient } from "@/utils/supabase/server";
import { roomsType, TagWithDescription } from "@/utils/types/types";

const deleteRoomsAction = async (rooms: roomsType[], churchId: string) => {
  const supabase = await createClient();

  // Extract IDs from the tags to delete
  const idsToDelete = rooms.map((room) => room.id).filter(Boolean);

  if (idsToDelete.length === 0) {
    return {
      success: false,
      error: "No valid tag IDs to delete.",
    };
  }

  const { error } = await supabase
    .from("rooms")
    .delete()
    .eq("church", churchId)
    .in("id", idsToDelete);

  if (error) {
    console.error("Error deleting Rooms:", error);
    return {
      success: false,
      error: error.message,
    };
  }
  console.error("Rooms delete successfully");

  return {
    success: true,
  };
};

export default deleteRoomsAction;
