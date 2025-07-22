"use client";
import {
  NavbarContent,
  NavbarItem,
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Badge,
  Button,
} from "@heroui/react";
import isLoggedIn from "@/utils/supabase/getuser";
import logoutTest from "@/app/components/logOutAction";
import { basicUserData } from "@/utils/types/userData";
import { useEffect, useState } from "react";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import Link from "next/link";
import { FaInbox } from "react-icons/fa";
import CDropdown, { CDropdownOption } from "./CDropdown";

export default function UserDataMenu() {
  const router = useRouter();
  const { fetchUser, userData, notifications } = useUserStore();

  async function logouter() {
    await logoutTest();
    await fetchUser(); // client refetch
    router.push("/protected/dashboard/account"); // redirect AFTER store is up-to-date
  }

  const options = [
    {
      label: userData.email,
      value: "email",
    },
    {
      label: "Account",
      value: "account",
      href: "/protected/dashboard/account",
    },
    {
      label: "Esplora",
      value: "explore",
      href: "/",
    },
    ...(hasPermission(userData.role as Role, "view:teams")
      ? [
          {
            label: "Chiesa",
            value: "church",
            href: "/protected/church",
          },
          {
            label: "Teams",
            value: "teams",
            href: "/protected/teams",
          },
        ]
      : []),
    {
      label: "Eventi",
      value: "events",
      href: "/setlist",
    },
    {
      label: "Canzoni",
      value: "songs",
      href: "/songs",
    },
    {
      label: "Aggiorna Account",
      value: "editaccount",
      href: "/protected/dashboard/account/completeAccount",
    },
    {
      label: "Esci",
      value: "logout",
      color: "danger",
    },
  ];

  if (userData.loggedIn) {
    return (
      <div className="w-[100px] flex flex-row justify-end items-center gap-5 ml-auto mr-9">
        <CDropdown
          options={options}
          buttonPadding="sm"
          placeholder={
            <img
              src={
                `https://kadorwmjhklzakafowpu.supabase.co/storage/v1/object/public/avatars/${userData.avatar_url}` ||
                "/images/userAvatarDefault.jpg"
              }
              className="w-full h-full object-cover rounded-full"
            />
          }
          onSelect={(option) => {
            if (option.value === "logout") {
              logouter();
            } else {
              console.log("Selected:", option);
            }
          }}
        />
        <Badge
          size="md"
          color="danger"
          content={notifications?.pending?.notifications?.length}
        >
          <Button
            isIconOnly
            variant="flat"
            radius="full"
            color="default"
            as={Link}
            href="/notifications"
          >
            <FaInbox size={21} />
          </Button>
        </Badge>
        {/* <Dropdown placement="bottom-end">
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

            <DropdownItem as={Link} key="explore" href="/">
              Esplora
            </DropdownItem>

            {hasPermission(userData.role as Role, "view:teams") && (
              <>
                <DropdownItem as={Link} key="church" href="/protected/church">
                  Chiesa
                </DropdownItem>
                <DropdownItem as={Link} key="teams" href="/protected/teams">
                  Teams
                </DropdownItem>
              </>
            )}
            <DropdownItem as={Link} key="events" href="/setlist">
              Eventi
            </DropdownItem>
            <DropdownItem as={Link} key="songs" href="/songs">
              Canzoni
            </DropdownItem>

            <DropdownItem
              as={Link}
              key="editaccount"
              href="/protected/dashboard/account/completeAccount"
            >
              Aggiorna Account
            </DropdownItem>

            <DropdownItem
              className="text-red-500"
              key="logout"
              color="danger"
              onPress={logouter}
            >
              Esci
            </DropdownItem>
          </DropdownMenu>
        </Dropdown> */}
      </div>
    );
  }
}
