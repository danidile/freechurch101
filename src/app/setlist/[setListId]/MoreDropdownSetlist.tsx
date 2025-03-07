"use client";
import { MdMoreVert } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { FaRegCopy } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";
import { RiSettings4Fill } from "react-icons/ri";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  Button,
  DropdownSection,
  DropdownItem,
  Link,
} from "@heroui/react";
import { useState } from "react";
import { deleteSetList } from "./deleteSetlistAction";

export default function MoreDropdowSetlist({
  setlistId,
}: {
  setlistId: string;
}) {
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
  const deleteSetlist = (event: any) => {
    deleteSetList(setlistId);
  };
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="flat" isIconOnly>
          <RiSettings4Fill size={25} color="#000000" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Dropdown menu with shortcut" variant="flat">
        <DropdownItem
          startContent={<MdModeEdit />}
          key="new"
          className="text-center"
        >
          <Link
            color="foreground"
            className="w-full text-center"
            size="sm"
            href={`/setlist/${setlistId}/update`}
          >
            Aggiorna
          </Link>
        </DropdownItem>
        <DropdownItem
          startContent={<MdDelete />}
          variant="flat"
          onPress={deleteSetlist}
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
