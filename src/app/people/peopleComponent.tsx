"use client";
import { redirect } from "next/navigation";

import { profileT } from "@/utils/types/types";
import { getProfilesByChurch } from "@/hooks/GET/getProfilesByChurch";
import GetParamsMessage from "../components/getParams";
import Link from "next/link";
import { TiUser } from "react-icons/ti";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store/useUserStore";

export default function PeopleComponent() {
  const { userData, loading } = useUserStore();
  const [profiles, setProfiles] = useState<any[] | null>(null);

  // Step 2: Once user is available, fetch songs
  useEffect(() => {
    if (!loading && userData.loggedIn) {
      getProfilesByChurch(userData.church_id).then(
        (fetchedPeople: profileT[]) => {
          setProfiles(fetchedPeople);
        }
      );
    }
  }, [loading, userData]);

  if (userData) {
    return (
      <div className="container-sub ">
        <h3 className="pb-6">People</h3>
        <div className="flex-col gap-3">
          <GetParamsMessage />
          {profiles &&
            profiles.map((profile: profileT) => {
              return (
                <div className="flex flex-row w-full gap-12" key={profile.id}>
                  <Link
                    className="people-link border-1 rounded-xl border-slate-300 my-1"
                    href={`/people/${profile.id}`}
                    key={profile.id}
                  >
                    <div className="people-list" key={profile.id}>
                      <div className="flex flex-row gap-2 items-center">
                        <TiUser color={profile.isTemp ? "#f5a524" : "black"} />
                        <p key={profile.id}>
                          {profile.name} {profile.lastname}
                        </p>
                      </div>

                      <span className="material-symbols-outlined">
                        <MoreVertIcon className="text-default-400" />
                      </span>
                    </div>
                  </Link>
                </div>
              );
            })}
        </div>
      </div>
    );
  } else {
    redirect("/login");
  }
}
