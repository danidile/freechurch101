"use client";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
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
  Input,
} from "@nextui-org/react";
import { useCallback, useEffect } from "react";
import { useMemo, useState } from "react";
import { PressEvent } from "@react-types/shared";
import MoreVertIcon from '@mui/icons-material/MoreVert';
export default function TeamsTable({ teamMembers }: { teamMembers: any }) {
  const [users, setUsers] = useState([
    {
      key: "1",
      name: "",
      role: "",
      email: "",
      status: "",
    },
  ]);

  const [page, setPage] = useState(1);
  const rowsPerPage = 15;

  //CODICE PER FAR FUNZIONARE I CHIP
 
  const [role, setRole] = useState(["Apple", "Banana", "Cherry", "Watermelon", "Orange"]);

  const handleClose = (index: number) => {
    console.log("Removing fruit at index:", index);
    setUsers((us)=>{us.});
    // Update the fruits state with the filtered array
    setRole((prevRole) => {
      // Check if the index is valid and remove it
      const newRole = prevRole.filter((_, idx) => idx !== index);
      return newRole;
    });
  };

  // Log the updated role after state changes
  useEffect(() => {
    console.log("Updated role:", role);
  }, [role]); // Runs whenever `role` changes

  //FINE CODICE PER FAR FUNZIONARE I CHIP

  const pages = Math.ceil(users.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return users.slice(start, end);
  }, [page, users]);

  const addMember = (e: PressEvent) => {
    console.log(users);
    const usersNumber: number = users.length + 1;
    setUsers([
      ...users,
      {
        key: usersNumber.toString(),
        name: "",
        role: "",
        email: "",
        status: "",
      },
    ]);
  };

  const renderCell = useCallback(
    (
      user: {
        [x: string]: any;
        team:
          | string
          | number
          | bigint
          | boolean
          | React.ReactElement<any, string | React.JSXElementConstructor<any>>
          | Iterable<React.ReactNode>
          | React.ReactPortal
          | Promise<React.AwaitedReactNode>;
      },
      columnKey: string | number
    ) => {
      const cellValue = user[columnKey];

      switch (columnKey) {
        case "name":
          return (
            <input
              type="text"
              defaultValue={cellValue}
              className="table-input"
            />
          );
        case "role":
          return (
            <div className="flex gap-2">
              {role.map((fruit, index) => (
                <Chip
                  key={index}
                  variant="flat"
                  onClose={() => handleClose(index)}
                >
                  {fruit}
                </Chip>
              ))}
              <p> + </p>
            </div>
          );
        case "email":
          return <input type="text" className="table-input" />;
        case "status":
          return (
            <Chip
              className="capitalize border-none gap-1 text-default-600"
              size="sm"
              variant="dot"
            >
              {cellValue}
            </Chip>
          );
        case "actions":
          return (
            <div className="relative flex justify-end items-center gap-2">
              <Dropdown className="bg-background border-1 border-default-200">
                <DropdownTrigger>
                  <Button isIconOnly radius="full" size="sm" variant="light">
                    <MoreVertIcon
                      className="text-default-400"
                      
                    />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem key="view">View</DropdownItem>
                  <DropdownItem key="edit">Edit</DropdownItem>
                  <DropdownItem key="delete">Delete</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          );
        default:
          return cellValue;
      }
    },
    []
  );

  return (
    <>
      <Table
        aria-label="Example table with client side pagination"
        topContent={
          <div className="newteamfooter">
            <h3>{teamMembers.teamName}</h3>
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
          <TableColumn key="name" className="team-table-header">
            Nome
          </TableColumn>
          <TableColumn key="role" className="team-table-header">
            Ruolo/i
          </TableColumn>
          <TableColumn key="email" className="team-table-header">
            Email
          </TableColumn>
          {/* <TableColumn key="status" className="team-table-header">
            STATUS
          </TableColumn> */}
          <TableColumn key="actions" className="team-table-header">
            Azioni
          </TableColumn>
        </TableHeader>
        <TableBody items={users}>
          {(item) => (
            <TableRow key={item.key}>
              {(columnKey) => (
                <TableCell className="tablecellnewteams">
                  {renderCell(item, columnKey)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
