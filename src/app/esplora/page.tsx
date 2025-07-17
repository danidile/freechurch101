import { createClient } from "@/utils/supabase/server";
import ExploreListComponent from "./exploreListComponent";
import { basicUserData } from "@/utils/types/userData";
import fbasicUserData from "../../utils/supabase/getUserData";
import SongsListSearch from "../components/songslistSearchComponent";
import { getSongs } from "@/hooks/GET/getSongs";

export default async function Page() {
  const supabase = await createClient();
  const { data: albums, error } = await supabase.from("albums").select("*");
  if (error) {
    console.error("Errore durante il fetch:", error);
  }

  const albumsList = [
    {
      title: "Offro a te",
      artista: "Davide Di Lecce",
      img: "offroaTeDavideDiLecce.png",
      url: "davidedilecce",
    },
    {
      title: "È Lui",
      artista: "Sounds Music Italia",
      img: "eLuiSounds.jpeg",
      url: "soundsmusicitalia",
    },
    {
      title: "Più sto con Te",
      artista: "Mirko e Giorgia",
      img: "piuStoConTeMirkoeGiorgia.jpeg",
      url: "mirkoegiorgia",
    },
    {
      title: "Luogo Sacro",
      artista: "Timoteo Pepe",
      img: "LuogoSacroTimoteoPepe.jpeg",
      url: "timoteopepe",
    },
  ];

  if (albums) {
    return (
      <div className="container-sub">
        <div className="visita-feed-section">
          <h3>Le ultime uscite</h3>
          <div className="visita-feed-container">
            {albumsList.map((album) => {
              return (
                <div>
                  <div className="image-feed-div-home card-v1">
                    <a href={`/artists/${album.url}`}>
                      <div className="content-feed"></div>
                      <img
                        className="image-feed-home"
                        src={`images/${album.img}`}
                      />
                    </a>
                  </div>
                  <div className="titolo-feed">
                    <div>
                      <p className="nome-utente-feed">{album.title}</p>
                      <p className="ruolo-utente-feed">{album.title}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <h3 className="text-center">Trova la tua canzone!</h3>
      </div>
    );
  } else {
    return (
      <>
        <h1>No songs found</h1>
        <a href="/songs/addSong">Add a New Song!</a>
      </>
    );
  }
}
