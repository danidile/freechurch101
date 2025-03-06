"use client";
import { pendingRequestsT, profileT } from "@/utils/types/types";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Link,
} from "@heroui/react";
import { basicUserData } from "@/utils/types/userData";

export default function PeopleDrawerList({
  profile,
  userData,
}: {
  profile: pendingRequestsT;
  userData: basicUserData;
}) {
  return (
    <div className="flex flex-row w-full gap-12" key={profile.id}>
      <Link className="people-link" key={profile.id}>
        <div className="people-list" key={profile.id}>
          <p key={profile.profile.id}>
            {profile.profile.name}
            <br />
            <small>{profile.profile.email}</small>
          </p>
          <span className="material-symbols-outlined">
            <Dropdown>
              <DropdownTrigger>
                <Button variant="bordered">Clicca qui</Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Dynamic Actions">
                <DropdownItem color="primary" key="confirm">
                  Conferma
                </DropdownItem>
                <DropdownItem
                  key="delete"
                  className="text-danger"
                  color="danger"
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
