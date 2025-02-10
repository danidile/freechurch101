"use client";
import { redirect } from "next/navigation";
import { basicUserData } from "@/utils/types/userData";
import { profileT, Team } from "@/utils/types/types";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Link,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { useForm } from "react-hook-form";

export default function MyChurch({
  userData,
  profiles,
}: {
  userData: basicUserData;
  profiles: profileT[];
}) {
  const methods = useForm();
  let accountCompleted = false;
  if ((userData.name && userData.lastname) || userData.church_id) {
    accountCompleted = true;
  }
  if (userData) {
    const onSubmit = (data: any) => console.log(data);

    return (
      <div className="flex flex-row w-full gap-12">
        <div className="container-sub">
          <h4> New Life Teams</h4>
          {/* <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>             
             <TeamsTableN profiles={profiles} />;
              <Button type="submit" >Invia</Button>
            </form>
          </FormProvider> */}
          <div className="container-people-list">
            {profiles.map((profile: profileT) => {
              return (
                <Link className="people-link" href={`people/${profile.id}`}>
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
              );
            })}
          </div>
        </div>
      </div>
    );
  } else {
    redirect("/login");
  }
}
