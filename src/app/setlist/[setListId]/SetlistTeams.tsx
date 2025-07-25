"use client";

import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import { FiSend } from "react-icons/fi";
import { useState } from "react";
import TeamTable from "./teamTable";
import { GroupedMembers, setListT } from "@/utils/types/types";

interface SetlistTeamsProps {
  teams: GroupedMembers;
  setlist: setListT;
  setListId: string;
  userData: any;
  onTeamsUpdate: () => void;
}

export default function SetlistTeams({
  teams,
  setlist,
  setListId,
  userData,
  onTeamsUpdate,
}: SetlistTeamsProps) {
  const [contactMode, setContactMode] = useState(false);

  const showEmail = hasPermission(userData.role as Role, "send:emails");

  const date = new Date(setlist.date);
  const readableDate = date.toLocaleString("it-IT", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      {Object.entries(teams).map(([teamName, members]) => (
        <div className="team-show mb-6" key={teamName}>
          <div className="flex justify-between items-center mb-2">
            <h5 className="font-medium">{teamName}</h5>
            {showEmail && (
              <button
                className="text-gray-600 hover:text-gray-800"
                onClick={() => setContactMode((prev) => !prev)}
              >
                <FiSend size={20} />
              </button>
            )}
          </div>

          <TeamTable
            members={members}
            teamName={teamName}
            readableDate={readableDate}
            setListId={setListId}
            contactMode={contactMode}
            onTeamsUpdate={onTeamsUpdate}
          />
        </div>
      ))}
    </>
  );
}
