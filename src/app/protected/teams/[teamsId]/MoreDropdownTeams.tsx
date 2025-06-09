"use client";
import { MdMoreVert } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { FaRegCopy } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  Button,
  DropdownItem,
  Link,
} from "@heroui/react";
import { useState } from "react";
import { deleteTeamAction } from "./deleteTeamAction";

export default function MoreDropdownTeams({ teamsId }: { teamsId: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };
  const deleteTeam = async (event: any) => {
    await deleteTeamAction(teamsId);
    
  };
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="bordered" isIconOnly>
          <MdMoreVert className="text-2xl" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Dropdown menu with shortcut" variant="flat">
        <DropdownItem startContent={<MdModeEdit />} key="new" className="text-center">
          <Link
          color="foreground"
            className="w-full text-center"
            size="sm"
            href={`/protected/teams/${teamsId}/update`}
          >
            Aggiorna
          </Link>
        </DropdownItem>
        <DropdownItem startContent={<FaRegCopy />} key="copy" onPress={handleCopy} color="primary">
          Copia link
        </DropdownItem>

        <DropdownItem
          startContent={<MdDelete />}
          variant="flat"
          onPress={deleteTeam}
          key="delete"
          className="text-danger"
          color="danger"
        >
          Elimina
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
