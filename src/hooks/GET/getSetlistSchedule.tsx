"use server";
import { createClient } from "@/utils/supabase/server";
import { setListSongT } from "@/utils/types/types";

export const getSetlistSchedule = async (setlistId: unknown) => {
  const supabase = await createClient();
  const { data: setlistSongs, error: songsError } = await supabase
    .from("setlist-songs")
    .select("id, song(id, song_title, author),key,order")
    .eq("setlist_id", setlistId);

  const { data: setlistNotes, error: notesError } = await supabase
    .from("setlist-notes")
    .select("id, note,order")
    .eq("setlist_id", setlistId);

  const { data: setlistTitles, error: titlesError } = await supabase
    .from("setlist-titles")
    .select("id, title,order")
    .eq("setlist_id", setlistId);

  if (songsError) console.log(songsError);
  if (notesError) console.log(notesError);
  if (titlesError) console.log(titlesError);

  const songs = (setlistSongs || []).map((item: any) => ({
    id: item.id,
    song: item.song?.id,
    song_title: item.song?.song_title,
    author: item.song?.author,
    key: item.key,
    order: item.order,
    type: "song",
  }));

  const notes = (setlistNotes || []).map((item: any) => ({
    id: item.id,
    note: item.note,
    order: item.order,
    type: "note",
  }));

  const titles = (setlistTitles || []).map((item: any) => ({
    id: item.id,
    title: item.title,
    order: item.order,
    type: "title",
  }));

  const merged: setListSongT[] = [...songs, ...notes, ...titles].sort(
    (a, b) => a.order - b.order
  );
  return merged;
};
