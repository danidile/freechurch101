import { profileT } from "@/utils/types/types";
import { getProfileById } from "@/hooks/GET/getProfileById";
import UpdatePeopleForm from "./updatePeople";

export default async function songs({
  params,
}: {
  params: { peopleId: string };
}) {
  const profile: profileT = await getProfileById(params.peopleId);

  return (
    <div className="container-sub">
      <UpdatePeopleForm profile={profile} />
    </div>
  );
}
