"use client";

import { profileT } from "@/utils/types/types";
import { getProfilesByChurch } from "@/hooks/GET/getProfilesByChurch";
import GetParamsMessage from "../components/getParams";
import Link from "next/link";
import { TiUser } from "react-icons/ti";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { BsThreeDotsVertical } from "react-icons/bs";
import { RiEdit2Line } from "react-icons/ri";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { PiTrash } from "react-icons/pi";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { Button } from "@heroui/button";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import { Spinner } from "@heroui/spinner";
import { FaRegEye } from "react-icons/fa6";

export default function PeopleComponent() {
  const { userData, loading } = useUserStore();
  const [profiles, setProfiles] = useState<any[] | null>([]);

  // Step 2: Once user is available, fetch songs
  useEffect(() => {
    if (
      !loading &&
      userData.loggedIn &&
      hasPermission(userData.role as Role, "read:churchmembers")
    ) {
      getProfilesByChurch(userData.church_id).then(
        (fetchedPeople: profileT[]) => {
          setProfiles(fetchedPeople);
        }
      );
    }
  }, [loading, userData]);

  if (!hasPermission(userData.role as Role, "read:churchmembers"))
    return (
      <div className="container-sub ">
        <div className="max-w-[600px] h-[70vh] flex flex-col justify-center items-center text-center">
          <h3> Accesso negato.</h3>
          <p>
            Per motivi di privacy solo gli amministratori della chiesa e i
            responsabili di team possono visualizzare questa pagina.
          </p>
        </div>
      </div>
    );

  return (
    <div className="container-sub ">
      <h3 className="pb-6 text-center">Chiesa</h3>

      <Table
        className="max-w-[600px]"
        topContent={<h6 className="font-bold">Membri di chiesa</h6>}
      >
        <TableHeader>
          <TableColumn>Nome</TableColumn>
          <TableColumn className="hidden sm:table-cell">Email</TableColumn>
          <TableColumn className={`max-w-[70px]`}>Azioni</TableColumn>
        </TableHeader>
        <TableBody items={profiles}>
          {(item) => (
            <TableRow key={item.profile}>
              <TableCell className="py-[2px]">
                {" "}
                {item.name} {item.lastname}
              </TableCell>
              <TableCell className="py-[2px] hidden sm:table-cell">
                {item.email}{" "}
              </TableCell>
              <TableCell className="max-w-[50px] py-[2px]">
                {hasPermission(userData.role as Role, "update:teams") && (
                  <div className="relative flex flex-row justify-center items-center gap-1 mx-auto">
                    <Dropdown>
                      <DropdownTrigger>
                        <Button
                          className="mx-auto"
                          isIconOnly
                          variant="light"
                          size="sm"
                        >
                          <BsThreeDotsVertical />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="Static Actions">
                        <DropdownItem
                          key="update"
                          as={Link}
                          startContent={<FaRegEye />}
                          href={`/people/${item.id}`}
                        >
                          Visualizza dettagli utente
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
