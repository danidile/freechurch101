"use client";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";

export default function NewEventButtonComponent() {
  return (
    <Button
      href="/setlist/addSetlist"
      radius="sm"
      className="bg-black text-white mr-0"
      variant="solid"
    >
      Nuovo Evento
    </Button>
    // <Dropdown className="mr-0">
    //   <DropdownTrigger>

    //   </DropdownTrigger>
    //   <DropdownMenu aria-label="Action event example">
    //     <DropdownItem href="/setlist/addSetlist" key="single">
    //       Evento Singolo
    //     </DropdownItem>
    //     <DropdownItem href="/setlist/addSetlist" key="repetitive">
    //       Evento Ripetuto
    //     </DropdownItem>
    //   </DropdownMenu>
    // </Dropdown>
  );
}
