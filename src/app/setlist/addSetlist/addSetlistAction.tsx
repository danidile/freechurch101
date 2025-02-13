"use server";
import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { setListT } from "@/utils/types/types";

export const addSetlist = async (formData: setListT) => {
  const keys = [
    "A",
    "A#",
    "B",
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
  ];
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();
  const church: string = profile.church;

  const { data, error } = await supabase
    .from("setlist")
    .insert({
      id: formData.id,
      church: church,
      created_by: user?.id,
      date: formData.date,
      event_title: formData.event_title,
    })
    .select()
    .single();

  const sectionId = data.id;

  formData.setListSongs.map(async (section, index) => {

    console.log(section);
    if(section.type === "songs"){
    const { error } = await supabase
      .from("setlist-songs")
      .insert({
        setlist_id: sectionId,
        song: section.song,
        key: keys[Number(section.key)],
        order: index,
      })
      .select();
    } else if(section.type === "global-songs"){
      const { error } = await supabase.from("setlist-songs").insert({
        setlist_id: sectionId,
        global_song: section.song,
        key: keys[Number(section.key)],
        order: index,
      });
    }
    console.log(error);
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    return encodedRedirect(
      "success",
      `/setlist/${sectionId}`,
      "SetList Registrata con successo!"
    );
  }
};
