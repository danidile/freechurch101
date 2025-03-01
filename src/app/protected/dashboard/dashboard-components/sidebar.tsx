import logoutTest from "@/app/components/logOutAction";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import { basicUserData } from "@/utils/types/userData";
import { Image, Link } from "@heroui/react";

export default function Sidebar({ userData }: { userData: basicUserData }) {
  return (
    <div className="dashboard-sidebar-container">
      <ul className="dashboard-ul">
        <li className="dashboard-li">
          <Image
            className="dashboard-icon"
            src="/images/dashboard/dashboard.png"
            alt=""
          />{" "}
          Dashboard
        </li>
        <li className="dashboard-li">
          <Link href="/protected/mychurch" className="dashboard-li">
            <Image
              className="dashboard-icon"
              src="/images/dashboard/song-lyrics.png"
              alt=""
            />{" "}
            mychurch
          </Link>
        </li>

        {hasPermission(userData.role as Role, "view:teams") && (
          <li className="dashboard-li">
            <Link href="/protected/teams">
              <Image
                className="dashboard-icon"
                src="/images/dashboard/church.png"
                alt=""
              />{" "}
              Teams
            </Link>
          </li>
        )}
        {hasPermission(userData.role as Role, "view:teams") && (
          <li className="dashboard-li">
            <Link href="/protected/global-songs">
              <Image
                className="dashboard-icon"
                src="/images/dashboard/church.png"
                alt=""
              />{" "}
              Global Songs
            </Link>
          </li>
        )}
        <li className="dashboard-li">
          {" "}
          <Image
            className="dashboard-icon"
            src="/images/dashboard/settings.png"
            alt=""
          />
          Impostazioni
        </li>
        <li className="dashboard-li">
          {" "}
          <Image
            className="dashboard-icon"
            src="/images/dashboard/user.png"
            alt=""
          />
          Il mio Account
        </li>
      </ul>
    </div>
  );
}
