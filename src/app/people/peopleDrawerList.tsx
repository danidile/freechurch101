"use client";
import { profileT } from "@/utils/types/types";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  
} from "@heroui/react";
import { TiUser } from "react-icons/ti";

import { Link } from "@heroui/react";
import { basicUserData } from "@/utils/types/userData";
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

  return (
    <div className="flex flex-row w-full gap-12" key={profile.id}>
      <Link className="people-link" onPress={onOpen} key={profile.id}>
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

      <Drawer isOpen={isOpen} size="4xl" onOpenChange={onOpenChange}>
        <DrawerContent className="pt-5">
          {(onClose) => (
            <>
              <DrawerHeader className="flex justify-end">
                {hasPermission(userData.role as Role, "update:setlists") && (
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
                </>
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
