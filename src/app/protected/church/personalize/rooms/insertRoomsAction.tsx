"use server";
import { createClient } from "@/utils/supabase/server";
import { roomsType, TagWithDescription } from "@/utils/types/types";

const insertRoomsAction = async (rooms: roomsType[], churchId: string) => {
  const supabase = createClient();
  const formattedRooms = rooms.map((room) => {
    return {
      church: churchId,
      name: room.name,
      address: room.address,
      comune: room.comune,
    };
  });
  const { data, error } = await supabase
    .from("rooms")
    .insert(formattedRooms)
    .select();

  if (error) {
    console.log(error);
    return {
      success: false,
      error: error.message,
    };
  } else {
    console.log("Stanza aggiunta/e con successo");
    return {
      success: true,
    };
  }
};

export default insertRoomsAction;
