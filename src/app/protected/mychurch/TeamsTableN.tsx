"use client";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import { Team } from "@/utils/types/types";
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
  team,
  teamId,
}: {
  team: Team;
  teamId: number;
}) {
  const [users, setUsers] = useState(team.teamMembers);
  const { handleSubmit, setValue, watch } = useForm();
  console.log("key:" + teamId);
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
      key: usersNumber.toString(),
      name: "",
      roles: "",
      email: "",
      status: "",
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
        className="team-table"
        topContent={
          <div className="newteamfooter">
            <h3>{team.teamName}</h3>
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
          <TableColumn>Email</TableColumn>
          <TableColumn>Azioni</TableColumn>
        </TableHeader>
        <TableBody>
          {users.map((item: any, userIndex: number) => {
            return (
              <TableRow key={userIndex}>
                <TableCell className="tablecellnewteams-name">
                  <input
                    {...register(`team[${key}].users[${userIndex}].id`)}
                    defaultValue={item.id}
                    className="hidden"
                  />
                  <input
                    {...register(`team[${key}].users[${userIndex}].name`)}
                    defaultValue={item.name}
                    className="table-input"
                  />
                </TableCell>
                <TableCell className="tablecellnewteams">
                  {" "}
                  <div className="flex gap-2">
                    {item.roles
                      .split(",")
                      .map((role: any, roleIndex: number) => {
                        if (role.length > 1) {
                          return (
                            <Chip
                              key={roleIndex}
                              variant="flat"
                              onClose={() => handleClose(userIndex, roleIndex)}
                            >
                              {role}
                            </Chip>
                          );
                        }
                      })}
                    <p> + </p>
                  </div>
                  {item.roles && (
                    <input
                      {...register(`team[${key}].users[${userIndex}].roles`)} // Register the roles field
                      type="hidden"
                      defaultValue={item.roles} // Set the value as the comma-separated roles
                    />
                  )}
                </TableCell>
                <TableCell className="tablecellnewteams">
                  <input
                    {...register(`team[${key}].users[${userIndex}].email`)}
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

      {/* <div className="flex justify-between">
        <pre>{JSON.stringify(users, null, 2)}</pre>
        <pre>{JSON.stringify(watch(), null, 2)}</pre>
      </div> */}
    </>
  );
}
