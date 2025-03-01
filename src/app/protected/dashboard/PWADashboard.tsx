"use client";
import logoutTest from "@/app/components/logOutAction";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import { basicUserData } from "@/utils/types/userData";
import { Button, Image, Link } from "@heroui/react";
export default function PWADashboard({
  userData,
}: {
  userData: basicUserData;
}) {
  async function logouter() {
    logoutTest();
  }
  return (
    <div className=" hidden standalone:block">
      <ul className="container-song-list ">
        <Link className="song-list text-black">
          {" "}
          <Image
            className="dashboard-icon"
            src="/images/dashboard/dashboard.png"
            alt=""
          />{" "}
          Dashboard
        </Link>
        <Link className="song-list text-black" href="/people">
          <Image
            className="dashboard-icon"
            src="/images/dashboard/song-lyrics.png"
            alt=""
          />{" "}
          Membri Chiesa
        </Link>
        {hasPermission(userData.role as Role, "view:teams") && (
          <>
            <Link className="song-list text-black" href="/protected/teams">
              <Image
                className="dashboard-icon"
                src="/images/dashboard/church.png"
                alt=""
              />{" "}
              Teams
            </Link>
            <Link className="song-list text-black" href="/protected/global-songs">
              <Image
                className="dashboard-icon"
                src="/images/dashboard/church.png"
                alt=""
              />{" "}
              Global Songs
            </Link>
          </>
        )}
        <Link className="song-list text-black">
          {" "}
          <Image
            className="dashboard-icon"
            src="/images/dashboard/settings.png"
            alt=""
          />
          Impostazioni
        </Link>
        <Link className="song-list text-black">
          {" "}
          <Image
            className="dashboard-icon"
            src="/images/dashboard/user.png"
            alt=""
          />
          Il mio Account
        </Link>
        <Button color="danger" variant="flat" onPress={logouter}>
          Sign out
        </Button>
      </ul>
    </div>
  );
}
