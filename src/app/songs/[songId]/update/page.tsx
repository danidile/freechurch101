import UpdateSongForm from "./updateSongForm";
import { songSchema } from "@/utils/types/types";
import { getSongById } from "@/hooks/GET/getSongById";
import { HeaderCL } from "@/app/components/header-comp";
import { MdOutlineLibraryMusic } from "react-icons/md";

export default async function Page({ params }: { params: Promise<any> }) {
  const awaitedParams = await params;

  const songData: songSchema = await getSongById(awaitedParams.songId);

  return (
    <>
      <div className="container-sub">
        <HeaderCL icon={MdOutlineLibraryMusic} title="Aggiorna canzone" />
        <UpdateSongForm songData={songData} type="update" />
      </div>
    </>
  );
}
