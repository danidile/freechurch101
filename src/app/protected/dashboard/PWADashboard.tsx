"use client";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import { basicUserData } from "@/utils/types/userData";
import { Alert, Button } from "@heroui/react";
import { FaExternalLinkAlt, FaUserCircle } from "react-icons/fa";
import { HiMiniDocumentText, HiUserGroup } from "react-icons/hi2";
import { BiSolidChurch } from "react-icons/bi";
import { MdLibraryMusic } from "react-icons/md";
import { IoSettingsSharp } from "react-icons/io5";
import Link from "next/link";
import { pendingRequestsT } from "@/utils/types/types";
import GetParamsMessage from "@/app/components/getParams";
import { useSearchParams } from "next/navigation";
import { TfiSharethis } from "react-icons/tfi";
import { PiMusicNotesPlusFill } from "react-icons/pi";
import { LuCalendarDays } from "react-icons/lu";
import logoutAction from "@/app/components/logOutAction";

export default function PWADashboard({
  userData,
  pendingRequests,
}: {
  userData: basicUserData;
  pendingRequests: pendingRequestsT[];
}) {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const error = searchParams.get("error");
  async function logouter() {
    logoutAction();
  }
  return (
    <ul className="container-dashboard-list">
      {userData.pending_church_confirmation && (
        <Link
          className="dashboard-list !p-0"
          prefetch
          href="/protected/church/confirm-members"
        >
          <Alert
            color="primary"
            description="Attendi che i responsabili della tua chiesa confermino il tuo account."
            title="In attesa di conferma"
          />
        </Link>
      )}
      {(success || error) && (
        <div className="dashboard-list !p-0 !bg-transparent">
          <GetParamsMessage />
        </div>
      )}

      {pendingRequests && pendingRequests.length > 0 && (
        <Link
          className="dashboard-list !p-0"
          prefetch
          href="/protected/church/confirm-members"
        >
          <Alert
            endContent={<FaExternalLinkAlt />}
            color="warning"
            description="Alcuni account sono in attesa della tua conferma."
            title="In attesa di conferma"
          />
        </Link>
      )}
      <Link
        className="dashboard-list text-black"
        href="/protected/dashboard/account"
      >
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
            href="/globalsongs"
          >
            <MdLibraryMusic className="dashboard-icon" />
            Global Songs
          </Link>
          <Link
            className="dashboard-list text-black"
            href="/protected/dashboard/share"
          >
            <TfiSharethis className="dashboard-icon" />
            Condividi Canzoni
          </Link>
          <Link
            className="dashboard-list text-black"
            href="/protected/dashboard/import-songs"
          >
            <PiMusicNotesPlusFill className="dashboard-icon" />
            Importa Canzoni
          </Link>
        </>
      )}
      <Link href="" className="dashboard-list text-black">
        {" "}
        <IoSettingsSharp className="dashboard-icon" />
        Impostazioni
      </Link>
      <Link className="dashboard-list text-black" href="/legal">
        <HiMiniDocumentText className="dashboard-icon" />
        Legal
      </Link>
      {userData.role === "admin" && (
        <Link prefetch className="dashboard-list text-black" href="/calendario">
          <LuCalendarDays className="dashboard-icon" />
          Calendario
        </Link>
      )}

      <Button
        fullWidth
        color="danger"
        variant="flat"
        className="!py-7 !bg-red-100 dashboard-list"
        onPress={logouter}
      >
        Sign out
      </Button>
    </ul>
  );
}
