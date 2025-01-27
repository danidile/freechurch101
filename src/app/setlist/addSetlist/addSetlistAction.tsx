"use server";
import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
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

export const addSetlist = async (formData: formValues) => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log(formData);
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();
  const church: string = profile.church;
  const { data, error } = await supabase
    .from("setlist")
    .insert({
      church: church,
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
