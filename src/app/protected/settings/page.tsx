"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoSettingsSharp } from "react-icons/io5";
import { MdOutlineLogout } from "react-icons/md";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { PiPasswordBold } from "react-icons/pi";

export default function Sidebar({}: {}) {
  const router = useRouter();
  const { fetchUser, userData } = useUserStore();

  const [avatarUrl, setAvatarUrl] = useState("/images/userAvatarDefault.jpg");
  useEffect(() => {
    if (userData?.id) {
      setAvatarUrl(
        `https://kadorwmjhklzakafowpu.supabase.co/storage/v1/object/public/avatars/${userData.id}/avatar.jpg`
      );
    }
  }, [userData?.id]);
  async function logouter() {
    await fetchUser();
    router.push("/protected/dashboard/account");
  }

  return (
    <div className="hidden md:block sidebar-container">
      <div className="text-center"></div>
      <ul className="sidebar-ul">
        <li>
          <Link className="sidebar-link" href="/protected/reset-password">
            <PiPasswordBold className="dashboard-icon" />
            Cambia password
          </Link>
        </li>
      </ul>
    </div>
  );
}
