"use client";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Image,
} from "@heroui/react";

import { GroupedSongsByAlbum, songType } from "@/utils/types/types";
import Link from "next/link";
import { TbExternalLink } from "react-icons/tb";

export default function AlbumsListComponent({
  songsByAlbum,
  artist,
}: {
  songsByAlbum: GroupedSongsByAlbum;
  artist: string;
}) {
  console.log("songsByAlbum", songsByAlbum);
  return (
    <>
      <div className="songs-header">
        <h4>Canzoni</h4>
      </div>
      <div className="container-album-list">
        {Object.entries(songsByAlbum).map(([albumName, songs]) => (
          <Card className="max-w-[600px] w-full" key={albumName}>
            <CardHeader className="flex gap-3">
              <Image
                alt="heroui logo"
                height={60}
                radius="sm"
                className="object-cover"
                src={`/images/${artist}.webp`}
                width={60}
              />
              <div className="flex flex-col">
                <h4>{albumName}</h4>
              </div>
            </CardHeader>
            <Divider />
            <CardBody>
              <table className="ntable">
                <thead>
                  <tr>
                    <th key="name">Nome</th>

                    <th key="open" className="w-1/12">
                      Apri
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {songs.map((song, rowIdx) => (
                    <tr key={rowIdx}>
                      <td key="name">
                        <Link
                          href={`/italiansongs/${song.id}`}
                          className="w-full"
                        >
                          <p>{song.song_title}</p>
                        </Link>
                      </td>
                      <td key="open">
                        <Link href={`/italiansongs/${song.id}`}>
                          <TbExternalLink size={20} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardBody>
            <Divider />
          </Card>
        ))}
      </div>
    </>
  );
}
