import { redirect } from "next/navigation";
import { basicUserData } from "@/utils/types/userData";
import { Button } from "@nextui-org/react";

export default async function MyChurch({
  userData,
  teamMembers,
}: {
  userData: basicUserData;
  teamMembers: any;
}) {
  let accountCompleted = false;
  if ((userData.name && userData.lastname) || userData.church_id) {
    accountCompleted = true;
  }
  if (userData) {
    return (
      <div className="flex flex-row w-full gap-12">
        <div className="dashboard-container">
          <h4> New Life Teams</h4>

          <Button className="mx-auto">Crea Team</Button>

          {teamMembers.map((team: any) => {
            return (<>
            <p>{team.teamName}</p>
            {team.teamMembers.map((teamMember:any)=>{
              return (<p>{teamMember.name}</p>)
            })}
            </>
          );
          })}
        </div>
      </div>
    );
  } else {
    redirect("/login");
  }
}
