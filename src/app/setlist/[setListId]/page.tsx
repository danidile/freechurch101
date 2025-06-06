import { getSetList } from "@/hooks/GET/getSetList";
import { getSetListSongs } from "@/hooks/GET/getSetListSongs";
import { FaCheck } from "react-icons/fa";
import { FaCircle } from "react-icons/fa6";
import ModalLyrics from "./modalLyrics";
import { basicUserData } from "@/utils/types/userData";
import fbasicUserData from "@/utils/supabase/getUserData";
import CopyLinkButton from "@/app/components/CopyLinkButton";
import { GroupedMembers, setListSongT, setListT } from "@/utils/types/types";
import MoreDropdownSetlist from "./MoreDropdownSetlist";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import { getSetListTeams } from "@/hooks/GET/getSetListTeams";
import Link from "next/link";
import { Button } from "@heroui/button";
import SetlistPage from "./setlistPage";

export default async function Page({
  params,
}: {
  params: { setListId: string };
}) {
  return <SetlistPage  setListId={params.setListId} />;
}
