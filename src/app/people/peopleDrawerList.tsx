"use client";
import { profileT } from "@/utils/types/types";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  Button,
} from "@heroui/react";
import { Select, SelectSection, SelectItem } from "@heroui/select";

import { Link } from "@heroui/react";
import { basicUserData } from "@/utils/types/userData";
import { useState } from "react";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";

export default function PeopleDrawerList({
  profile,
  userData,
}: {
  profile: profileT;
  userData: basicUserData;
}) {
  // Drawer Settings
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  // END Drawer Settings
  const roles: Record<number, string> = {
    1: "Admin",
    2: "Church Admin",
    3: "Viewer",
  };

  return (
    <div className="flex flex-row w-full gap-12" key={profile.id}>
      <Link className="people-link" onPress={onOpen} key={profile.id}>
        <div className="people-list" key={profile.id}>
          <p key={profile.id}>
            {profile.name} 
            <br />
            <small>{profile.email}</small>
          </p>
          <span className="material-symbols-outlined">
            <MoreVertIcon className="text-default-400" />
          </span>
        </div>
      </Link>

      <Drawer isOpen={isOpen} size="4xl" onOpenChange={onOpenChange}>
        <DrawerContent className="pt-5">
          {(onClose) => (
            <>
              <DrawerHeader className="flex justify-end">
                {hasPermission(userData.role as Role, "update:setlists" ) && (
                  <Link className="mr-0" href={`/people/${profile.id}/update`}>
                    Edit
                  </Link>
                )}
              </DrawerHeader>

              <DrawerBody className=" bg-slate-100 py-10">
                <>
                  <h5 className="text-center">
                    <b>{profile.name + " " + profile.lastname} </b>
                  </h5>
                  <small className="text-center">{profile.email}</small>
                  <p className="text-center">
                    {roles[Number(profile.role)] || "Unknown"}
                  </p>
                </>
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
