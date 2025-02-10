// @ts-nocheck
import { getSetList } from "@/hooks/GET/getSetList";
import { getSetListSongs } from "@/hooks/GET/getSetListSongs";
import { Button, Link } from "@nextui-org/react";
import ModalLyrics from "./modalLyrics";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import ButtonDeleteSetlist from "./buttonDeleteSetlist";
import { basicUserData } from "@/utils/types/userData";
import fbasicUserData from "@/utils/supabase/getUserData";
import CopyLinkButton from "@/app/components/CopyLinkButton";
export default async function Page({
  params,
}: {
  params: { setListId: string };
}) {
  
  return (
    <div className="container-sub">
      <p>Hello</p>
    </div>
  );
}
