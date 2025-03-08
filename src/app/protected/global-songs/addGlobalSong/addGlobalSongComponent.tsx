"use client";
import { albumsT, artistsT, songSchema } from "@/utils/types/types";
import { Button } from "@heroui/react";
import { addGlobalSong } from "./addGlobalSongAction";
import { Input, Textarea } from "@heroui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, SetStateAction } from "react";
import { toChordPro } from "@/utils/chordProFunctions/chordProFuncs";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
export default function AddGlobalSong({
  artists,
  albums,
}: {
  artists: artistsT[];
  albums: albumsT[];
}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<songSchema>();
  const [artistChosen, setArtistChosen] = useState("");

  function addCommentsToText(inputText: string) {
    // Definizione delle parole chiave che identificano sezioni
    const keywords = [
      "Bridge",
      "Coro",
      "Verso",
      "Precoro",
      "Intro",
      "special",
      "pre-coro",
    ];

    // Dividi il testo in righe
    const lines = inputText.split("\n");

    // Analizza ogni riga
    const updatedLines = lines.map((line) => {
      // Rimuovi spazi iniziali e finali per analisi più precisa
      const trimmedLine = line.trim();

      // Controlla se la riga inizia con una delle parole chiave (case insensitive) e non contiene già "{comment:"
      if (
        keywords.some((keyword) =>
          trimmedLine.toLowerCase().startsWith(keyword.toLowerCase())
        ) &&
        !trimmedLine.startsWith("{comment:")
      ) {
        return `{comment:"${trimmedLine}"}`;
      }

      // Gestisci righe di accordi con slash e linee verticali
      if (/\[\|.*\|\]/.test(trimmedLine)) {
        const cleanedLine = trimmedLine
          .replace(/[\/\|]/g, " ")
          .replace(/\s+/g, " ")
          .trim();
        return cleanedLine.replace(/ /g, (match, offset, string) =>
          offset === Math.floor(string.length / 2) ? "-" : match
        );
      }

      // Gestisci "Intro:" e simili
      if (/^Intro:/i.test(trimmedLine)) {
        const [introLabel, ...chords] = trimmedLine.split(/\s+/);
        return `{comment:"${introLabel}"}\n${chords.join(" ")}`;
      }

      // Ritorna la riga originale se non ci sono modifiche da fare
      return line;
    });

    // Ricostruisci il testo dalle righe modificate
    return updatedLines.join("\n");
  }

  const disp = "";
  const [state, setState] = useState(disp);

  const convertIntoChordPro = () => {
    let lyrics = state;
    lyrics = lyrics.replaceAll(`<b>`, "");
    lyrics = lyrics.replaceAll(`</b>`, "");
    lyrics = addCommentsToText(lyrics);

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

    addGlobalSong(data);
  };

  return (
    <div className="container-sub">
      <form onSubmit={handleSubmit(convertData)}>
        <h1 className="text-2xl font-medium">Add Song</h1>

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
          <Button
            type="button"
            onClick={convertIntoChordPro}
            color="primary"
            variant="flat"
          >
            Converti in formato ChordPro
          </Button>
          <Textarea
            {...register("lyrics")}
            value={state}
            onChange={handleInputChange}
            maxRows={50}
            minRows={35}
            cols={100}
            variant="bordered"
            size="sm"
          />

          <Button
            color="primary"
            variant="shadow"
            type="submit"
            disabled={isSubmitting}
          >
            Aggiungi Canzone
          </Button>
        </div>
      </form>
    </div>
  );
}
