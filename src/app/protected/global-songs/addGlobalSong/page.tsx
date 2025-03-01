import { TsongSchema, artistsT, songSchema } from "@/utils/types/types";
import { Button } from "@heroui/react";
import { addSong } from "./addSongAction";
import { Input, Textarea } from "@heroui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, SetStateAction } from "react";
import { toChordPro } from "@/utils/chordProFunctions/chordProFuncs";
import { getArtistsGlobal } from "@/hooks/GET/getArtistsGlobal";
import AddGlobalSong from "./addGlobalSongComponent";

export default async function App() {
  const Artists: artistsT[] = await getArtistsGlobal();

  return <AddGlobalSong artists={Artists} />;
}
