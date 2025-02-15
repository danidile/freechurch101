import { basicUserData } from "@/utils/types/userData";
import fbasicUserData from "@/utils/supabase/getUserData";
import Link from "next/link";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { Team } from "@/utils/types/types";
import { getTeamsByChurch } from "@/hooks/GET/getTeamsByChurch";

export default async function Page() {
  const userData: basicUserData = await fbasicUserData();
  const churchTeams: Team[] = await getTeamsByChurch(userData.church_id);
  console.log("churchTeams");
  console.log(churchTeams);

  return (
    <div className="container-sub">
      <h5 className="text-center m-5">Teams</h5>
      {churchTeams &&
        churchTeams.map((team) => {
          return (
            <div className="song-list" key={team.id}>
              <Link
                className="song-list-link"
                href={`/protected/teams/${team.id}`}
              >
                <p key={team.id}>{team.team_name}</p>
                <ListAltIcon />
              </Link>
            </div>
          );
        })}
      {["1", "2"].includes(userData.role.toString()) && (
        <button className="button-transpose my-10">
          <a href="/protected/teams/create-team">Crea nuovo team</a>
        </button>
      )}
    </div>
  );
}
