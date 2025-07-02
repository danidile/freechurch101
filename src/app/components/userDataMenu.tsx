"use client";
import {
  NavbarContent,
  NavbarItem,
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import isLoggedIn from "@/utils/supabase/getuser";
import logoutTest from "@/app/components/logOutAction";
import { basicUserData } from "@/utils/types/userData";
import { useEffect, useState } from "react";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import Link from "next/link";

export default function UserDataMenu({
  userData,
}: {
  userData: basicUserData;
}) {
  const router = useRouter();
  const { fetchUser } = useUserStore();

  async function logouter() {
    await logoutTest();
    await fetchUser(); // client refetch
    router.push("/protected/dashboard/account"); // redirect AFTER store is up-to-date
  }
  const [avatarUrl, setAvatarUrl] = useState("/images/userAvatarDefault.jpg");
  useEffect(() => {
    if (userData?.id) {
      const imageUrl = `https://kadorwmjhklzakafowpu.supabase.co/storage/v1/object/public/avatars/${userData.id}/avatar_thumb.jpg`;
      const img = new Image();

      img.onload = () => {
        setAvatarUrl(imageUrl); // Image exists and loaded
      };

      img.onerror = () => {
        setAvatarUrl("/images/userAvatarDefault.jpg"); // Fallback
      };

      img.src = imageUrl;
    }
  }, [userData?.id]);
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
                  setAvatarUrl("/images/userAvatarDefault.jpg");
                }}
              />
            </DropdownTrigger>

            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-10 gap-2">
                <small>{userData.email}</small>
              </DropdownItem>

              <DropdownItem
                as={Link}
                key="account"
                href="/protected/dashboard/account"
              >
                Account
              </DropdownItem>
              {userData.church_id && (
                <DropdownItem
                  as={Link}
                  key="blockouts"
                  href="/protected/blockouts"
                >
                  Blocca date
                </DropdownItem>
              )}

              {hasPermission(userData.role as Role, "view:teams") && (
                <>
                  <DropdownItem as={Link} key="teams" href="/protected/teams">
                    Teams
                  </DropdownItem>
                  <DropdownItem as={Link} key="songs" href="/italiansongs">
                    Italian Songs
                  </DropdownItem>
                  <DropdownItem
                    as={Link}
                    key="share"
                    href="/protected/dashboard/share"
                  >
                    Condividi Canzoni
                  </DropdownItem>
                  <DropdownItem
                    as={Link}
                    key="import "
                    className="flex"
                    href="/protected/dashboard/import-songs"
                  >
                    Importa Canzoni
                  </DropdownItem>
                  /protected/blockouts
                </>
              )}

              <DropdownItem
                className="text-red-500"
                key="logout"
                color="danger"
                onPress={logouter}
              >
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
        <NavbarItem>
          <Link href="/login">Accedi</Link>
        </NavbarItem>
      </NavbarContent>
    </>
  );
}
