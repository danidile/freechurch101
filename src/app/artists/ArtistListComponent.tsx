"use client";
import { artistT } from "@/utils/types/types";
import { Input, Button } from "@heroui/react";
import Link from "next/link";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { basicUserData } from "@/utils/types/userData";
import Image from "next/image";

type searchBar = {
  text: string;
};

export default function ArtistListComponent({
  artists,
  userData,
}: {
  artists: artistT[];
  userData: basicUserData;
}) {
  const [artistsList, setArtistsList] = useState(artists);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<searchBar>({
    defaultValues: {
      text: "",
    },
  });
  const aggiornaLista = (event: any) => {
    const filteredSongs = artists.filter((artist: artistT) =>
      artist.artist_name.toLowerCase().includes(event.text.toLowerCase())
    );

    setArtistsList(filteredSongs);
  };
  return (
    <>
      <div className="songs-header">
        <h4>Lista Artisti</h4>
        <form
          action=""
          className="songs-searchbar-form"
          onSubmit={handleSubmit(aggiornaLista)}
        >
          <Input
            {...register("text")}
            color="primary"
            type="text"
            placeholder="Cerca canzone"
            className="song-searchbar"
          />
          <Button
            color="primary"
            variant="ghost"
            type="submit"
            disabled={isSubmitting}
          >
            <ManageSearchIcon />
          </Button>
        </form>
      </div>
      <div className="container-song-list">
        {artistsList.map((artist) => {
          return (
            <Link
              key={artist.username}
              className="songlist-link "
              href={`/artists/${artist.username}`}
            >
              <div className="artist-list" key={artist.username}>
                <Image
                  src={`/images/${artist.username}.webp`}
                  alt={artist.artist_name}
                  width={64}
                  height={64}
                  className="cover-artist-list"
                />

                <p className="font-medium" key={artist.username}>
                  {artist.artist_name}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
