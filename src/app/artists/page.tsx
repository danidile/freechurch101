import { createClient } from "@/utils/supabase/server";
import ArtistListComponent from "./ArtistListComponent";
import { basicUserData } from "@/utils/types/userData";
import fbasicUserData from "../../utils/supabase/getUserData";
import { HeaderCL } from "../components/header-comp";
import { LuMusic2 } from "react-icons/lu";

export default async function Page() {
  const supabase = await createClient();
  const { data: artists, error } = await supabase.from("artists").select("*");
  if (error) {
    console.error("Errore durante il fetch:", error);
  }
  const userData: basicUserData = await fbasicUserData();
  if (artists) {
    return (
      <div className="container-sub">
        <HeaderCL
          icon={LuMusic2}
          title="Artisti"
          description="Trova nuovi artisti e riscopri i classici della musica worship italiana contemporanea."
        />{" "}
        <ArtistListComponent artists={artists} />
      </div>
    );
  } else {
    return (
      <div className="container-sub">
        <h5>Nessun artista trovato</h5>
      </div>
    );
  }
}
