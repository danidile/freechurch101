"use client";
import { albumsT, artistsT, songSchema } from "@/utils/types/types";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Select,
  SelectItem,
} from "@heroui/react";
import { Input, Textarea } from "@heroui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, SetStateAction } from "react";
import { toChordPro } from "@/utils/chordProFunctions/chordProFuncs";
import { updateSong } from "./updateSongAction";
import { FaUndoAlt, FaRedoAlt } from "react-icons/fa";
import { addSong } from "../../addSong/addSongAction";
import { usePathname } from "next/navigation";
import { updateItalianSongAction } from "@/app/italiansongs/[songId]/update/updateItalianSongAction";
import { addItalianSong } from "@/app/italiansongs/addSong/addItalianSongAction";
import { keys } from "@/constants";

export default function UpdateSongForm({
  songData,
  type,
  artists,
  albums,
}: {
  songData: songSchema;
  type: string;
  artists?: artistsT[];
  albums?: albumsT[];
}) {
  const pathname = usePathname(); // e.g. "/italiansongs/7784d9a0-2d3d..."
  const category = pathname.split("/")[1]; // "italiansongs"
  const [artistChosen, setArtistChosen] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<songSchema>({
    defaultValues: {
      ...songData, // or explicitly: song_title: songData.song_title, etc.
    },
  });

  const convertData = async (data: songSchema) => {
    data.lyrics = state;
    if (category === "songs") {
      if (type === "add") {
        data.lyrics = state;
        console.log(data);
        await addSong(data);
      } else if (type === "update") {
        data.lyrics = state;
        console.log(data);
        await updateSong(data);
      }
    } else if (category === "italiansongs") {
      const watched = watch();
      const artistUsername: string | undefined = artists.find(
        (n) => n.artist_name === watched.artist
      )?.username;
      const albumUsername: string | undefined = albums.find(
        (n) => n.album_name === watched.album
      )?.id;
      data.artist = artistUsername;
      data.album = albumUsername;
      if (type === "add") {
        data.lyrics = state;
        console.log(data);
        await addItalianSong(data);
      } else if (type === "update") {
        data.lyrics = state;
        console.log(data);
        await updateItalianSongAction(data);
      }
    }
  };

  const [state, setState] = useState(songData.lyrics);
  const [history, setHistory] = useState<string[]>([]);
  const [future, setFuture] = useState<string[]>([]);

  const convertIntoChordPro = () => {
    setState(toChordPro(state));
    console.log(state);
  };

  const handleInputChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setHistory((prev) => [...prev, state]); // Save current state before changing
    setState(event.target.value);
    setFuture([]); // Clear redo stack
  };
  const handleUndo = () => {
    if (history.length > 0) {
      const previous = history[history.length - 1];
      setHistory((prev) => prev.slice(0, -1));
      setFuture((prev) => [state, ...prev]); // Save current to redo stack
      setState(previous);
    }
  };
  const handleRedo = () => {
    if (future.length > 0) {
      const next = future[0];
      setFuture((prev) => prev.slice(1));
      setHistory((prev) => [...prev, state]); // Save current to history
      setState(next);
    }
  };

  return (
    <div className="container-sub">
      <form onSubmit={handleSubmit(convertData)}>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          {/* // META FOR ITALIANSONGS PAGE */}
          {category === "italiansongs" && (
            <>
              <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
                <div className="flex gap-4 items-center">
                  <Input
                    {...register("song_title")}
                    label="Titolo canzone"
                    variant="bordered"
                    size="sm"
                  />
                  <Input
                    {...register("author")}
                    label="Autore canzone"
                    variant="bordered"
                    size="sm"
                  />
                </div>
                <div className="flex gap-4 items-center">
                  <Autocomplete
                    size="sm"
                    variant="bordered"
                    label="Seleziona l'artista"
                    {...register("artist", {
                      required: "Song Title is required",
                    })}
                    onSelectionChange={(e) => setArtistChosen(e.toString())}
                  >
                    {artists.map((artist: artistsT, index: number) => (
                      <AutocompleteItem key={artist.username}>
                        {artist.artist_name}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                  <Autocomplete
                    size="sm"
                    variant="bordered"
                    label="Seleziona l'album"
                    {...register("album")}
                    defaultSelectedKey={songData.album || ""}
                    isDisabled={artistChosen.length < 1}
                  >
                    {albums
                      .filter((n) => n.artist_username === artistChosen)
                      .map((album: albumsT, index: number) => (
                        <AutocompleteItem key={album.id}>
                          {album.album_name}
                        </AutocompleteItem>
                      ))}
                  </Autocomplete>
                </div>

                <div className="flex gap-4 items-center">
                  <Select
                    variant="bordered"
                    fullWidth
                    label="Tonalità"
                    size="sm"
                    {...register("upload_key")}
                    defaultSelectedKeys={
                      new Set([
                        keys.includes(songData.upload_key)
                          ? songData.upload_key
                          : keys[0],
                      ])
                    }
                    aria-label="tonalità"
                  >
                    {keys.map((key) => (
                      <SelectItem id={key} key={key}>
                        {key}
                      </SelectItem>
                    ))}
                  </Select>

                  <Input
                    {...register("bpm")}
                    label="BPM"
                    variant="bordered"
                    size="sm"
                  />
                </div>
              </div>
            </>
          )}
          {/* META FOR SONGS PAGE */}
          {category === "songs" && (
            <>
              <div className="flex gap-4 items-center">
                <Input
                  {...register("song_title", {
                    required: "Song Title is required",
                  })}
                  label="Song Title"
                  variant="bordered"
                  size="sm"
                />
                {errors.song_title && (
                  <p className="text-red-500">{`${errors.song_title.message}`}</p>
                )}

                <Input
                  {...register("author")}
                  name="author"
                  label="Author"
                  variant="bordered"
                  size="sm"
                />
              </div>

              <Select
                variant="bordered"
                fullWidth
                label="Tonalità"
                size="sm"
                {...register("upload_key")}
                defaultSelectedKeys={
                  new Set([
                    keys.includes(songData.upload_key)
                      ? songData.upload_key
                      : keys[0],
                  ])
                }
                aria-label="tonalità"
              >
                {keys.map((key) => (
                  <SelectItem id={key} key={key}>
                    {key}
                  </SelectItem>
                ))}
              </Select>

              <Input
                {...register("id", { required: "" })}
                name="id"
                label="id"
                className="hidden"
              />
            </>
          )}
          <div className="flex flex-row justify-center items-center">
            <Button
              type="button"
              onPress={convertIntoChordPro}
              color="primary"
              variant="flat"
            >
              Converti in ChordPro
            </Button>
            <div className="p-1 border-amber-400">
              <Button
                type="button"
                onPress={handleUndo}
                variant="flat"
                color="secondary"
                isDisabled={history.length === 0}
                isIconOnly
              >
                <FaUndoAlt />
              </Button>
              <Button
                type="button"
                onPress={handleRedo}
                variant="flat"
                color="secondary"
                isDisabled={future.length === 0}
                isIconOnly
              >
                <FaRedoAlt />
              </Button>
            </div>
          </div>
          <Textarea
            {...register("lyrics")}
            variant="bordered"
            className="song-text-area"
            size="sm"
            value={state}
            onChange={handleInputChange}
            maxRows={50}
            name="lyrics"
            minRows={35}
            cols={60}
          />
          <Button
            color="primary"
            variant="shadow"
            type="submit"
            disabled={isSubmitting}
          >
            {type === "add"
              ? "Aggiungi Canzone"
              : type === "update"
                ? "Aggiorna Canzone"
                : ""}
          </Button>
        </div>
      </form>
    </div>
  );
}
