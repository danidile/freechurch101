"use client";
import { albumT, songType } from "@/utils/types/types";
import Link from "next/link";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import { basicUserData } from "@/utils/types/userData";

type searchBar = {
  text: string;
};

export default function ExploreListComponent({
  albums,
  userData,
}: {
  albums: albumT[];
  userData: basicUserData;
}) {
  return (
    <>
      <div className="songs-header">
        <h3>Lista Album</h3>
      </div>
      <div className="container-album-list-square">
        {albums.map((album) => {
          return (
            <>
              <div className="album-list-square bg-slate-200 " key={album.id}>
                <h5 key={album.id}>{album.album_name}</h5>
              </div>
              {/* <div className="container-album-list">
                {songs &&
                  songs.map((song: songType) => {
                    if (song.album == album.id) {
                      return (
                        <Link
                          className="albumlist-link"
                          href={`/songs/${song.id}`}
                        >
                          <div className="album-list" key={song.id}>
                            <p key={song.id}>{song.song_title}</p>
                            <span className="material-symbols-outlined">
                              <QueueMusicIcon />
                            </span>
                          </div>
                        </Link>
                      );
                    }
                  })}
              </div> */}
            </>
          );
        })}
      </div>
    </>
  );
}
