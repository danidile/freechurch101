"use server";

import { createClient } from "@/utils/supabase/server";

export const getScheduleTemplateById = async (templateId: string | number) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("schedule-template")
    .select("id, name")
    .eq("id", templateId)
    .single();
  if (error) {
    console.log("Error in fetching data from schedule-template");
  } else {
    const { data: elementsData, error: elementsError } = await supabase
      .from("schedule-template-elements")
      .select("*")
      .eq("template", templateId)
      .order("order");
    if (error) {
      console.log("Error in fetching data from schedule-template-elements");
    } else {
      const formatted = elementsData.map((el) => {
        if (el.type === "song")
          return {
            id: el.id,
            type: el.type,
            order: el.order,
          };
        if (el.type === "title")
          return {
            id: el.id,
            type: el.type,
            order: el.order,
            title: el.content,
          };
        if (el.type === "note")
          return {
            id: el.id,
            type: el.type,
            order: el.order,
            note: el.content,
          };
      });
      return {
        id: data.id,
        name: data.name,
        schedule: formatted,
      };
    }
  }
};
