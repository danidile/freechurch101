"use client";
import { profileT } from "@/utils/types/types";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import { RiEditFill } from "react-icons/ri";

import { Link } from "@heroui/react";
import { getProfilesById } from "@/hooks/GET/getProfilesById";

export default function PeopleDrawerList({ profile }: { profile: profileT }) {
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
            {profile.name} <small>{profile.email}</small>
            <br />
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
                <p className="text-right">Edit</p>
              </DrawerHeader>
              <DrawerBody className=" bg-slate-100 py-10">
              <h5 className="text-center">
                  <b>{profile.name + " " + profile.lastname}{" "}</b>
                </h5>
                <small className="text-center">{profile.email}</small>
                <p className="text-center">{roles[Number(profile.role)] || "Unknown"}</p>
              </DrawerBody>
              
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
