import { getProfileById } from "@/hooks/GET/getProfileById";
import { getProfileSetList } from "@/hooks/GET/getProfileSetLists";
import { getTeamsByProfile } from "@/hooks/GET/getTeamsByProfile";
import fbasicUserData from "@/utils/supabase/getUserData";
import { profileSetlistsT, profileT, profileTeamsT } from "@/utils/types/types";
import { basicUserData } from "@/utils/types/userData";
import { Card, CardBody, CardHeader, Chip, Link } from "@heroui/react";
import { MdEvent } from "react-icons/md";

import ModalRoleUpdate from "./modalRoleUpdate";
import PeopleIdComponent from "./peopleIdComponent";

export default async function Page({
  params,
}: {
  params: { peopleId: string };
}) {
  return <PeopleIdComponent params={params} />;
}
