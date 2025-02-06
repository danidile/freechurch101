"use client";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import { profileT, Team } from "@/utils/types/types";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  user,
} from "@nextui-org/react";
import { useState } from "react";
import { PressEvent } from "@react-types/shared";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useForm, useFormContext } from "react-hook-form";

export default function TeamsTableN({
  profiles,
}: {
  profiles: profileT[];
}) {
  const [users, setUsers] = useState(profiles);
  const { handleSubmit, setValue, watch } = useForm();

  const { register } = useFormContext();
  return (
    <>
      <Table
        aria-label="Example table with dynamic content"
        className="team-table"
      >
        <TableHeader>
          <TableColumn>Nome</TableColumn>
          <TableColumn>Ruolo/i</TableColumn>
          <TableColumn>Email</TableColumn>
          <TableColumn>Azioni</TableColumn>
        </TableHeader>
        <TableBody>
          {users.map((item: any, userIndex: number) => {
            return (
              <TableRow key={userIndex}>
                <TableCell className="tablecellnewteams-name">
                  <input
                    {...register(`team.users[${userIndex}].id`)}
                    defaultValue={item.id}
                    className="hidden"
                  />
                  <input
                    {...register(`team.users[${userIndex}].name`)}
                    defaultValue={item.name}
                    className="table-input"
                  />
                </TableCell>
                <TableCell className="tablecellnewteams">
                <p className="text-center">{item.role}</p>
                </TableCell>
                <TableCell className="tablecellnewteams">
                  <input
                    {...register(`team.users[${userIndex}].email`)}
                    defaultValue={item.email}
                    className="table-input"
                  />
                </TableCell>
                <TableCell className="tablecellnewteams">
                  <div className="relative flex justify-end items-center gap-2">
                    <Dropdown className="bg-background border-1 border-default-200">
                      <DropdownTrigger>
                        <Button
                          isIconOnly
                          radius="full"
                          size="sm"
                          variant="light"
                        >
                          <MoreVertIcon className="text-default-400" />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu>
                        <DropdownItem key="view">View</DropdownItem>
                        <DropdownItem key="edit">Edit</DropdownItem>
                        <DropdownItem key="delete">Delete</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <div className="flex justify-between">
        <pre>{JSON.stringify(users, null, 2)}</pre>
        <pre>{JSON.stringify(watch(), null, 2)}</pre>
      </div>
    </>
  );
}
