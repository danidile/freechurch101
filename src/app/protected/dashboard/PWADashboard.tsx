"use client";
import logoutTest from "@/app/components/logOutAction";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import { basicUserData } from "@/utils/types/userData";
import { Button, Image, Link } from "@heroui/react";
import { FaUserCircle } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi2";
import { BiSolidChurch } from "react-icons/bi";
import { MdLibraryMusic } from "react-icons/md";
import { IoSettingsSharp } from "react-icons/io5";
export default function PWADashboard({
  userData,
}: {
  userData: basicUserData;
}) {
  async function logouter() {
    logoutTest();
  }
  return (
    <ul className="container-dashboard-list">
      <Link className="dashboard-list text-black">
        {" "}
        <FaUserCircle className="dashboard-icon" />
        Il mio Account
      </Link>
      <Link className="dashboard-list text-black" href="/people">
        <BiSolidChurch className="dashboard-icon" />
        Membri Chiesa
      </Link>
      {hasPermission(userData.role as Role, "view:teams") && (
        <>
          <Link className="dashboard-list text-black" href="/protected/teams">
            <HiUserGroup className="dashboard-icon" />
            Teams
          </Link>
          <Link
            className="dashboard-list text-black"
            href="/protected/global-songs"
          >
            <MdLibraryMusic className="dashboard-icon" />
            Global Songs
          </Link>
        </>
      )}
      <Link className="dashboard-list text-black">
        {" "}
        <IoSettingsSharp className="dashboard-icon" />
        Impostazioni
      </Link>

      <Button fullWidth color="danger" variant="flat" className="py-5" onPress={logouter}>
        Sign out
      </Button>
    </ul>
  );
}
