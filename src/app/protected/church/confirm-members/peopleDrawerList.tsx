"use client";
import { pendingRequestsT, profileT } from "@/utils/types/types";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Link,
  Input,
} from "@heroui/react";
import { basicUserData } from "@/utils/types/userData";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { RadioGroup, Radio } from "@heroui/react";
import { confirmBelongingAction } from "./confirmBelongingAction";
import { confirmAndUpdateTempUserAction } from "./confirmAndUpdateTempUserAction";
import { useForm, Controller } from "react-hook-form";
import { denyBelongingAction } from "./denyBelongingAction";

export default function PeopleToConfirm({
  profile,
  userData,
}: {
  profile: pendingRequestsT;
  userData: basicUserData;
}) {
  const confirmBelonging = () => {
    confirmBelongingAction(profile.id);
  };
  const denyBelonging = () => {
    denyBelongingAction(profile.id);
  };
  return (
    <div className="flex flex-row w-full gap-12" key={profile.id}>
      <Link className="people-link" key={profile.id}>
        <div className="people-list" key={profile.id}>
          <p key={profile?.id}>
            {profile?.name + " " + profile.lastname}
            <br />
            <small>{profile?.email}</small>
          </p>
          <span className="material-symbols-outlined">
            <Dropdown>
              <DropdownTrigger>
                <Button variant="bordered">Clicca qui</Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Dynamic Actions">
                <DropdownItem
                  color="primary"
                  key="confirm"
                  className="text-center"
                  onPress={confirmBelonging}
                >
                  Conferma
                </DropdownItem>
                <DropdownItem
                  key="delete"
                  className="text-center text-danger"
                  color="danger"
                  onPress={denyBelonging}
                >
                  Nega
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </span>
        </div>
      </Link>
    </div>
  );
}
