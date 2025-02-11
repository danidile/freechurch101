"use server";
import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { setListT } from "@/utils/types/types";
type formValues = {
  eventType: string;
  eventTitle: string;
  date: string;
  sections: {
    sectionType: string;
    duration: string;
    description: string;
    song: string;
    tonalita: string;
  }[];
};

export const updateSetlist = async (formData: formValues) => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();


// COMPARING DATA
// const originalSetlist: setListT[] = [...];  // Original data (you would get this from your database or initial state)
// let currentSetlist: setListT[] = formData;    // Current data, which may have been altered

// END OF COMPARING DATA




  const { data, error } = await supabase
    .from("setlist")
    .insert({
      created_by: user?.id,
      date: formData.date,
      event_title: formData.eventTitle,
    })
    .select()
    .single();

  const sectionId = data.id;

  console.log(sectionId);

  formData.sections.map(async (section, index) => {
    console.log(section);
    const { error } = await supabase
      .from("setlist-songs")
      .insert({
        setlist_id: sectionId,
        song: section.song,
        notes: section.description,
        key: section.tonalita,
        order: index,
      })
      .select();
    if (error) {
      const { error } = await supabase.from("setlist-songs").insert({
        setlist_id: sectionId,
        global_song: section.song,
        notes: section.description,
        key: section.tonalita,
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
      "/setlist",
      "SetList Registrata con successo!"
    );
  }
};
