"use client";
import { artistT } from "@/utils/types/types";
import { Input, Button } from "@nextui-org/react";
import Link from "next/link";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { basicUserData } from "@/utils/types/userData";
import { songType } from "@/utils/types/types";


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
        <h4>Lista canzoni</h4>
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
            {" "}
            <ManageSearchIcon />
          </Button>
        </form>
        {["1", "2"].includes(userData.role.toString())  &&  (
          <Button color="primary" variant="ghost">
          <a href="/songs/addSong">Aggiungi una canzone!</a>
        </Button>
        )}
        
      </div>
      <div className="container-song-list">
        {artistsList.map((artist) => {
          return (
            <Link className="songlist-link" href={`/artists/${artist.username}`}>
              <div className="song-list" key={artist.username}>
                <p key={artist.username}>
                  {artist.artist_name}
                </p>
                <span className="material-symbols-outlined">
                  <QueueMusicIcon />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}