"use client";
import { profileT } from "@/utils/types/types";
import { Button, Input, Skeleton } from "@heroui/react";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import PeopleDrawerList from "./peopleDrawerList";

export default function Loading() {
  return (
    <div className="container-sub ">
      <h3 className="pb-6">People</h3>
      <div className="flex-col gap-3">
        {[...Array(12)].map((profile: profileT) => {
          return <PeopleDrawerList profile={profile} key={profile.id} />;
        })}
      </div>
    </div>
  );
}
