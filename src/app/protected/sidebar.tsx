"use client";
import { Avatar } from "@heroui/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FaUserCircle,
  FaCalendarTimes,
  FaRegCalendarAlt,
} from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi2";
import { IoNotificationsSharp, IoSettingsSharp } from "react-icons/io5";
import { MdOutlineLogout } from "react-icons/md";
import logoutAction from "../components/logOutAction";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { PiPasswordBold } from "react-icons/pi";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";

export default function Sidebar() {
  const router = useRouter();
  const { fetchUser, userData } = useUserStore();

  const [avatarUrl, setAvatarUrl] = useState("/images/userAvatarDefault.jpg");
  useEffect(() => {
    if (userData?.id) {
      setAvatarUrl(
        `https://kadorwmjhklzakafowpu.supabase.co/storage/v1/object/public/avatars/${userData.id}/avatar_thumb.jpg`
      );
    }
  }, [userData?.id]);
  async function logouter() {
    await logoutAction();
    await fetchUser();
    router.push("/protected/dashboard/account");
  }

  return (
    <>
      <div className="text-center w-full max-w-[400px]">
        <Avatar
          as="button"
          size="lg"
          className="transition-transform mt-10 mb-5"
          src={avatarUrl}
          onError={() => {
            setAvatarUrl("/images/userAvatarDefault.jpg"); // your default image path
          }}
        />
        <>
          <h6 className="font-bold">
            {userData.name + " " + userData.lastname}
          </h6>
          <p>{userData.email}</p>
        </>
      </div>
      <ul className="sidebar-ul">
        <li className="sidebar-li">
          <Link className="sidebar-link" href="/protected/dashboard/account">
            <div className="flex flex-row justify-start items-center w-full max-w-[140px] gap-5">
              <FaUserCircle className="dashboard-icon" />
              Account{" "}
            </div>
          </Link>
        </li>
        {userData.church_id && (
          <>
            <li className="sidebar-li">
              <Link className="sidebar-link" href="/protected/calendar">
                <div className="flex flex-row justify-start items-center w-full max-w-[140px] gap-5">
                  <FaRegCalendarAlt />
                  Calendario{" "}
                </div>
              </Link>
            </li>
            <li className="sidebar-li">
              <Link className="sidebar-link" href="/protected/notifications">
                <div className="flex flex-row justify-start items-center w-full max-w-[140px] gap-5">
                  <IoNotificationsSharp />
                  Notifiche{" "}
                </div>
              </Link>
            </li>
            <li className="sidebar-li">
              <Link className="sidebar-link" href="/protected/blockouts">
                <div className="flex flex-row justify-start items-center w-full max-w-[140px] gap-5">
                  <FaCalendarTimes className="dashboard-icon" />
                  Blocca Date{" "}
                </div>
              </Link>
            </li>
            <li className="sidebar-li">
              <Link className="sidebar-link" href="/protected/teams">
                <div className="flex flex-row justify-start items-center w-full max-w-[140px] gap-5">
                  <HiUserGroup className="dashboard-icon" />
                  Team{" "}
                </div>
              </Link>
            </li>
          </>
        )}

        <div className="w-full max-w-[75%] m-auto h-[1px]  bg-gray-300"></div>
        <li className="sidebar-li">
          <button className="sidebar-link logoutcolors" onClick={logouter}>
            <MdOutlineLogout />
            Esci
          </button>
        </li>
      </ul>
      <div className="absolute  bottom-0 w-full flex flex-row justify-center border-t-1">
        <Dropdown placement="top">
          <DropdownTrigger>
            <Button
              fullWidth
              variant="flat"
              radius="none"
              color="primary"
              className="h-[55px]"
            >
              <div className="flex flex-row justify-start items-center w-full max-w-[140px] gap-5 mx-auto">
                <IoSettingsSharp className="dashboard-icon" />
                {userData.name + " " + userData.lastname}
              </div>
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions">
            <DropdownItem
              key="updateaccount"
              as={Link}
              href="/protected/dashboard/account/completeAccount"
              startContent={<FaUserCircle className="dashboard-icon" />}
            >
              Aggiorna profilo
            </DropdownItem>
            <DropdownItem
              key="resetpassword"
              as={Link}
              href="/protected/reset-password"
              startContent={<PiPasswordBold className="dashboard-icon" />}
            >
              Cambia Password
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </>
  );
}
