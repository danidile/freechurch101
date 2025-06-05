"use client";
import { songSchema } from "@/utils/types/types";
import { Button } from "@heroui/react";
import { Input, Textarea } from "@heroui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, SetStateAction } from "react";
import { toChordPro } from "@/utils/chordProFunctions/chordProFuncs";
import { updateSong } from "./updateSongAction";

export default function UpdateSongForm(songData: songSchema) {
  console.log("songData" + songData.song_title);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<songSchema>({
    defaultValues: {
      ...songData, // or explicitly: song_title: songData.song_title, etc.
    },
  });

  const convertData = async (data: songSchema) => {
    data.lyrics = state;

    await updateSong(data);
  };

  const [state, setState] = useState(songData.lyrics);
  const convertIntoChordPro = () => {
    setState(toChordPro(state));
    console.log(state);
  };

  
  const handleInputChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    console.log(event.target.value);
    setState(event.target.value);
  };
  return (
    <>
      <form onSubmit={handleSubmit(convertData)}>
        <h1 className="text-2xl font-medium">Add Song</h1>

        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <div className="flex gap-4 items-center">
            <Input
              {...register("song_title")}
              label="Song Title"
              variant="bordered"
              size="sm"
            />
            {errors.song_title && (
              <p className="text-red-500">{`${errors.song_title.message}`}</p>
            )}

            <Input
              {...register("author", { required: "Song Title is required" })}
              name="author"
              label="Author"
              variant="bordered"
              size="sm"
            />
          </div>

          <Input
            {...register("upload_key")}
            label="Tonalità"
            name="upload_key"
            variant="bordered"
            size="sm"
          />

          <Input
            {...register("id", { required: "" })}
            name="id"
            label="id"
            className="hidden"
          />

          <Button
            type="button"
            onPress={convertIntoChordPro}
            color="primary"
            variant="flat"
          >
            Convert into ChordPro
          </Button>
          <Textarea
            {...register("lyrics")}
            variant="bordered"
            className="song-text-area"
            size="sm"
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
            Aggiorna Canzone
          </Button>
        </div>
      </form>
    </>
  );
}
