"use client";
import { getSetList } from "@/hooks/GET/getSetList";
import { getSetListSongs } from "@/hooks/GET/getSetListSongs";
import { FaCheck } from "react-icons/fa";
import { FaCircle } from "react-icons/fa6";
import ModalLyrics from "./modalLyrics";
import CopyLinkButton from "@/app/components/CopyLinkButton";
import {
  ChipColor,
  ChurchMemberByTeam,
  churchMembersT,
  GroupedMembers,
  setListT,
  TeamMember,
} from "@/utils/types/types";
import MoreDropdownSetlist from "./MoreDropdownSetlist";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import { getSetListTeams } from "@/hooks/GET/getSetListTeams";
import Link from "next/link";
import { Button } from "@heroui/button";
import { useUserStore } from "@/store/useUserStore";
import { useState, useEffect, useCallback } from "react";
import { Spinner } from "@heroui/spinner";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Tooltip,
  Chip,
  User,
} from "@heroui/react";
import isTeamLeaderClient from "@/utils/supabase/isTeamLeaderClient";
export default function SetlistPage({ setListId }: { setListId: string }) {
  const { userData, fetchUser, loading } = useUserStore();
  const [setlistSongs, setSetlistSongs] = useState<any[] | null>(null);
  const [setlistData, setSetlistData] = useState<setListT | null>(null);
  const [setlistTeams, setSetlistTeams] = useState<GroupedMembers | null>(null);
  const [loadingSetlist, setLoadingSetlist] = useState(true);
  const columns = [
    {
      key: "name",
      label: "Nome",
    },
    {
      key: "roles",
      label: "Ruoli",
    },

    {
      key: "status",
      label: "Stato",
    },
  ];
  // Step 2: Once user is available, fetch songs
  useEffect(() => {
    if (!loading && userData.loggedIn) {
      getSetList(setListId).then((fetchedSetList: setListT) => {
        setSetlistData(fetchedSetList);
      });
      getSetListSongs(setListId).then((fetchedSetListSongs: setListT[]) => {
        setSetlistSongs(fetchedSetListSongs);
      });
      getSetListTeams(setListId).then((fetchedSetLists) => {
        setSetlistTeams(fetchedSetLists);
        setLoadingSetlist(false);
      });
    }
  }, [loading, userData]);

  const [TeamLeader, setTeamLeader] = useState<boolean>(false);
  useEffect(() => {
    const fetchLeaderStatus = async () => {
      if (!loading && userData.loggedIn) {
        const leaderStatus = await isTeamLeaderClient();
        setTeamLeader(leaderStatus.isLeader);
      }
    };
    fetchLeaderStatus();
  }, [loading, userData]);
  const renderCell = useCallback(
    (user: ChurchMemberByTeam, columnKey: React.Key) => {
      const cellValue = user[columnKey.toString() as keyof ChurchMemberByTeam];

      switch (columnKey) {
        case "name":
          return <p>{user.name + " " + user.lastname}</p>;
        case "roles":
          return <p>{user.selected_roles}</p>;

        case "status":
          const statusColorMap: Record<string, ChipColor> = {
            pending: "warning",
            confirmed: "success",
            denied: "danger",
          };

          const colorChip: ChipColor = statusColorMap[user.status] ?? "default";
          return (
            <Chip
              className="capitalize"
              color={colorChip}
              size="sm"
              variant="flat"
            >
              {user.status === "pending" && <>In attesa</>}
              {user.status === "confirmed" && <>Confermato</>}
              {user.status === "denied" && <>Rifiutato</>}
            </Chip>
          );

        default:
          if (Array.isArray(cellValue)) {
            // se è array di stringhe
            if (typeof cellValue[0] === "string") {
              return <p>{cellValue.join(", ")}</p>;
            }
            // altrimenti (array di oggetti) ritorna null o una stringa fallback
            return null;
          }
          // per altri tipi (string, boolean, JSX.Element) ritorna direttamente
          return cellValue as React.ReactNode;
      }
    },
    []
  );

  if (loadingSetlist || !setlistData) {
    return <Spinner />;
  }
  const date = new Date(setlistData.date);
  const readableDate = date.toLocaleString("it-IT", {
    weekday: "long", // "Sunday"
    year: "numeric", // "2024"
    month: "long", // "November"
    day: "numeric", // "10"
  });
  return (
    <div className="container-sub">
      <div className="song-presentation-container">
        <div className="team-show">
          <h6>
            <strong className="capitalize">{setlistData.event_title}</strong>
          </h6>
          <p className="capitalize">{readableDate}</p>
          <div className="top-settings-bar">
            <CopyLinkButton />
            {userData &&
              (hasPermission(userData.role as Role, "create:setlists") ||
                TeamLeader) && <MoreDropdownSetlist userData={userData} setlistId={setListId} />}
          </div>
        </div>

        {setlistSongs.length > 0 && (
          <>
            <Table
              key="Songs-table"
              aria-label="Team members table"
              topContent={<h6 className="font-bold">Canzoni</h6>}
            >
              <TableHeader>
                <TableColumn>Titolo</TableColumn>
                <TableColumn>Tonalità</TableColumn>
                <TableColumn>Visualizza</TableColumn>
              </TableHeader>
              <TableBody items={setlistSongs.sort((a, b) => a.order - b.order)}>
                {(song) => (
                  <TableRow key={song.id}>
                    <TableCell>
                      <strong>{song.song_title}</strong>{" "}
                    </TableCell>
                    <TableCell>{song.key}</TableCell>
                    <TableCell>
                      <ModalLyrics songData={song} />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <div className="center- gap-3 mt-5 mb-20">
              <Link href={`/setlist/${setListId}/view`}>
                <Button color="primary"> Visualizza set completo</Button>
              </Link>
            </div>
          </>
        )}

        {setlistTeams &&
          Object.entries(setlistTeams).map((team) => {
            return (
              <>
                <div className="team-show">
                  <Table
                    aria-label="Example table with dynamic content"
                    topContent={<h6 className="font-bold">{team[0]}</h6>}
                  >
                    <TableHeader columns={columns}>
                      {(column) => (
                        <TableColumn key={column.key}>
                          {column.label}
                        </TableColumn>
                      )}
                    </TableHeader>
                    <TableBody items={team[1]}>
                      {(item) => (
                        <TableRow key={item.id}>
                          {(columnKey) => (
                            <TableCell>{renderCell(item, columnKey)}</TableCell>
                          )}
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </>
            );
          })}
      </div>
    </div>
  );
}
