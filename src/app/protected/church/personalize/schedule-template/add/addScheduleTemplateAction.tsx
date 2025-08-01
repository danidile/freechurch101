"use server";
import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import {
  expandedTeamT,
  scheduleTemplate,
  setListSongT,
  teamData,
} from "@/utils/types/types";
import { logEvent } from "@/utils/supabase/log";

export const addScheduleTemplate = async (formData: scheduleTemplate) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  // GET profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();
  const church: string = profile.church;

  // Create Setlist

  const { data, error } = await supabase
    .from("schedule-template")
    .insert({
      church: church,
      name: formData.name,
    })
    .select()
    .single();
  if (error) {
    console.log("error in setlist insert", error);
    await logEvent({
      event: "add_schedule_template_error",
      level: "error",
      user_id: user?.id ?? null,
      meta: {
        message: error.message,
        code: error.code,
        church: church,
        context: "scheludule template insert",
      },
    });
    return;
  }
  // Take the id of the setlist just created
  const templateId = data.id;

  // Format Team

  if (formData.schedule.length >= 1) {
    // Separate by type
    const elements = formData.schedule.map((item, index) => {
      if (item.type === "song")
        return { type: "song", order: index, template: templateId };
      if (item.type === "title")
        return {
          type: "title",
          content: item.title,
          order: index,
          template: templateId,
        };
      if (item.type === "note")
        return {
          type: "note",
          content: item.note,
          order: index,
          template: templateId,
        };
    });
    const { error } = await supabase
      .from("schedule-template-elements")
      .insert(elements)
      .select();
    if (error) {
      console.error(error);
      await logEvent({
        event: "add_setlist_error",
        level: "error",
        user_id: user?.id ?? null,
        meta: {
          message: error.message,
          code: error.code,
          context: "setlist-titles insert",
        },
      });
    } else {
      console.log("✅ Titles updated Successfully");
    }
  }

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    return encodedRedirect(
      "success",
      `/protected/church/personalize/schedule-template/${templateId}`,
      "SetList Registrata con successo!"
    );
  }
};
