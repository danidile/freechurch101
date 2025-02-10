"use client";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import { Team } from "@/utils/types/types";
import { eventPlanner } from "@/utils/types/types";

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
  Select,
  SelectItem,
  Input,
} from "@heroui/react";
import { useState } from "react";
import { PressEvent } from "@react-types/shared";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useForm, FormProvider, useFormContext } from "react-hook-form";

export default function Planner({
  team,
  teamId,
}: {
  team: Team;
  teamId: number;
}) {
  const [users, setUsers] = useState(team.teamMembers);
  const { handleSubmit, setValue, watch } = useForm();
  const key: number = teamId;
  //CODICE PER FAR FUNZIONARE I CHIP

  const handleClose = (userIndex: number, roleIndex: number) => {
    setUsers((prevUsers) => {
      const updatedUsers = [...prevUsers];
      const rolesArray = updatedUsers[userIndex].roles.split(","); // Split roles into an array
      rolesArray.splice(roleIndex, 1); // Remove the role at roleIndex
      const newRoles = rolesArray.join(","); // Join the array back into a comma-separated string
      updatedUsers[userIndex] = {
        ...updatedUsers[userIndex],
        roles: newRoles,
      };

      // Update React Hook Form hidden input
      setValue(`team[${key}].users[${userIndex}].roles`, newRoles);

      return updatedUsers;
    });
  };
  //FINE CODICE PER FAR FUNZIONARE I CHIP

  const addMember = (e: PressEvent) => {
    const usersNumber: number = users.length + 1;
    const newUser = {
      id: usersNumber,
      name: "",
      roles: "",
      email: ""
    };

    setUsers((prevUsers) => [...prevUsers, newUser]);

    setValue(`team[${key}].users[${users.length}].id`, ""); // Register the new user with an empty role field
    setValue(`team[${key}].users[${users.length}].name`, ""); // Register the new user with an empty role field
    setValue(`team[${key}].users[${users.length}].email`, ""); // Register the new user with an empty role field
    setValue(`team[${key}].users[${users.length}].roles`, ""); // Register the new user with an empty role field
  };
  const { register } = useFormContext();
  return (
    <>
      <Table
        aria-label="Example table with dynamic content"
        className="planner-table"
        topContent={
          <div className="newteamfooter">
            <h5>
              {team.teamName}
            </h5>
            <input
              {...register(`team[${key}].teamId`)}
              className="hidden"
              defaultValue={team.teamId}
            />
            <input
              {...register(`team[${key}].teamName`)}
              className="hidden"
              defaultValue={team.teamName}
            />
            <Button
              size="lg"
              color="primary"
              variant="flat"
              onPress={addMember}
              isIconOnly
            >
              <PersonAddAlt1RoundedIcon />
            </Button>{" "}
          </div>
        }
        classNames={{
          wrapper: "min-h-[222px]",
        }}
      >
        <TableHeader>
          <TableColumn>Nome</TableColumn>
          <TableColumn>Ruolo/i</TableColumn>
          <TableColumn>Azioni</TableColumn>
        </TableHeader>
        <TableBody>
          {users.map((item: any, userIndex: number) => {
            return (
              <TableRow key={userIndex}>
                <TableCell className="tablecellnewteams-name">
                  <Input
                     label="Inserisci il nome del Team"
                    {...register(`team[${key}].users[${userIndex}].id`)}
                    defaultValue={item.id}
                    className="hidden"
                  />
                  <Select
                    className="max-w-xs"
                    size="sm"
                    key={item.id}
                    aria-label="Seleziona Membro"
                    placeholder="Seleziona Membro"
                    {...register(`team[${key}].users[${userIndex}].name`)}
                  >
                    {team.teamMembers.map(
                      (tMember: any, tMemberIndex: number) => {
                        return (
                          <SelectItem key={tMemberIndex}>
                            {tMember.name}
                          </SelectItem>
                        );
                      }
                    )}
                  </Select>
                </TableCell>
                <TableCell className="tablecellnewteams">
                  {" "}
                  <div className="flex gap-2">
                    <Select
                      className="max-w-xs"
                      size="sm"
                      placeholder="Seleziona Ruolo"
                      aria-label="Seleziona Ruolo"
                    >
                      {item.roles
                        .split(",")
                        .map((role: any, roleIndex: number) => {
                          if (role.length > 1) {
                            return (
                              <SelectItem key={roleIndex}>{role}</SelectItem>
                            );
                          }
                        })}
                    </Select>
                  </div>
                  {item.roles && (
                    <Input
                    label="Inserisci il nome del Team"

                      {...register(`team[${key}].users[${userIndex}].roles`)} // Register the roles field
                      type="hidden"
                      defaultValue={item.roles} // Set the value as the comma-separated roles
                    />
                  )}
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

      {/* <div className="flex justify-between">
        <pre>{JSON.stringify(users, null, 2)}</pre>
        <pre>{JSON.stringify(watch(), null, 2)}</pre>
      </div> */}
    </>
  );
}
