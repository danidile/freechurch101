"use server";

import { createClient } from "@/utils/supabase/server";
import { setListSongT } from "@/utils/types/types";
type SetlistSongRow = {
  id: string;
  key: string;
  order: number;
  song: {
    id: string;
    song_title: string;
    author: string;
  } | null;
  singer: {
    id: string;
    name: string;
    lastname: string;
  } | null;
};

export const getSetlistSchedule = async (setlistId: string | number) => {
  const supabase = await createClient();

  const [songsRes, notesRes, titlesRes] = await Promise.all([
    supabase
      .from("setlist-songs")
      .select(
        "id, song(id, song_title, author), key, order, singer(id, name, lastname)"
      )
      .eq("setlist_id", setlistId),
    supabase
      .from("setlist-notes")
      .select("id, note, order")
      .eq("setlist_id", setlistId),
    supabase
      .from("setlist-titles")
      .select("id, title, order")
      .eq("setlist_id", setlistId),
  ]);

  if (songsRes.error || notesRes.error || titlesRes.error) {
    console.error("Error fetching setlist data", {
      songsError: songsRes.error,
      notesError: notesRes.error,
      titlesError: titlesRes.error,
    });
    return [];
  }
const songsRaw = songsRes.data as unknown as SetlistSongRow[];

  const songs: setListSongT[] = songsRaw.map((item) => ({
    id: item.id,
    song: item.song?.id ?? null,
    song_title: item.song?.song_title ?? "",
    author: item.song?.author ?? "",
    key: item.key,
    order: item.order,
    type: "song",
    singer: item.singer?.id ?? null,
    singerName: item.singer
      ? `${item.singer.name} ${item.singer.lastname}`
      : "",
  }));

  const notes: setListSongT[] = notesRes.data.map((item) => ({
    id: item.id,
    note: item.note,
    order: item.order,
    type: "note",
  }));

  const titles: setListSongT[] = titlesRes.data.map((item) => ({
    id: item.id,
    title: item.title,
    order: item.order,
    type: "title",
  }));

  return [...songs, ...notes, ...titles].sort((a, b) => a.order - b.order);
};
