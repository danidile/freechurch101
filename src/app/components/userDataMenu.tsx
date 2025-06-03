import {
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import isLoggedIn from "@/utils/supabase/getuser";
import logoutTest from "@/app/components/logOutAction";
import { basicUserData } from "@/utils/types/userData";
import { useState } from "react";
import { HiUserGroup } from "react-icons/hi2";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import { MdLibraryMusic } from "react-icons/md";
import { PiMusicNotesPlusFill } from "react-icons/pi";
import { TfiSharethis } from "react-icons/tfi";

export default function UserDataMenu({
  userData,
}: {
  userData: basicUserData;
}) {
  async function logouter() {
    logoutTest();
  }
  const [avatarUrl, setAvatarUrl] = useState(
    `https://kadorwmjhklzakafowpu.supabase.co/storage/v1/object/public/avatars/${userData.id}/avatar.jpg`
  );
  if (userData.loggedIn) {
    return (
      <>
        <NavbarItem>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                as="button"
                size="sm"
                className="transition-transform"
                src={avatarUrl}
                onError={() => {
                  setAvatarUrl("/images/userAvatarDefault.jpg"); // your default image path
                }}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-10 gap-2">
                <p className="font-semibold">{userData.email}</p>
              </DropdownItem>
              <DropdownItem key="settings" href="/protected/dashboard/account">
                Il mio profilo
              </DropdownItem>
              {hasPermission(userData.role as Role, "view:teams") && (
                <>
                  <DropdownItem key="teams" href="/protected/teams">
                    Teams
                  </DropdownItem>
                  <DropdownItem key="songs" href="/globalsongs">
                    Global Songs
                  </DropdownItem>
                  <DropdownItem key="share" href="/protected/dashboard/share">
                    Condividi Canzoni
                  </DropdownItem>
                  <DropdownItem
                    key="import "
                    className="flex"
                    href="/protected/dashboard/import-songs"
                  >
                    Importa Canzoni
                  </DropdownItem>
                </>
              )}

              <DropdownItem className="text-red-500" key="logout" color="danger" onPress={logouter}>
                Esci
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
        
      </>
    );
  }

  return (
    <>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Link href="/login">Accedi</Link>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="primary" href="/sign-up" variant="flat">
            Iscriviti
          </Button>
        </NavbarItem>
      </NavbarContent>
    </>
  );
}

// Fetch user data on the server
export async function getServerSideProps() {
  const userData = await isLoggedIn(); // Ensure `isLoggedIn` is an async function
  return {
    props: {
      userData, // Pass fetched user data as props
    },
  };
}
