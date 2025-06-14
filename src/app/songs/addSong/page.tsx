"use client";
import { songSchema } from "@/utils/types/types";
import { Button } from "@heroui/react";
import { addSong } from "./addSongAction";
import { Input, Textarea } from "@heroui/input";
import { useForm } from "react-hook-form";
import { useState, SetStateAction } from "react";
import { toChordPro } from "@/utils/chordProFunctions/chordProFuncs";
import { useRef } from "react";

export default function App() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const makeBold = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = state.slice(start, end);
    const hasTrailingNewline = selectedText.endsWith("\n");
    const cleanText = hasTrailingNewline
      ? selectedText.slice(0, -1)
      : selectedText;

    const wrapped = `<strong>${cleanText}</strong>${hasTrailingNewline ? "\n" : ""}`;
    const newText = state.slice(0, start) + wrapped + state.slice(end);
    setState(newText);

    // Put cursor after the bolded text
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + 2;
      textarea.selectionEnd = end + 2;
    }, 0);
  };
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<songSchema>();

  const convertData = async (data: songSchema) => {
    data.lyrics = state;
    console.log(data);
    addSong(data);
  };

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

  return (
    <div className="container-sub">
      <form onSubmit={handleSubmit(convertData)}>
        <h1 className="text-2xl font-medium">Aggiungi Canzone</h1>

        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <div className="flex gap-4 items-center">
            <Input
              {...register("song_title")}
              label="Song Title"
              variant="bordered"
              size="sm"
            />

            <Input
              {...register("author", { required: "Song Title is required" })}
              label="Author"
              variant="bordered"
              size="sm"
            />
          </div>

          <Input
            {...register("upload_key", { required: "A key is required" })}
            label="Key"
            variant="bordered"
            size="sm"
          />

          <Button
            type="button"
            onPress={convertIntoChordPro}
            color="primary"
            variant="flat"
          >
            Convert into ChordPro
          </Button>
          <Button onPress={makeBold}>Bold</Button>

          <Textarea
            {...register("lyrics")}
            value={state}
            onChange={handleInputChange}
            maxRows={50}
            minRows={35}
            cols={100}
            variant="bordered"
            size="sm"
            ref={textareaRef}
          />

          <Button
            color="primary"
            variant="shadow"
            type="submit"
            disabled={isSubmitting}
          >
            Add Song
          </Button>
        </div>
      </form>
    </div>
  );
}
