import { basicUserData } from "@/utils/types/userData";
import fbasicUserData from "@/utils/supabase/getUserData";
import Link from "next/link";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { Team } from "@/utils/types/types";
import { getTeamsByChurch } from "@/hooks/GET/getTeamsByChurch";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import { HiUserGroup } from "react-icons/hi2";
import { CgShapeHexagon } from "react-icons/cg";
import { PiCirclesThreeBold } from "react-icons/pi";

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
            <Link
              key={team.id}
              className="team-list"
              href={`/protected/teams/${team.id}`}
            >
              <div className="setlist-date-avatar">
                <p
                  className={`setlist-day 
                  }`}
                >
                  <PiCirclesThreeBold />
                </p>
                <small className="setlist-weekday">1</small>
              </div>
              <div className="setlist-list" key={team.id}>
                <p>
                  <b>{team.team_name}</b>
                </p>
              </div>

            </Link>
          );
        })}
      {hasPermission(userData.role as Role, "create:team") && (
        <button className="button-transpose my-10">
          <a href="/protected/teams/create-team">Crea nuovo team</a>
        </button>
      )}
    </div>
  );
}
