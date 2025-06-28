"use client";
import { albumsT, artistsT, songSchema } from "@/utils/types/types";
import { Button } from "@heroui/react";
import { addItalianSong } from "./addItalianSongAction";
import { Input, Textarea } from "@heroui/input";
import { useForm } from "react-hook-form";
import { useState, SetStateAction } from "react";
import { toChordPro } from "@/utils/chordProFunctions/chordProFuncs";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
export default function AddItalianSong({
  artists,
  albums,
}: {
  artists?: artistsT[];
  albums?: albumsT[];
}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<songSchema>();
  const [artistChosen, setArtistChosen] = useState("");

  const disp = "";
  const [state, setState] = useState(disp);

  const convertIntoChordPro = () => {
    let lyrics = state;
    lyrics = lyrics.replaceAll(`<b>`, "");
    lyrics = lyrics.replaceAll(`</b>`, "");

    setState(toChordPro(lyrics));
  };

  const handleInputChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setState(event.target.value);
  };

  const convertData = async (data: songSchema) => {
    data.lyrics = state;
    console.log(data);
    const watched = watch();
    const artistUsername: string | undefined = artists.find(
      (n) => n.artist_name === watched.artist
    ).username;
    const albumUsername: string | undefined = albums.find(
      (n) => n.album_name === watched.album
    ).id;
    data.artist = artistUsername;
    data.album = albumUsername;
    console.log("artistUsername");
    console.log(artistUsername);

    addItalianSong(data);
  };

  return (
    <div className="container-sub">
      <form onSubmit={handleSubmit(convertData)}>
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
              {...register("artist", { required: "Song Title is required" })}
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
              isDisabled={artistChosen.length < 1}
            >
              {albums
                .filter((n) => n.artist_username === artistChosen)
                .map((album: albumsT, index: number) => (
                  <AutocompleteItem key={index}>
                    {album.album_name}
                  </AutocompleteItem>
                ))}
            </Autocomplete>
          </div>

          <div className="flex gap-4 items-center">
            <Input
              {...register("upload_key", { required: "A key is required" })}
              label="Key"
              variant="bordered"
              size="sm"
            />
            <Input
              {...register("bpm")}
              label="BPM"
              variant="bordered"
              size="sm"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
