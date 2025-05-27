"use client";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Image,
} from "@heroui/react";

import { albumT, GroupedSongsByAlbum, songType } from "@/utils/types/types";
import Link from "next/link";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";

export default function AlbumsListComponent({
  songsByAlbum,
}: {
  songsByAlbum: GroupedSongsByAlbum;
}) {
  console.log("songsByAlbum", songsByAlbum);
  return (
    <>
      <div className="songs-header">
        <h4>Lista canzoni</h4>
      </div>
      <div className="container-album-list">
        {Object.entries(songsByAlbum).map(([albumName, songs]) => (
          <Card className="max-w-[600px] w-full" key={albumName}>
            <CardHeader className="flex gap-3">
              <Image
                alt="heroui logo"
                height={40}
                radius="sm"
                src={`/images/soundsmusicitalia.webp`}
                width={40}
              />
              <div className="flex flex-col">
                <h4>{albumName}</h4>
              </div>
            </CardHeader>
            <Divider />
            <CardBody>
              <ul>
                {songs.map((song) => (
                  <li key={song.id}>
                    <Link href={`/songs/${song.id}`}>{song.song_title}</Link>
                  </li>
                ))}
              </ul>
            </CardBody>
            <Divider />
          </Card>
        ))}
      </div>
    </>
  );
}
