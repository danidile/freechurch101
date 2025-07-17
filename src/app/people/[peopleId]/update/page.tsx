import { profileT } from "@/utils/types/types";
import { getProfileById } from "@/hooks/GET/getProfileById";
import UpdatePeopleForm from "./updatePeople";

export default async function songs({
  params,
}: {
  params: Promise<any>;
}) {
    const awaitedParams = await params;

  const profile: profileT = await getProfileById(awaitedParams.peopleId);

  return (
    <div className="container-sub">
      <UpdatePeopleForm profile={profile} />
    </div>
  );
}
